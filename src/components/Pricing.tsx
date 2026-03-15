'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true)

  const features = [
    "Zero-friction patient booking",
    "Real-time Google Calendar sync",
    "Automated reminders & intake",
    "Clinical-grade data privacy",
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white flex items-center justify-center py-20 px-6 sm:px-12 overflow-hidden">
      
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Column: The "Why" / Value Proposition */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAECEB] text-xs font-semibold text-[#57534E] mb-8 tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#788B80] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#788B80]"></span>
            </span>
            Available for Early Access
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-light tracking-tight text-[#292524] mb-6 leading-[1.1] max-w-lg">
            Invest in your practice.<br className="hidden lg:block"/>
            <span className="text-[#78716C]">Protect your peace.</span>
          </h1>
          
          <p className="text-lg font-light leading-relaxed text-[#57534E] max-w-lg mb-12">
            The cost of a single missed session due to poor scheduling pays for months of Serene. Automate the friction and focus entirely on the clinical outcome.
          </p>

          {/* Social Proof / ROI Mini-module */}
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-[#F2F2F0] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-[#F2F4F3] flex items-center justify-center flex-shrink-0 text-[#788B80] font-serif italic text-xl">
                “
              </div>
              <div>
                <p className="text-[14px] text-[#57534E] italic leading-relaxed mb-3">
                  Serene has completely eliminated the back-and-forth emails. My patients love how calm the booking process feels before they even walk in the door.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px bg-[#D9DDDB]"></div>
                  <span className="text-xs font-medium text-[#A8A29E] tracking-widest uppercase">Dr. Elena M.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: The "What" / Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_24px_80px_rgb(0,0,0,0.06)] border border-[#EAECEB] p-10 flex flex-col relative group">
            
            {/* Toggle within the card for a tighter relationship */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#F2F2F0]">
              <div>
                <h2 className="text-[18px] font-medium text-[#292524]">Professional</h2>
                <p className="text-[13px] text-[#78716C] mt-1">Everything included.</p>
              </div>
              <div className="flex items-center gap-3 bg-[#FAFAF9] p-1.5 rounded-full border border-[#F2F2F0]">
                <button 
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${!isAnnual ? 'bg-white shadow-sm text-[#292524]' : 'text-[#A8A29E] hover:text-[#78716C]'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${isAnnual ? 'bg-white shadow-sm text-[#292524]' : 'text-[#A8A29E] hover:text-[#78716C]'}`}
                >
                  Annually
                </button>
              </div>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <span className="text-[28px] font-medium text-[#78716C] mb-2">$</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={isAnnual ? 'annual' : 'monthly'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-[72px] font-light tracking-tight text-[#292524] leading-none"
                >
                  {isAnnual ? '24' : '29'}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <div className="text-[13px] text-[#A8A29E] mb-8 font-light flex items-center gap-2">
              {isAnnual ? 'Per month, billed $288 yearly.' : 'Billed monthly. Cancel anytime.'}
              {isAnnual && <span className="text-[10px] font-bold text-white bg-[#788B80] px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>}
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="h-5 w-5 rounded-full bg-[#FAFAF9] flex items-center justify-center flex-shrink-0 border border-[#EAECEB]">
                    <svg className="w-3 h-3 text-[#788B80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-[#57534E]">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full flex items-center justify-center h-14 rounded-2xl bg-[#292524] px-8 text-[15px] font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#1C1917] hover:shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
              Start your 14-day free trial
            </button>
            <p className="text-center text-[11px] text-[#A8A29E] mt-4 font-light">
              No credit card required for trial.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Pricing
