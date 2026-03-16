'use client'

import React, { useMemo, useState } from 'react'
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import PatientIntakeForm from './PatientIntakeForm'
import BookingConfirmation from './BookingConfirmation'

interface BookingPageProps {
  slug: string
}

type BookingStep = 'select' | 'intake' | 'confirmation'
type Slot = { startTime: number; endTime: number }
type IntakeData = {
  name: string
  email: string
  phone: string
  whatsappOptIn: boolean
}

const BookingPage: React.FC<BookingPageProps> = ({ slug }) => {
  const [step, setStep] = useState<BookingStep>('select')
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [patientName, setPatientName] = useState('')
  const [bookingError, setBookingError] = useState<string | null>(null)

  const psychologist = useQuery(api.users.getUserBySlug, { slug })
  const createAppointment = useMutation(api.appointments.createAppointment)

  const timezone = psychologist?.timezone ?? 'America/Bogota'

  const upcomingDates = useMemo(() => {
    if (!psychologist) return []
    return Array.from({ length: 14 }, (_, index) => {
      const current = new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000)
      const dayKey = formatInTimeZone(current, timezone, 'yyyy-MM-dd')
      const dayStart = fromZonedTime(`${dayKey}T00:00:00`, timezone).getTime()
      return {
        key: dayStart,
        day: formatInTimeZone(dayStart, timezone, 'EEE').toUpperCase(),
        date: formatInTimeZone(dayStart, timezone, 'd'),
      }
    })
  }, [psychologist, timezone])

  const availableSlots = useQuery(
    api.availability.getAvailableSlots,
    psychologist?._id && selectedDate
      ? { psychologistId: psychologist._id, date: selectedDate }
      : 'skip'
  )

  const psychologistName = psychologist?.name ?? 'Tu psicólogo'
  const selectedDateLabel = selectedSlot
    ? formatInTimeZone(selectedSlot.startTime, timezone, "EEE d 'de' MMM")
    : selectedDate
      ? formatInTimeZone(selectedDate, timezone, "EEE d 'de' MMM")
      : ''
  const selectedTimeLabel = selectedSlot
    ? formatInTimeZone(selectedSlot.startTime, timezone, 'HH:mm')
    : ''

  const handleIntakeSubmit = async (data: IntakeData) => {
    if (!psychologist || !selectedSlot) return
    setBookingError(null)
    try {
      const appointmentId = await createAppointment({
        userId: psychologist._id,
        patientName: data.name,
        patientEmail: data.email,
        patientPhone: data.phone || undefined,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        whatsappOptIn: data.whatsappOptIn,
        channel: 'web',
      })

      if (psychologist.clerkId && psychologist.integrationStatus === 'Connected') {
        fetch('/api/appointments/google-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            psychologistClerkId: psychologist.clerkId,
            appointmentId,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            patientName: data.name,
            patientEmail: data.email,
            psychologistName: psychologist.name ?? '',
            timezone,
          }),
        }).catch((err) => console.error('Google Calendar sync failed:', err))
      }

      setPatientName(data.name)
      setStep('confirmation')
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : 'No fue posible reservar este horario.'
      )
      setStep('select')
      setSelectedSlot(null)
    }
  }

  if (psychologist === undefined) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <p className="text-[#78716C]">Cargando agenda...</p>
      </div>
    )
  }

  if (psychologist === null) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white border border-[#F2F2F0] rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-light text-[#292524] mb-3">
            Este enlace no está disponible
          </h1>
          <p className="text-[#78716C]">
            El perfil de reserva no existe o fue desactivado.
          </p>
        </div>
      </div>
    )
  }

  if (step === 'intake' && selectedSlot) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white flex flex-col items-center py-16 px-6 sm:py-24">
        <div className="mb-12 text-center max-w-lg">
          <h1 className="text-3xl font-light tracking-tight text-[#292524] mb-3">
            Complete your details
          </h1>
          <p className="text-[#78716C] font-light text-[15px] leading-relaxed">
            Just a few details so we can confirm your session with {psychologistName}.
          </p>
        </div>
        <PatientIntakeForm
          selectedTime={selectedTimeLabel}
          selectedDate={selectedDateLabel}
          onSubmit={(data) => void handleIntakeSubmit(data)}
        />
      </div>
    )
  }

  if (step === 'confirmation') {
    return (
      <BookingConfirmation
        patientName={patientName}
        date={selectedDateLabel}
        time={selectedTimeLabel}
        psychologistName={psychologistName}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white flex flex-col items-center py-16 px-6 sm:py-24">
      <div className="mb-12 text-center max-w-lg">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-[#EAECEB] flex items-center justify-center">
          <svg className="h-6 w-6 text-[#57534E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-light tracking-tight text-[#292524] mb-3">
          Book a session with {psychologistName}
        </h1>
        <p className="text-[#78716C] font-light text-[15px] leading-relaxed">
          Take your time. All slots shown are in <strong>{timezone}</strong>.
        </p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-[24px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-[#F2F2F0] p-6 sm:p-10">
        {bookingError && (
          <div className="mb-6 rounded-xl border border-[#F5C2C2] bg-[#FEF5F5] p-4 text-sm text-[#A94442]">
            {bookingError}
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-[17px] font-medium text-[#292524] mb-5">Select a date</h2>

          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {upcomingDates.map((dateOption) => (
              <button
                key={dateOption.key}
                onClick={() => {
                  setSelectedDate(dateOption.key)
                  setSelectedSlot(null)
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                  selectedDate === dateOption.key
                    ? 'bg-[#292524] text-white shadow-md shadow-black/10 scale-[1.02]'
                    : 'bg-white border border-[#EAECEB] text-[#57534E] hover:border-[#788B80] hover:text-[#292524]'
                }`}
              >
                <span className="text-[11px] font-medium uppercase tracking-wider mb-1">
                  {dateOption.day}
                </span>
                <span className="text-xl font-light">{dateOption.date}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            selectedDate ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-6 border-t border-[#F2F2F0]">
            <h2 className="text-[17px] font-medium text-[#292524] mb-5">Available times</h2>
            {selectedDate && availableSlots === undefined ? (
              <p className="text-sm text-[#78716C]">Cargando horarios...</p>
            ) : availableSlots && availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot?.startTime === slot.startTime
                  return (
                    <button
                      key={slot.startTime}
                      onClick={() => setSelectedSlot(slot)}
                      className={`flex items-center justify-center h-12 rounded-xl border text-[14px] font-medium transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#292524] bg-[#292524] text-white'
                          : 'border-[#EAECEB] text-[#57534E] hover:border-[#788B80] hover:text-[#292524] hover:bg-[#FAFAF9]'
                      }`}
                    >
                      {formatInTimeZone(slot.startTime, timezone, 'HH:mm')}
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-[#78716C]">
                No hay horarios disponibles para esta fecha.
              </p>
            )}
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            selectedSlot ? 'max-h-24 opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <button
            onClick={() => selectedSlot && setStep('intake')}
            className="w-full flex items-center justify-center h-[52px] rounded-xl bg-[#292524] px-6 text-[15px] font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#1C1917] hover:shadow-lg hover:shadow-black/5 active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-xs text-[#A8A29E]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure booking powered by Serene</span>
      </div>
    </div>
  )
}

export default BookingPage
