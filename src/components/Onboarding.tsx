'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'

const Onboarding = () => {
  const { user, isLoaded } = useUser()

  const handleConnect = async () => {
    if (!user) return
    
    // Initiates the OAuth flow to connect Google Calendar
    try {
      await user.createExternalAccount({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard', 
      })
    } catch (err) {
      console.error("Failed to connect Google Calendar", err)
    }
  }

  if (!isLoaded) return <div className="min-h-screen bg-[#FAFAF9]" />

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF9] px-6 selection:bg-[#788B80] selection:text-white font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-3xl bg-white p-12 text-center shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-[#F2F2F0]"
      >
        <div className="mx-auto mb-8 h-12 w-12 rounded-full bg-[#EAECEB] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#292524]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 className="mb-5 text-[28px] font-light tracking-wide text-[#292524]">
          Sync your schedule
        </h1>
        
        <p className="mx-auto mb-10 max-w-sm text-[15px] font-light leading-relaxed text-[#78716C]">
          We need access to your calendar to automatically find available slots and avoid double-booking. Your private event details remain completely hidden from patients.
        </p>

        <button 
          onClick={handleConnect}
          className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-[#292524] px-8 text-sm font-medium tracking-wide text-white transition-all duration-300 ease-out hover:bg-[#1C1917] hover:shadow-lg hover:shadow-black/5 active:scale-[0.98] sm:w-auto gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Connect Google Calendar</span>
        </button>
      </motion.div>
    </div>
  )
}

export default Onboarding
