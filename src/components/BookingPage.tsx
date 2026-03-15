'use client'

import React, { useState } from 'react'

interface BookingPageProps {
  psychologistName: string
}

const BookingPage: React.FC<BookingPageProps> = ({ psychologistName }) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  // Mocks para las fechas de esta semana
  const availableDates = [
    { id: 1, day: 'Mon', date: '16', available: true },
    { id: 2, day: 'Tue', date: '17', available: true },
    { id: 3, day: 'Wed', date: '18', available: false },
    { id: 4, day: 'Thu', date: '19', available: true },
    { id: 5, day: 'Fri', date: '20', available: true },
  ]

  // Mocks de horas disponibles si seleccionan el martes
  const availableTimes = [
    '10:00 AM', '11:00 AM', '2:00 PM', '4:30 PM'
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white flex flex-col items-center py-16 px-6 sm:py-24">
      {/* Distraction-free Header */}
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
          Take your time. Select a date and time that works best for you from the available options below.
        </p>
      </div>

      {/* Main Booking Interface */}
      <div className="w-full max-w-xl bg-white rounded-[24px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-[#F2F2F0] p-6 sm:p-10">
        
        {/* Date Selector Area */}
        <div className="mb-10">
          <h2 className="text-[17px] font-medium text-[#292524] mb-5">Select a date</h2>
          
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {availableDates.map((d) => (
              <button
                key={d.id}
                onClick={() => d.available && setSelectedDate(d.id)}
                disabled={!d.available}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                  !d.available 
                    ? 'opacity-40 cursor-not-allowed bg-[#FAFAF9] text-[#A8A29E]' 
                    : selectedDate === d.id 
                      ? 'bg-[#292524] text-white shadow-md shadow-black/10 scale-[1.02]' 
                      : 'bg-white border border-[#EAECEB] text-[#57534E] hover:border-[#788B80] hover:text-[#292524]'
                }`}
              >
                <span className={`text-[11px] font-medium uppercase tracking-wider mb-1 ${selectedDate === d.id ? 'text-[#EAECEB]' : ''}`}>
                  {d.day}
                </span>
                <span className="text-xl font-light">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selector Area (Revealed progressively) */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedDate ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-6 border-t border-[#F2F2F0]">
            <h2 className="text-[17px] font-medium text-[#292524] mb-5">Available times</h2>
            <div className="grid grid-cols-2 gap-3">
              {availableTimes.map((time, idx) => (
                <button 
                  key={idx}
                  className="flex items-center justify-center h-12 rounded-xl border border-[#EAECEB] text-[14px] font-medium text-[#57534E] hover:border-[#788B80] hover:text-[#292524] hover:bg-[#FAFAF9] transition-all active:scale-[0.98]"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
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
