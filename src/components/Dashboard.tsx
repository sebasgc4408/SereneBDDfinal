'use client'

import React from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import IntegrationStatus from './IntegrationStatus'

const Dashboard = () => {
  const { user, isLoaded } = useUser()

  // Mocks de citas para esta fase de UI
  const upcomingAppointments = [
    { id: 1, patient: "Eleanor Shellstrop", time: "10:00 AM", duration: "50 min", type: "First Session" },
    { id: 2, patient: "Chidi Anagonye", time: "11:30 AM", duration: "50 min", type: "Follow-up" },
    { id: 3, patient: "Tahani Al-Jamil", time: "2:00 PM", duration: "50 min", type: "Follow-up" },
  ]

  if (!isLoaded) return <div className="min-h-screen bg-[#FAFAF9]" />

  const greeting = user?.firstName ? `Good morning, ${user.firstName}` : 'Good morning'

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#788B80] selection:text-white pb-20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-5 bg-white/80 backdrop-blur-md border-b border-[#F2F2F0]">
        <div className="flex items-center gap-3">
           <div className="h-5 w-5 rounded-full bg-[#788B80]" />
           <span className="text-lg font-medium tracking-wide text-[#292524]">Serene</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-2 text-[13px] font-medium text-[#78716C]">
            <svg className="w-4 h-4 text-[#788B80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Calendar Synced
          </div>
          <div className="w-px h-5 bg-[#EAECEB] hidden md:block"></div>
          <UserButton />
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <header className="mb-12 md:mb-16">
          <h1 className="text-3xl md:text-[36px] font-light tracking-tight text-[#292524] mb-3">
            {greeting}
          </h1>
          <p className="text-[15px] md:text-base text-[#78716C] font-light">
            You have 3 sessions scheduled for today. Take a deep breath.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
          
          {/* Main Column: Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[19px] font-medium tracking-wide text-[#292524]">Upcoming Appointments</h2>
              <button className="text-sm font-medium text-[#788B80] hover:text-[#5c6e64] transition-colors">
                View Calendar
              </button>
            </div>

            <div className="bg-white rounded-3xl p-3 shadow-[0_4px_30px_rgb(0,0,0,0.02)] border border-[#F2F2F0]">
              {upcomingAppointments.map((apt, index) => (
                <div 
                  key={apt.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl transition-colors hover:bg-[#FAFAF9] ${index !== upcomingAppointments.length - 1 ? 'border-b border-[#F2F2F0]/50' : ''}`}
                >
                  <div className="flex items-start sm:items-center gap-5 mb-4 sm:mb-0">
                    <div className="text-left sm:text-right w-20 flex-shrink-0">
                      <div className="text-sm font-medium text-[#292524]">{apt.time}</div>
                      <div className="text-xs text-[#A8A29E] mt-1">{apt.duration}</div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-[#EAECEB]"></div>
                    <div>
                      <div className="text-[15px] font-medium text-[#292524] mb-1">{apt.patient}</div>
                      <div className="text-xs text-[#78716C] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9DDDB]"></span>
                        {apt.type}
                      </div>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto h-10 px-5 rounded-xl border border-[#EAECEB] text-sm font-medium text-[#57534E] hover:bg-[#FAFAF9] hover:border-[#D9DDDB] transition-all active:scale-[0.98]">
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Side Column: Summary / Actions */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-[19px] font-medium tracking-wide text-[#292524] mb-4 px-2">Quick Actions</h2>
              <div className="bg-[#F8F9F8] rounded-3xl p-8 border border-[#EAECEB]">
                <h3 className="text-[15px] font-medium text-[#292524] mb-3">Share Booking Link</h3>
                <p className="text-[13px] text-[#78716C] mb-6 leading-relaxed">
                  Your calendar is synced and ready. Patients can book available slots securely without seeing your private details.
                </p>
                <button className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-[#D9DDDB] text-sm font-medium text-[#292524] hover:border-[#788B80] hover:text-[#788B80] transition-all shadow-sm active:scale-[0.98]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Copy Public Link
                </button>
              </div>
            </div>

            <IntegrationStatus />
          </div>

        </div>
      </main>
    </div>
  )
}

export default Dashboard
