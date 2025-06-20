"use client";

import React, { useState } from 'react';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Security');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 w-full">
      <main className="w-full mx-auto bg-white rounded-xl p-8 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 m-0">Olive Nacelle</h1>
            <p className="text-slate-500 text-sm m-0">Manage your details and personal preferences here.</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search" className="border border-slate-200 rounded-lg px-3 py-1 text-sm outline-none" />
            <button className="bg-white border border-slate-200 rounded-lg px-4 py-1 text-sm font-medium cursor-pointer">+ Invite</button>
            <button className="bg-blue-600 text-white rounded-lg px-5 py-1 text-sm font-medium cursor-pointer">Upgrade</button>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center ml-2 relative">
              <span className="text-slate-500 font-bold text-base">O</span>
              <span className="absolute right-1 bottom-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
          {['General', 'Security', 'Billing', 'Notifications', 'Apps', 'Branding', 'Refer a friend', 'Sharing'].map(tab => (
            <button
              key={tab}
              className={`px-5 py-2 -mb-px border-b-2 text-sm font-medium focus:outline-none transition-colors duration-150 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Security Tab Content */}
        {activeTab === 'Security' && (
          <section>
            {/* Account Security Status */}
            <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 mb-8">
              <div className="w-9 h-9 flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-800">Your account security is 90%</div>
                <div className="text-xs text-slate-500">Please review your account security settings regularly and update your password.</div>
              </div>
              <button className="bg-white border border-slate-200 rounded-lg px-4 py-1 text-sm mr-2 cursor-pointer">Dismiss</button>
              <button className="bg-blue-600 text-white rounded-lg px-4 py-1 text-sm cursor-pointer">Review security</button>
            </div>
            {/* Basics */}
            <div className="mb-8">
              <div className="font-semibold text-slate-800 mb-2">Basics</div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-medium text-slate-800">Password</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg tracking-widest">••••••••</span>
                    <span className="text-xs text-green-600 font-medium ml-2">Very secure</span>
                  </div>
                </div>
                <button className="bg-white border border-slate-200 rounded-lg px-4 py-1 text-sm cursor-pointer">Edit</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-800">Two-step verification</div>
                  <div className="text-xs text-slate-500">We recommend requiring a verification code in addition to your password.</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-10 h-6 bg-blue-100 rounded-full relative">
                    <span className="absolute left-5 top-0.5 w-5 h-5 bg-blue-600 rounded-full transition"></span>
                  </span>
                  <button className="bg-white border border-slate-200 rounded-lg px-4 py-1 text-sm cursor-pointer">Edit</button>
                </div>
              </div>
            </div>
            {/* Browsers and Devices */}
            <div>
              <div className="font-semibold text-slate-800 mb-2">Browsers and devices</div>
              <div className="text-xs text-slate-500 mb-4">These browsers and devices are currently signed in to your account. Remove any unauthorized devices.</div>
              <div className="border border-slate-200 rounded-lg bg-white divide-y overflow-hidden">
                {/* Device Row Example */}
                <div className="flex items-center px-5 py-4">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/brave.svg" alt="Brave" className="w-6 h-6 mr-4" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Brave on Mac OS X</div>
                    <div className="text-xs text-slate-500">Ninh Binh, Vietnam</div>
                  </div>
                  <span className="text-xs text-red-600 mr-4">Current session</span>
                  <button className="text-slate-400 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="flex items-center px-5 py-4">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg" alt="MacBook" className="w-6 h-6 mr-4" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Olive&apos;s MacBook Pro</div>
                    <div className="text-xs text-slate-500">Ninh Binh, Vietnam</div>
                  </div>
                  <span className="text-xs text-red-600 mr-4">Current session</span>
                  <button className="text-slate-400 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="flex items-center px-5 py-4">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/brave.svg" alt="Brave" className="w-6 h-6 mr-4" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Brave on Mac OS X</div>
                    <div className="text-xs text-slate-500">Mexico City, Mexico</div>
                  </div>
                  <span className="text-xs text-green-600 mr-4">1 month ago</span>
                  <button className="text-slate-400 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="flex items-center px-5 py-4">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg" alt="MacBook" className="w-6 h-6 mr-4" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Olive&apos;s MacBook Pro</div>
                    <div className="text-xs text-slate-500">Mexico City, Mexico</div>
                  </div>
                  <span className="text-xs text-green-600 mr-4">1 month ago</span>
                  <button className="text-slate-400 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default SettingsPage;
