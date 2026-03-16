'use client'

import React from 'react'
import { SignInButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'

const Welcome = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white">
      {/* Structural Left Panel - The "Serene" Aesthetic */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-[#EAECEB] p-12 lg:p-24 border-r border-[#D9DDDB]">
        <div className="flex items-center gap-3">
           <div className="h-6 w-6 rounded-full bg-[#788B80]" />
           <span className="text-xl font-medium tracking-wide text-[#292524]">Serene</span>
        </div>
        
        <div className="max-w-md">
          <h2 className="text-4xl font-light leading-snug tracking-tight text-[#292524] mb-6">
            A quiet space to manage your practice.
          </h2>
          <p className="text-lg font-light leading-relaxed text-[#57534E]">
            We handle the coordination, scheduling, and admin so you can focus entirely on your patients' well-being.
          </p>
        </div>

        <div className="text-sm font-medium text-[#78716C]">
          © {new Date().getFullYear()} Serene Health Systems
        </div>
      </div>

      {/* Structural Right Panel - The Functional Area */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 lg:p-24">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-16">
           <div className="h-6 w-6 rounded-full bg-[#788B80]" />
           <span className="text-xl font-medium tracking-wide text-[#292524]">Serene</span>
          </div>

          <div className="mb-8 text-left">
            <h1 className="text-[32px] font-light tracking-tight text-[#292524] mb-3">
              Welcome back
            </h1>
            <p className="text-[15px] text-[#78716C] font-light leading-relaxed">
              Log in or create an account to access your workspace.
            </p>
          </div>
          
          <div className="space-y-6">
            <SignInButton mode="modal">
              <button className="group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#292524] px-8 text-[15px] font-medium tracking-wide text-white transition-all duration-300 ease-out hover:bg-[#1C1917] hover:shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                <span>Continue with Email</span>
              </button>
            </SignInButton>
            
            <p className="text-center text-[13px] text-[#A8A29E] font-light">
              By continuing, you securely authenticate via Clerk.
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[#EAECEB] flex items-center justify-start gap-2 text-[13px] text-[#78716C]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Clinical-grade infrastructure</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Welcome
