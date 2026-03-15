'use client'

import React from 'react'

const Pricing = () => {
  const features = [
    "Unlimited appointments",
    "Two-way Google Calendar sync",
    "Automated patient intake",
    "Clinical-grade privacy & security",
    "Priority support"
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white flex flex-col items-center justify-center py-20 px-6 sm:px-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mb-16">
        <h1 className="text-3xl md:text-[40px] font-light tracking-tight text-[#292524] mb-6 leading-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-[15px] md:text-lg font-light leading-relaxed text-[#78716C]">
          Everything you need to run your practice efficiently, securely, and with peace of mind. No hidden fees or complex tiers.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-[#F2F2F0] p-10 flex flex-col relative overflow-hidden">
        
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#FAFAF9] rounded-full opacity-50 border border-[#EAECEB]"></div>

        <div className="relative z-10">
          <h2 className="text-[17px] font-medium tracking-wide text-[#57534E] mb-6 uppercase">
            Serene Professional
          </h2>
          
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-[56px] font-light tracking-tight text-[#292524] leading-none">$29</span>
            <span className="text-[15px] text-[#78716C] font-light">/month</span>
          </div>

          <div className="h-px w-full bg-[#F2F2F0] mb-8"></div>

          <ul className="space-y-5 mb-10">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="mt-1 h-5 w-5 rounded-full bg-[#F2F4F3] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#788B80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[15px] text-[#292524] leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <button className="w-full flex items-center justify-center h-14 rounded-2xl bg-[#292524] px-8 text-[15px] font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#1C1917] hover:shadow-lg hover:shadow-black/5 active:scale-[0.98]">
            Start your 14-day free trial
          </button>
          
          <p className="text-center text-xs text-[#A8A29E] mt-5 font-light">
            No credit card required to start. Cancel anytime.
          </p>
        </div>
      </div>

    </div>
  )
}

export default Pricing
