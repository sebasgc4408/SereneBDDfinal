import { NextRequest, NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../../convex/_generated/api"
import { Id } from "../../../../../convex/_generated/dataModel"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
  const {
    psychologistClerkId,
    appointmentId,
    startTime,
    endTime,
    patientName,
    patientEmail,
    psychologistName,
    timezone,
  } = (await req.json()) as {
    psychologistClerkId: string
    appointmentId: string
    startTime: number
    endTime: number
    patientName: string
    patientEmail: string
    psychologistName: string
    timezone: string
  }

  const client = await clerkClient()
  const tokenResponse = await client.users.getUserOauthAccessToken(
    psychologistClerkId,
    "oauth_google"
  )
  const accessToken = tokenResponse.data?.[0]?.token

  if (!accessToken) {
    return NextResponse.json(
      { error: "No Google token found for psychologist" },
      { status: 400 }
    )
  }

  const event = {
    summary: `Sesión con ${patientName}`,
    description: `Paciente: ${patientName} (${patientEmail})`,
    start: {
      dateTime: new Date(startTime).toISOString(),
      timeZone: timezone,
    },
    end: {
      dateTime: new Date(endTime).toISOString(),
      timeZone: timezone,
    },
  }

  const calendarResponse = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  )

  if (!calendarResponse.ok) {
    const errorBody = await calendarResponse.json()
    console.error("Google Calendar API error:", errorBody)
    return NextResponse.json(
      { error: "Failed to create Google Calendar event" },
      { status: 502 }
    )
  }

  const createdEvent = (await calendarResponse.json()) as { id: string }

  await convex.mutation(api.appointments.updateGoogleEventId, {
    appointmentId: appointmentId as Id<"appointments">,
    googleEventId: createdEvent.id,
  })

  return NextResponse.json({ googleEventId: createdEvent.id })
}
