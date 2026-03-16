import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../convex/_generated/api"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is required")
}

const convex = new ConvexHttpClient(convexUrl)

type GoogleEvent = {
  id?: string
  start?: { dateTime?: string }
  end?: { dateTime?: string }
}

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await clerkClient()
  const tokenResponse = await client.users.getUserOauthAccessToken(
    userId,
    "oauth_google"
  )
  const accessToken = tokenResponse.data?.[0]?.token

  if (!accessToken) {
    return NextResponse.json(
      { error: "No Google token found for this user" },
      { status: 400 }
    )
  }

  const now = new Date()
  const fourWeeksLater = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000)
  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events")
  url.searchParams.set("timeMin", now.toISOString())
  url.searchParams.set("timeMax", fourWeeksLater.toISOString())
  url.searchParams.set("singleEvents", "true")
  url.searchParams.set("orderBy", "startTime")

  const calendarResponse = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!calendarResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch calendar from Google" },
      { status: 502 }
    )
  }

  const data = (await calendarResponse.json()) as { items?: GoogleEvent[] }
  const events = (data.items ?? [])
    .filter((item) => item.id && item.start?.dateTime && item.end?.dateTime)
    .map((item) => ({
      googleEventId: item.id!,
      title: "Busy",
      startTime: new Date(item.start!.dateTime!).getTime(),
      endTime: new Date(item.end!.dateTime!).getTime(),
    }))

  const convexUser = await convex.query(api.users.getUserByClerkId, {
    clerkId: userId,
  })
  if (!convexUser) {
    return NextResponse.json(
      { error: "User not found in Convex. Complete onboarding first." },
      { status: 404 }
    )
  }

  await convex.mutation(api.calendar.syncEvents, {
    userId: convexUser._id,
    events,
  })

  return NextResponse.json({ synced: events.length })
}
