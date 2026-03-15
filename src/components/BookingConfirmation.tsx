'use client'

import React from 'react'

interface BookingConfirmationProps {
  patientName: string
  date: string
  time: string
  psychologistName: string
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  patientName, 
  date, 
  time, 
  psychologistName 
}) => {
  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white flex flex-col items-center justify-center py-16 px-6">
      
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-[#F2F2F0] p-10 text-center flex flex-col items-center">
        
        {/* Success Icon */}
        <div className="mb-8 h-20 w-20 rounded-full bg-[#F2F4F3] flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-[#788B80] flex items-center justify-center shadow-md shadow-[#788B80]/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-light tracking-tight text-[#292524] mb-3">
          Your session is confirmed
        </h1>
        
        <p className="text-[15px] font-light leading-relaxed text-[#78716C] mb-10 max-w-sm">
          Thank you, {patientName}. You are all set. We've sent a calendar invitation to your email with the necessary details.
        </p>

        {/* Appointment Summary Card */}
        <div className="w-full bg-[#FAFAF9] rounded-2xl p-6 border border-[#EAECEB] text-left">
          <h2 className="text-[13px] font-medium text-[#A8A29E] uppercase tracking-wider mb-4">
            Appointment Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 flex justify-center">
                <svg className="w-5 h-5 text-[#57534E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-[15px] font-medium text-[#292524]">{date}</div>
                <div className="text-[13px] text-[#78716C]">at {time}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 flex justify-center">
                <svg className="w-5 h-5 text-[#57534E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-[15px] font-medium text-[#292524]">{psychologistName}</div>
                <div className="text-[13px] text-[#78716C]">Therapist</div>
              </div>
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

export default BookingConfirmation
