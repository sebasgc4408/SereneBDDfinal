'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true)

  const features = [
    "Zero-friction booking for your patients",
    "Real-time Google Calendar synchronization",
    "Automated patient intake & onboarding",
    "Clinical-grade data privacy",
    "Priority email support"
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white flex flex-col items-center pt-24 pb-32 px-6">
      
      {/* Story & Value Proposition */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAECEB] text-xs font-medium text-[#57534E] mb-8">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Invest in your peace of mind
        </div>
        
        <h1 className="text-4xl md:text-[48px] font-light tracking-tight text-[#292524] mb-6 leading-[1.15]">
          Your time belongs to your patients, not your calendar.
        </h1>
        <p className="text-base md:text-lg font-light leading-relaxed text-[#78716C] max-w-xl mx-auto">
          Automate the busywork. Provide a premium, distraction-free scheduling experience that reflects the quality of your care.
        </p>
      </motion.div>

      {/* Monthly / Annual Toggle */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="flex items-center justify-center gap-4 mb-12"
      >
        <span className={`text-sm font-medium transition-colors duration-300 ${!isAnnual ? 'text-[#292524]' : 'text-[#A8A29E]'}`}>
          Monthly
        </span>
        
        <button 
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative w-14 h-8 rounded-full bg-[#EAECEB] p-1 cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#788B80] focus-visible:ring-offset-2"
        >
          <motion.div 
            layout
            className="w-6 h-6 bg-white rounded-full shadow-sm"
            animate={{ 
              x: isAnnual ? 24 : 0,
              backgroundColor: isAnnual ? "#788B80" : "#FFFFFF"
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
        
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium transition-colors duration-300 ${isAnnual ? 'text-[#292524]' : 'text-[#A8A29E]'}`}>
            Annually
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#788B80] bg-[#F2F4F3] px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </div>
      </motion.div>

      {/* Interactive Pricing Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-[0_16px_60px_rgb(0,0,0,0.04)] border border-[#F2F2F0] p-10 flex flex-col relative overflow-hidden group"
      >
        {/* Subtle decorative gradient that reacts to hover */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FAFAF9] to-white rounded-full blur-3xl opacity-50 transition-transform duration-700 group-hover:scale-110 translate-x-12 -translate-y-12"></div>

        <div className="relative z-10">
          <h2 className="text-[15px] font-medium tracking-widest text-[#A8A29E] mb-6 uppercase">
            Serene Professional
          </h2>
          
          <div className="flex items-end gap-2 mb-8 h-[60px]">
            <span className="text-[24px] font-medium text-[#78716C] mb-2">$</span>
            <AnimatePresence mode="wait">
              <motion.span 
                key={isAnnual ? 'annual' : 'monthly'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-[64px] font-light tracking-tight text-[#292524] leading-none"
              >
                {isAnnual ? '24' : '29'}
              </motion.span>
            </AnimatePresence>
            <span className="text-[15px] text-[#78716C] font-light mb-2">/month</span>
          </div>

          <div className="h-px w-full bg-[#F2F2F0] mb-8"></div>

          <ul className="space-y-5 mb-10">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="mt-0.5 h-5 w-5 rounded-full bg-[#F2F4F3] flex items-center justify-center flex-shrink-0 border border-[#EAECEB]">
                  <svg className="w-3 h-3 text-[#788B80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[15px] text-[#57534E] leading-relaxed">{feature}</span>
              </motion.li>
            ))}
          </ul>

          <button className="w-full flex items-center justify-center h-14 rounded-2xl bg-[#292524] px-8 text-[15px] font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#1C1917] hover:shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
            Start your 14-day free trial
          </button>
          
          <p className="text-center text-xs text-[#A8A29E] mt-5 font-light">
            {isAnnual ? 'Billed $288 annually.' : 'Billed monthly.'} Cancel anytime. No credit card required.
          </p>
        </div>
      </motion.div>

      {/* Trust / Flow extension */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-20 flex flex-col items-center gap-6"
      >
        <p className="text-sm font-medium text-[#78716C] uppercase tracking-widest">
          Trusted by independent practitioners
        </p>
        <div className="flex gap-8 opacity-40 grayscale">
           {/* Abstract trust marks */}
           <svg className="h-6" viewBox="0 0 100 30" fill="currentColor"><path d="M10 15a5 5 0 1010 0 5 5 0 00-10 0zm20 0a5 5 0 1010 0 5 5 0 00-10 0zm20 0a5 5 0 1010 0 5 5 0 00-10 0z"/></svg>
           <svg className="h-6" viewBox="0 0 100 30" fill="currentColor"><path d="M10 10h80v10H10z"/></svg>
        </div>
      </motion.div>

    </div>
  )
}

export default Pricing
