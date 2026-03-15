import React from 'react'

const IntegrationStatus = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium tracking-wide text-[#292524] px-2 mb-4">Integrations</h2>
      
      {/* Active Integration Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_30px_rgb(0,0,0,0.02)] border border-[#F2F2F0] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-[#FAFAF9] flex items-center justify-center shadow-inner border border-[#EAECEB]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[17px] font-medium text-[#292524] mb-1">Google Calendar</h3>
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#788B80]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#788B80] opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#788B80]"></span>
              </span>
              Connected & Syncing
            </div>
          </div>
        </div>
        
        <button className="h-10 px-5 rounded-xl border border-[#EAECEB] text-sm font-medium text-[#D9534F] hover:bg-[#FEF5F5] hover:border-[#F5C2C2] transition-colors active:scale-[0.98]">
          Disconnect
        </button>
      </div>

      {/* Permission Clarity Card */}
      <div className="bg-[#F8F9F8] rounded-3xl p-6 md:p-8 border border-[#EAECEB]">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-5 h-5 text-[#57534E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-[17px] font-medium text-[#292524]">Permission Clarity</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#F2F2F0]">
            <h4 className="text-[14px] font-medium text-[#292524] mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#788B80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Read-only access
            </h4>
            <p className="text-[13px] text-[#78716C] leading-relaxed">
              We only check your busy time blocks to find available slots for your patients.
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-[#F2F2F0]">
            <h4 className="text-[14px] font-medium text-[#292524] mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#788B80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Strictly confidential
            </h4>
            <p className="text-[13px] text-[#78716C] leading-relaxed">
              We never read event titles, descriptions, or participant data from your personal events.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegrationStatus
