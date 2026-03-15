import React from 'react'
import { SignInButton } from '@clerk/nextjs'

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCFB] text-[#2C3639]">
      <div className="max-w-md p-8 bg-white shadow-sm border border-[#E5E5E5] rounded-2xl text-center">
        <h1 className="text-3xl font-serif mb-4">Welcome to Psyco</h1>
        <p className="text-[#3F4E4F] mb-8 font-light leading-relaxed">
          Experience a meditative approach to clinic management. Let's begin your journey.
        </p>
        <SignInButton mode="modal">
          <button className="bg-[#A27B5C] hover:bg-[#3F4E4F] text-white px-8 py-3 rounded-full transition-all duration-300 ease-in-out tracking-wide">
            Begin Journey
          </button>
        </SignInButton>
      </div>
    </div>
  )
}

export default Welcome
