'use client'

import React, { useState } from 'react'

interface PatientIntakeFormProps {
  selectedTime: string
  selectedDate: string
  onSubmit: (data: { name: string; email: string; phone: string }) => void
}

const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({ selectedTime, selectedDate, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="w-full max-w-xl bg-white rounded-[24px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-[#F2F2F0] p-6 sm:p-10">
      
      {/* Selection Summary */}
      <div className="mb-8 flex items-start gap-4 p-5 rounded-2xl bg-[#FAFAF9] border border-[#EAECEB]">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center border border-[#EAECEB]">
          <svg className="w-5 h-5 text-[#788B80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-[14px] font-medium text-[#78716C] mb-1">Selected Time</h3>
          <div className="text-[17px] font-medium text-[#292524]">
            {selectedDate} at {selectedTime}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-[14px] font-medium text-[#292524] mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full h-[52px] px-4 rounded-xl border border-[#EAECEB] bg-[#FAFAF9] text-[#292524] focus:outline-none focus:ring-2 focus:ring-[#788B80]/20 focus:border-[#788B80] transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-[14px] font-medium text-[#292524] mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full h-[52px] px-4 rounded-xl border border-[#EAECEB] bg-[#FAFAF9] text-[#292524] focus:outline-none focus:ring-2 focus:ring-[#788B80]/20 focus:border-[#788B80] transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-[14px] font-medium text-[#292524] mb-2">
            Phone Number <span className="text-[#A8A29E] font-light">(Optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full h-[52px] px-4 rounded-xl border border-[#EAECEB] bg-[#FAFAF9] text-[#292524] focus:outline-none focus:ring-2 focus:ring-[#788B80]/20 focus:border-[#788B80] transition-all"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full flex items-center justify-center h-[52px] rounded-xl bg-[#292524] px-6 text-[15px] font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#1C1917] hover:shadow-lg hover:shadow-black/5 active:scale-[0.98]"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  )
}

export default PatientIntakeForm
