'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Plumber Pro Services',
    phone: '(555) 123-4567',
    email: 'info@plumberpro.com',
    address: '123 Main Street, Lansing, MI 48933',
  })

  const [pricing, setPricing] = useState({
    drainClog: { low: 150, high: 300 },
    waterHeater: { low: 300, high: 800 },
    pipeLeak: { low: 250, high: 600 },
    toiletRepair: { low: 150, high: 350 },
  })

  const [notifications, setNotifications] = useState({
    newAppointments: true,
    cancellations: true,
    dailySummary: false,
  })

  const [isEditingBusiness, setIsEditingBusiness] = useState(false)
  const [isEditingPricing, setIsEditingPricing] = useState(false)

  const handleSaveBusinessInfo = () => {
    // TODO: Save to database/API
    setIsEditingBusiness(false)
    alert('Business information saved!')
  }

  const handleSavePricing = () => {
    // TODO: Save to database/API
    setIsEditingPricing(false)
    alert('Pricing configuration saved!')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#d7b73f' }}>
          Settings
        </h1>
        <p className="text-slate-400 mt-1">
          Configure your business settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <div className="surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#d7b73f' }}>
              Business Information
            </h2>
            {!isEditingBusiness && (
              <button
                onClick={() => setIsEditingBusiness(true)}
                className="btn-gold-sm"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingBusiness ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, name: e.target.value })
                  }
                  className="input-dark"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={businessInfo.phone}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phone: e.target.value })
                  }
                  className="input-dark"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, email: e.target.value })
                  }
                  className="input-dark"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, address: e.target.value })
                  }
                  className="input-dark"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveBusinessInfo} className="btn-gold-sm">
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingBusiness(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-400">Business Name</dt>
                <dd className="mt-1 text-sm text-slate-100">{businessInfo.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-400">Phone</dt>
                <dd className="mt-1 text-sm text-slate-100">{businessInfo.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-400">Email</dt>
                <dd className="mt-1 text-sm text-slate-100">{businessInfo.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-400">Address</dt>
                <dd className="mt-1 text-sm text-slate-100">{businessInfo.address}</dd>
              </div>
            </dl>
          )}
        </div>

        {/* AI Agent Integration */}
        <div className="surface p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            AI Agent Integration
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Your API endpoints are ready for Retell AI integration.
          </p>
          <div className="surface-muted p-4 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Base URL:</p>
            <code className="text-sm text-[#d7b73f] break-all">
              https://your-domain.com/api
            </code>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            All 6 endpoints are operational and ready for your AI agent.
          </p>
        </div>

        {/* Pricing Configuration */}
        <div className="surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#d7b73f' }}>
              Pricing Configuration
            </h2>
            {!isEditingPricing && (
              <button
                onClick={() => setIsEditingPricing(true)}
                className="btn-gold-sm"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingPricing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">
                  Drain Clog
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={pricing.drainClog.low}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        drainClog: { ...pricing.drainClog, low: Number(e.target.value) },
                      })
                    }
                    className="input-dark w-24"
                    placeholder="Low"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={pricing.drainClog.high}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        drainClog: { ...pricing.drainClog, high: Number(e.target.value) },
                      })
                    }
                    className="input-dark w-24"
                    placeholder="High"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">
                  Water Heater
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={pricing.waterHeater.low}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        waterHeater: { ...pricing.waterHeater, low: Number(e.target.value) },
                      })
                    }
                    className="input-dark w-24"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={pricing.waterHeater.high}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        waterHeater: { ...pricing.waterHeater, high: Number(e.target.value) },
                      })
                    }
                    className="input-dark w-24"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">
                  Pipe Leak
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={pricing.pipeLeak.low}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        pipeLeak: { ...pricing.pipeLeak, low: Number(e.target.value) },
                      })
                    }
                    className="input-dark w-24"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={pricing.pipeLeak.high}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        pipeLeak: { ...pricing.pipeLeak, high: Number(e.target.value) },
                      })
                    }
                    className="input-dark w-24"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-2">
                  Toilet Repair
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={pricing.toiletRepair.low}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        toiletRepair: { ...pricing.toiletRepair, low: Number(e.target.value) },
                      })
                    }
                    className="input-dark w-24"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={pricing.toiletRepair.high}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        toiletRepair: { ...pricing.toiletRepair, high: Number(e.target.value) },
                      })
                    }
                    className="input-dark w-24"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handleSavePricing} className="btn-gold-sm">
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingPricing(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Drain Clog</span>
                <span className="text-sm text-[#d7b73f]">
                  ${pricing.drainClog.low} - ${pricing.drainClog.high}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Water Heater</span>
                <span className="text-sm text-[#d7b73f]">
                  ${pricing.waterHeater.low} - ${pricing.waterHeater.high}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Pipe Leak</span>
                <span className="text-sm text-[#d7b73f]">
                  ${pricing.pipeLeak.low} - ${pricing.pipeLeak.high}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Toilet Repair</span>
                <span className="text-sm text-[#d7b73f]">
                  ${pricing.toiletRepair.low} - ${pricing.toiletRepair.high}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="surface p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-100">
                  New Appointment Alerts
                </p>
                <p className="text-xs text-slate-400">
                  Get notified when new appointments are created
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    newAppointments: !notifications.newAppointments,
                  })
                }
                className={`btn-ghost text-xs ${
                  notifications.newAppointments
                    ? 'bg-green-500/15 text-green-300 ring-1 ring-green-500/30'
                    : ''
                }`}
              >
                {notifications.newAppointments ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-100">
                  Cancellation Alerts
                </p>
                <p className="text-xs text-slate-400">
                  Get notified when appointments are cancelled
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    cancellations: !notifications.cancellations,
                  })
                }
                className={`btn-ghost text-xs ${
                  notifications.cancellations
                    ? 'bg-green-500/15 text-green-300 ring-1 ring-green-500/30'
                    : ''
                }`}
              >
                {notifications.cancellations ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-100">
                  Daily Summary
                </p>
                <p className="text-xs text-slate-400">
                  Receive daily appointment summaries
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    dailySummary: !notifications.dailySummary,
                  })
                }
                className={`btn-ghost text-xs ${
                  notifications.dailySummary
                    ? 'bg-green-500/15 text-green-300 ring-1 ring-green-500/30'
                    : ''
                }`}
              >
                {notifications.dailySummary ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="surface p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            Database
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Manage your database and data
          </p>
          <div className="space-y-3">
            <button className="btn-ghost w-full justify-start">
              📊 View Database Statistics
            </button>
            <button className="btn-ghost w-full justify-start">
              💾 Backup Database
            </button>
            <button className="btn-ghost w-full justify-start">
              🔄 Reset Sample Data
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="surface p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            System Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-slate-400">Version</dt>
              <dd className="mt-1 text-sm text-slate-100">1.0.0</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">Database</dt>
              <dd className="mt-1 text-sm text-slate-100">Supabase (PostgreSQL)</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">Framework</dt>
              <dd className="mt-1 text-sm text-slate-100">Next.js 16</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">API Status</dt>
              <dd className="mt-1">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/15 text-green-300 ring-1 ring-inset ring-green-500/30">
                  Operational
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
