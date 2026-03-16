'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import IntegrationStatus from './IntegrationStatus'
import { useStoreUser } from '@/hooks/useStoreUser'

const Dashboard = () => {
  const { user, isLoaded } = useUser()
  const convexUser = useStoreUser()

  const appointments = useQuery(
    api.appointments.getAppointmentsForUser,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  )
  const kpis = useQuery(
    api.analytics.getKpis,
    convexUser?._id ? { psychologistId: convexUser._id } : 'skip'
  )
  const whatsappStatus = useQuery(
    api.whatsapp.getIntegrationStatus,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  )

  const updateUser = useMutation(api.users.updateUser)
  const markCompleted = useMutation(api.appointments.markCompleted)
  const markNoShow = useMutation(api.appointments.markNoShow)
  const cancelAppointment = useMutation(api.appointments.cancelAppointment)

  const [expandedAppointmentId, setExpandedAppointmentId] = useState<
    Id<'appointments'> | null
  >(null)
  const [pendingActionId, setPendingActionId] = useState<Id<'appointments'> | null>(
    null
  )

  const calendarConnected = convexUser?.integrationStatus === 'Connected'
  const timezone = convexUser?.timezone ?? 'America/Bogota'

  useEffect(() => {
    if (!calendarConnected) return
    void fetch('/api/calendar-sync', { method: 'POST' })
  }, [calendarConnected])

  useEffect(() => {
    if (!calendarConnected) return
    const interval = setInterval(() => {
      void fetch('/api/calendar-sync', { method: 'POST' })
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [calendarConnected])

  const orderedAppointments = useMemo(() => {
    return [...(appointments ?? [])].sort((a, b) => a.startTime - b.startTime)
  }, [appointments])

  const greeting = user?.firstName ? `Good morning, ${user.firstName}` : 'Good morning'

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    })
  }

  const copyPublicLink = async () => {
    if (!convexUser) return
    const slug = convexUser.publicSlug ?? convexUser._id
    await navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`)
  }

  const runAppointmentAction = async (
    appointmentId: Id<'appointments'>,
    action: 'completed' | 'no-show' | 'cancelled'
  ) => {
    setPendingActionId(appointmentId)
    try {
      if (action === 'completed') {
        await markCompleted({ appointmentId })
      }
      if (action === 'no-show') {
        await markNoShow({ appointmentId })
      }
      if (action === 'cancelled') {
        await cancelAppointment({ appointmentId })
      }
    } finally {
      setPendingActionId(null)
    }
  }

  if (!isLoaded) return <div className="min-h-screen bg-[#FAFAF9]" />

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-5 bg-white/80 backdrop-blur-md border-b border-[#F2F2F0]">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full bg-[#788B80]" />
          <span className="text-lg font-medium tracking-wide text-[#292524]">Serene</span>
        </div>
        <div className="flex items-center gap-5">
          {convexUser?.userType === 'psychologist' && (
            <span className="hidden md:inline-flex items-center rounded-full bg-[#EAECEB] px-3 py-1 text-[12px] font-medium text-[#57534E]">
              Psychologist
            </span>
          )}
          <div className="hidden md:flex items-center gap-2 text-[13px] font-medium text-[#78716C]">
            <span
              className={`h-2 w-2 rounded-full ${
                calendarConnected ? 'bg-[#788B80]' : 'bg-[#A8A29E]'
              }`}
            />
            {calendarConnected ? 'Calendar Synced' : 'Calendar Not Connected'}
          </div>
          <div className="w-px h-5 bg-[#EAECEB] hidden md:block" />
          <UserButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <header className="mb-12 md:mb-16">
          <h1 className="text-3xl md:text-[36px] font-light tracking-tight text-[#292524] mb-3">
            {greeting}
          </h1>
          <p className="text-[15px] md:text-base text-[#78716C] font-light">
            {appointments === undefined
              ? 'Cargando tus sesiones...'
              : `Tienes ${appointments.length} citas registradas.`}
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-[#F2F2F0] p-4">
            <p className="text-xs text-[#A8A29E]">Total citas</p>
            <p className="text-2xl text-[#292524] font-medium">
              {kpis?.totalAppointments ?? '—'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#F2F2F0] p-4">
            <p className="text-xs text-[#A8A29E]">Completion rate</p>
            <p className="text-2xl text-[#292524] font-medium">
              {kpis?.completionRate ?? '—'}%
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#F2F2F0] p-4">
            <p className="text-xs text-[#A8A29E]">No-show rate</p>
            <p className="text-2xl text-[#292524] font-medium">
              {kpis?.noShowRate ?? '—'}%
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[19px] font-medium tracking-wide text-[#292524]">
                Appointments
              </h2>
              <button
                onClick={() => window.open('https://calendar.google.com', '_blank')}
                className="text-sm font-medium text-[#788B80] hover:text-[#5c6e64] transition-colors"
              >
                View Calendar
              </button>
            </div>

            <div className="bg-white rounded-3xl p-3 shadow-[0_4px_30px_rgb(0,0,0,0.02)] border border-[#F2F2F0]">
              {appointments === undefined ? (
                <div className="p-6 text-sm text-[#78716C]">Cargando citas...</div>
              ) : orderedAppointments.length === 0 ? (
                <div className="p-6 text-sm text-[#78716C]">
                  No tienes citas próximas.
                </div>
              ) : (
                orderedAppointments.map((appointment, index) => {
                  const isExpanded = expandedAppointmentId === appointment._id
                  const isPending = pendingActionId === appointment._id
                  return (
                    <div
                      key={appointment._id}
                      className={`p-5 rounded-2xl transition-colors hover:bg-[#FAFAF9] ${
                        index !== orderedAppointments.length - 1
                          ? 'border-b border-[#F2F2F0]/50'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-[15px] font-medium text-[#292524] mb-1">
                            {appointment.patientName}
                          </div>
                          <div className="text-xs text-[#78716C]">
                            {formatDateTime(appointment.startTime)} · {appointment.status}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedAppointmentId(isExpanded ? null : appointment._id)
                          }
                          className="w-full sm:w-auto h-10 px-5 rounded-xl border border-[#EAECEB] text-sm font-medium text-[#57534E] hover:bg-[#FAFAF9] hover:border-[#D9DDDB] transition-all active:scale-[0.98]"
                        >
                          {isExpanded ? 'Hide Details' : 'Details'}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[#EAECEB] space-y-4">
                          <div className="text-sm text-[#57534E] space-y-1">
                            <p>Email: {appointment.patientEmail}</p>
                            <p>Phone: {appointment.patientPhone ?? 'No registrado'}</p>
                            <p>
                              WhatsApp opt-in:{' '}
                              {appointment.whatsappOptIn ? 'Sí' : 'No'}
                            </p>
                            <p>
                              Confirmada por WhatsApp:{' '}
                              {appointment.confirmedViaWhatsApp ? 'Sí' : 'No'}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              disabled={isPending}
                              onClick={() =>
                                void runAppointmentAction(appointment._id, 'completed')
                              }
                              className="h-9 px-4 rounded-lg border border-[#EAECEB] text-sm text-[#292524] hover:bg-[#FAFAF9] disabled:opacity-60"
                            >
                              Mark Completed
                            </button>
                            <button
                              disabled={isPending}
                              onClick={() =>
                                void runAppointmentAction(appointment._id, 'no-show')
                              }
                              className="h-9 px-4 rounded-lg border border-[#EAECEB] text-sm text-[#292524] hover:bg-[#FAFAF9] disabled:opacity-60"
                            >
                              Mark No-show
                            </button>
                            <button
                              disabled={isPending}
                              onClick={() =>
                                void runAppointmentAction(appointment._id, 'cancelled')
                              }
                              className="h-9 px-4 rounded-lg border border-[#F5C2C2] text-sm text-[#D9534F] hover:bg-[#FEF5F5] disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-[17px] font-medium tracking-wide text-[#292524] px-1 mb-2">
                Quick Actions
              </h2>
              <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-[#F2F2F0] p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-[15px] font-medium text-[#292524] mb-2">
                    Share Booking Link
                  </h3>
                  <p className="text-[13px] text-[#78716C] leading-relaxed">
                    Tu zona horaria activa es {timezone}. Tus pacientes verán los horarios
                    en esa misma zona.
                  </p>
                </div>
                <button
                  onClick={() => void copyPublicLink()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#F2F2F0] bg-white text-[13px] font-medium text-[#292524] hover:border-[#788B80] hover:text-[#788B80] hover:bg-[#FAFAF9] transition-colors"
                >
                  Copy Public Link
                </button>
              </div>
            </div>

            <IntegrationStatus
              calendarConnected={calendarConnected}
              whatsappConnected={whatsappStatus?.whatsappConnected ?? false}
              onDisconnectCalendar={async () => {
                if (!convexUser?._id) return
                await updateUser({
                  userId: convexUser._id,
                  integrationStatus: 'Disconnected',
                })
              }}
              onDisconnectWhatsApp={async () => {
                if (!convexUser?._id) return
                await updateUser({
                  userId: convexUser._id,
                  whatsappEnabled: false,
                })
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
