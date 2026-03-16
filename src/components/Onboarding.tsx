'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useStoreUser } from '@/hooks/useStoreUser'

type OnboardingStep = 'calendar' | 'schedule' | 'ready'

const weekdays = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
]

function createSlugBase(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const Onboarding = () => {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const convexUser = useStoreUser()
  const updateUser = useMutation(api.users.updateUser)
  const createAvailability = useMutation(api.availability.createAvailability)

  const availability = useQuery(
    api.availability.getAvailability,
    convexUser?._id ? { psychologistId: convexUser._id } : 'skip'
  )

  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('calendar')
  const [isSavingSchedule, setIsSavingSchedule] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [justCompletedOnboarding, setJustCompletedOnboarding] = useState(false)
  const syncRequested = useRef(false)
  const statusPatched = useRef(false)

  const [schedule, setSchedule] = useState({
    days: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 50,
    breakTime: 10,
  })

  const hasGoogleConnected = useMemo(() => {
    return Boolean(
      user?.externalAccounts?.some(
        (account) => String(account.provider).toLowerCase().includes('google')
      )
    )
  }, [user?.externalAccounts])

  const hasSchedule = (availability?.length ?? 0) > 0
  const hasPublicSlug = Boolean(convexUser?.publicSlug)
  const isFullyOnboarded =
    convexUser?.integrationStatus === 'Connected' && hasSchedule && hasPublicSlug

  useEffect(() => {
    if (!convexUser?._id || !hasGoogleConnected || statusPatched.current) return
    if (convexUser.integrationStatus === 'Connected') return
    statusPatched.current = true
    void updateUser({
      userId: convexUser._id,
      integrationStatus: 'Connected',
    })
  }, [convexUser?._id, convexUser?.integrationStatus, hasGoogleConnected, updateUser])

  useEffect(() => {
    if (!convexUser || availability === undefined) return
    if (isFullyOnboarded) {
      if (!justCompletedOnboarding) {
        router.replace('/dashboard')
      } else {
        setOnboardingStep('ready')
      }
      return
    }

    if (convexUser.integrationStatus === 'Connected') {
      setOnboardingStep('schedule')
      return
    }
    setOnboardingStep('calendar')
  }, [
    convexUser,
    availability,
    isFullyOnboarded,
    justCompletedOnboarding,
    router,
  ])

  const handleConnect = async () => {
    if (!user) return

    const calendarScopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ]

    try {
      const existingGoogle = user.externalAccounts.find((a) =>
        String(a.provider).toLowerCase().includes('google')
      )

      const onboardingUrl = `${window.location.origin}/onboarding`

      const result = existingGoogle
        ? await existingGoogle.reauthorize({
            additionalScopes: calendarScopes,
            redirectUrl: onboardingUrl,
          })
        : await user.createExternalAccount({
            strategy: 'oauth_google',
            redirectUrl: onboardingUrl,
            additionalScopes: calendarScopes,
          })

      const redirectUrl = result.verification?.externalVerificationRedirectURL
      if (redirectUrl) {
        window.location.href = redirectUrl.href
      }
    } catch (err) {
      console.error('Failed to connect Google Calendar', err)
    }
  }

  const toggleDay = (day: number) => {
    setSchedule((previous) => {
      const isSelected = previous.days.includes(day)
      const nextDays = isSelected
        ? previous.days.filter((item) => item !== day)
        : [...previous.days, day].sort((a, b) => a - b)
      return { ...previous, days: nextDays }
    })
  }

  const handleSaveSchedule = async () => {
    if (!convexUser?._id) return
    if (schedule.days.length === 0) {
      setSaveError('Selecciona al menos un día de atención.')
      return
    }
    if (schedule.startTime >= schedule.endTime) {
      setSaveError('La hora de inicio debe ser menor que la hora de fin.')
      return
    }

    setSaveError(null)
    setIsSavingSchedule(true)
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const slugBase = createSlugBase(
        convexUser.name ?? user?.fullName ?? user?.firstName ?? convexUser.email
      )

      await updateUser({
        userId: convexUser._id,
        timezone: detectedTimezone,
        publicSlug: slugBase || convexUser._id,
        integrationStatus: 'Connected',
      })

      const existingDays = new Set((availability ?? []).map((item) => item.dayOfWeek))

      for (const day of schedule.days) {
        if (!existingDays.has(day)) {
          await createAvailability({
            psychologistId: convexUser._id,
            dayOfWeek: day,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            slotDurationMinutes: schedule.slotDuration,
            breakMinutes: schedule.breakTime,
          })
        }
      }

      if (!syncRequested.current) {
        syncRequested.current = true
        await fetch('/api/calendar-sync', { method: 'POST' })
      }

      setJustCompletedOnboarding(true)
      setOnboardingStep('ready')
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar tu configuración.'
      )
    } finally {
      setIsSavingSchedule(false)
    }
  }

  if (!isLoaded) return <div className="min-h-screen bg-[#FAFAF9]" />

  const publicUrl =
    typeof window !== 'undefined' && convexUser?.publicSlug
      ? `${window.location.origin}/book/${convexUser.publicSlug}`
      : ''

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-[#F2F2F0] bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full bg-[#788B80]" />
          <span className="text-lg font-medium tracking-wide text-[#292524]">Serene</span>
        </div>
        <div className="text-sm text-[#A8A29E] font-light">
          {onboardingStep === 'calendar'
            ? 'Step 1 of 3'
            : onboardingStep === 'schedule'
              ? 'Step 2 of 3'
              : 'Step 3 of 3'}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {onboardingStep === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(4px)', y: 15 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl flex flex-col lg:flex-row gap-12 lg:gap-20 items-center"
          >
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl md:text-[40px] font-light tracking-tight text-[#292524] mb-6 leading-[1.15] max-w-lg">
                Connect your schedule seamlessly
              </h1>
              <p className="text-[15px] md:text-base font-light leading-relaxed text-[#78716C] mb-8 max-w-md lg:max-w-none">
                Serene needs read-only access to your calendar to find available slots for your patients.
              </p>
            </div>

            <div className="w-full max-w-sm lg:w-[360px]">
              <div className="rounded-3xl bg-white p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-[#F2F2F0] flex flex-col items-center">
                <h3 className="text-xl font-medium text-[#292524] mb-3">Google Calendar</h3>
                <p className="text-[15px] text-center text-[#A8A29E] font-light mb-8 leading-relaxed">
                  Connect your professional calendar to enable real-time booking.
                </p>
                <button
                  onClick={() => void handleConnect()}
                  className="w-full flex items-center justify-center h-[52px] rounded-xl bg-[#292524] px-6 text-[15px] font-medium tracking-wide text-white transition-all duration-500 ease-out hover:bg-[#1C1917]"
                >
                  Authenticate Google
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {onboardingStep === 'schedule' && (
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#F2F2F0] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
            <h1 className="text-3xl font-light tracking-tight text-[#292524] mb-3">
              Define your weekly availability
            </h1>
            <p className="text-[#78716C] mb-6">
              Configura tus horarios de atención. Los pacientes verán estos slots en tu zona horaria.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#57534E] mb-2">Días de atención</label>
                <div className="flex flex-wrap gap-2">
                  {weekdays.map((day) => {
                    const active = schedule.days.includes(day.value)
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`h-10 px-4 rounded-lg border text-sm ${
                          active
                            ? 'bg-[#292524] text-white border-[#292524]'
                            : 'bg-white text-[#57534E] border-[#EAECEB]'
                        }`}
                      >
                        {day.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-[#57534E]">
                  Hora de inicio
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(event) =>
                      setSchedule((prev) => ({ ...prev, startTime: event.target.value }))
                    }
                    className="mt-2 w-full h-11 rounded-lg border border-[#EAECEB] px-3"
                  />
                </label>
                <label className="text-sm text-[#57534E]">
                  Hora de fin
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(event) =>
                      setSchedule((prev) => ({ ...prev, endTime: event.target.value }))
                    }
                    className="mt-2 w-full h-11 rounded-lg border border-[#EAECEB] px-3"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-[#57534E]">
                  Duración sesión (min)
                  <input
                    type="number"
                    min={20}
                    step={5}
                    value={schedule.slotDuration}
                    onChange={(event) =>
                      setSchedule((prev) => ({
                        ...prev,
                        slotDuration: Number(event.target.value),
                      }))
                    }
                    className="mt-2 w-full h-11 rounded-lg border border-[#EAECEB] px-3"
                  />
                </label>
                <label className="text-sm text-[#57534E]">
                  Descanso (min)
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={schedule.breakTime}
                    onChange={(event) =>
                      setSchedule((prev) => ({
                        ...prev,
                        breakTime: Number(event.target.value),
                      }))
                    }
                    className="mt-2 w-full h-11 rounded-lg border border-[#EAECEB] px-3"
                  />
                </label>
              </div>

              {saveError && <p className="text-sm text-[#D9534F]">{saveError}</p>}

              <button
                disabled={isSavingSchedule}
                onClick={() => void handleSaveSchedule()}
                className="w-full h-[52px] rounded-xl bg-[#292524] text-white font-medium disabled:opacity-70"
              >
                {isSavingSchedule ? 'Guardando...' : 'Guardar configuración'}
              </button>
            </div>
          </div>
        )}

        {onboardingStep === 'ready' && (
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#F2F2F0] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
            <h1 className="text-3xl font-light tracking-tight text-[#292524] mb-3">
              Tu enlace público está listo
            </h1>
            <p className="text-[#78716C] mb-6">
              Compártelo con tus pacientes para que agenden citas en los horarios disponibles.
            </p>
            <div className="rounded-xl border border-[#EAECEB] bg-[#FAFAF9] p-4 mb-6 break-all text-sm text-[#57534E]">
              {publicUrl || 'Generando enlace...'}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => publicUrl && navigator.clipboard.writeText(publicUrl)}
                className="h-11 px-5 rounded-xl border border-[#EAECEB] text-sm font-medium text-[#292524]"
              >
                Copiar link
              </button>
              <Link
                href="/dashboard"
                className="h-11 px-5 rounded-xl bg-[#292524] text-white text-sm font-medium inline-flex items-center justify-center"
              >
                Ir al Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Onboarding
