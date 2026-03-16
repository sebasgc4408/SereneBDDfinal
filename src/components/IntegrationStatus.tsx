'use client'

import React, { useState } from 'react'

interface IntegrationStatusProps {
  whatsappConnected?: boolean
}

const IntegrationStatus: React.FC<IntegrationStatusProps> = ({ whatsappConnected = false }) => {
  const [isClarityOpen, setIsClarityOpen] = useState(false)
  const [isWhatsAppClarityOpen, setIsWhatsAppClarityOpen] = useState(false)

  return (
    <div className="space-y-4">
      <h2 className="text-[17px] font-medium tracking-wide text-[#292524] px-1 mb-2">Integrations</h2>
      
      {/* Active Integration Card */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-[#F2F2F0] p-5 md:p-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-[#FAFAF9] flex items-center justify-center border border-[#EAECEB]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-medium text-[#292524] truncate">Google Calendar</h3>
            <div className="flex items-center gap-1.5 text-[13px] text-[#788B80] mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#788B80]"></span>
              Active & Synced
            </div>
          </div>
        </div>
        
        <button className="w-full py-2.5 rounded-xl border border-[#F2F2F0] bg-white text-[13px] font-medium text-[#D9534F] hover:bg-[#FEF5F5] hover:border-[#F5C2C2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9534F] focus-visible:ring-offset-1 active:scale-[0.98]">
          Disconnect Calendar
        </button>
      </div>

      {/* Collapsible Permission Clarity Card */}
      <div className="bg-[#FAFAF9] rounded-[24px] border border-[#F2F2F0] overflow-hidden">
        <button 
          onClick={() => setIsClarityOpen(!isClarityOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-[13px] font-medium text-[#57534E] hover:bg-[#F2F4F3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#788B80]"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#A8A29E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacy & Permissions
          </div>
          <svg 
            className={`w-4 h-4 text-[#A8A29E] transition-transform duration-300 ${isClarityOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out px-5 ${isClarityOpen ? 'max-h-48 opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'}`}
        >
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-[#788B80] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="text-[13px] font-medium text-[#292524]">Read-only access</div>
                <div className="text-[12px] text-[#78716C] mt-0.5 leading-relaxed">We only check busy blocks to find available slots.</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-[#788B80] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="text-[13px] font-medium text-[#292524]">Strictly confidential</div>
                <div className="text-[12px] text-[#78716C] mt-0.5 leading-relaxed">We never read titles or participants from your events.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Integration Card */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-[#F2F2F0] p-5 md:p-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-[#FAFAF9] flex items-center justify-center border border-[#EAECEB]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-medium text-[#292524] truncate">WhatsApp Reminders</h3>
            <div className="flex items-center gap-1.5 text-[13px] mt-0.5">
              {whatsappConnected ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]"></span>
                  <span className="text-[#788B80]">Active</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A8A29E]"></span>
                  <span className="text-[#A8A29E]">Not Connected</span>
                </>
              )}
            </div>
          </div>
        </div>

        {whatsappConnected && (
          <button className="w-full py-2.5 rounded-xl border border-[#F2F2F0] bg-white text-[13px] font-medium text-[#D9534F] hover:bg-[#FEF5F5] hover:border-[#F5C2C2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9534F] focus-visible:ring-offset-1 active:scale-[0.98]">
            Disconnect WhatsApp
          </button>
        )}
      </div>

      {/* WhatsApp Privacy Card */}
      <div className="bg-[#FAFAF9] rounded-[24px] border border-[#F2F2F0] overflow-hidden">
        <button
          onClick={() => setIsWhatsAppClarityOpen(!isWhatsAppClarityOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-[13px] font-medium text-[#57534E] hover:bg-[#F2F4F3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#788B80]"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#A8A29E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            WhatsApp Privacy
          </div>
          <svg
            className={`w-4 h-4 text-[#A8A29E] transition-transform duration-300 ${isWhatsAppClarityOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out px-5 ${isWhatsAppClarityOpen ? 'max-h-48 opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'}`}
        >
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-[#788B80] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="text-[13px] font-medium text-[#292524]">Clinical use only</div>
                <div className="text-[12px] text-[#78716C] mt-0.5 leading-relaxed">We handle the reminders. We never send promotional messages, only strict clinical confirmations.</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-[#788B80] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <div className="text-[13px] font-medium text-[#292524]">Encrypted infrastructure</div>
                <div className="text-[12px] text-[#78716C] mt-0.5 leading-relaxed">Messages are sent via Meta's encrypted infrastructure. No PHI in message content.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegrationStatus
