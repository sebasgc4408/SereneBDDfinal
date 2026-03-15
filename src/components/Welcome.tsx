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

          <div className="mb-10 text-left">
            <h1 className="text-3xl font-light tracking-tight text-[#292524] mb-3">
              Welcome back
            </h1>
            <p className="text-[#78716C] font-light">
              Log in or create an account to access your workspace.
            </p>
          </div>
          
          <div className="rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-[#F2F2F0]">
            <SignInButton mode="modal">
              <button className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-[#292524] px-8 text-sm font-medium tracking-wide text-white transition-all duration-300 ease-out hover:bg-[#1C1917] hover:shadow-lg hover:shadow-black/5 active:scale-[0.98]">
                <span>Continue with Email</span>
              </button>
            </SignInButton>
            
            <div className="mt-6 text-center text-xs text-[#A8A29E] font-light leading-relaxed">
              By continuing, you securely authenticate via Clerk.
            </div>
          </div>
          
          <div className="mt-12 flex items-center justify-start gap-2 text-xs text-[#A8A29E]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
