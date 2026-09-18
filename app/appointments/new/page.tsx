'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewAppointmentPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    service_address: '',
    job_type: '',
    job_description: '',
    preferred_window: '',
    notes: '',
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create appointment')
      }

      const data = await res.json()
      router.push(`/appointments/${data.appointment.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      <div>
        <Link
          href="/appointments"
          className="text-sm font-medium hover:text-[#d7b73f] transition mb-2 inline-block"
          style={{ color: '#d7b73f' }}
        >
          &larr; Back to Appointments
        </Link>
        <h1 className="text-3xl font-bold" style={{ color: '#d7b73f' }}>
          New Appointment
        </h1>
        <p className="text-slate-400 mt-1">
          Create a new service appointment
        </p>
      </div>

      {error && (
        <div
          className="p-3 text-sm rounded-lg"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            Customer Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={form.customer_name}
                onChange={(e) => update('customer_name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-slate-100 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-slate-100 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-slate-100 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="john@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-1">
                Service Address *
              </label>
              <input
                type="text"
                required
                value={form.service_address}
                onChange={(e) => update('service_address', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-slate-100 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="123 Main St, City, State ZIP"
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            Job Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-1">
                Job Type *
              </label>
              <select
                required
                value={form.job_type}
                onChange={(e) => update('job_type', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-slate-100 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <option value="">Select a job type</option>
                <option value="Drain Clog">Drain Clog</option>
                <option value="Water Heater Repair">Water Heater Repair</option>
                <option value="Pipe Leak">Pipe Leak</option>
                <option value="Toilet Repair">Toilet Repair</option>
                <option value="Faucet Repair">Faucet Repair</option>
                <option value="Sewer Line">Sewer Line</option>
                <option value="Installation">Installation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-1">
                Description *
              </label>
              <textarea
                required
                value={form.job_description}
                onChange={(e) => update('job_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm text-slate-100 outline-none resize-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="Describe the issue..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-1">
                Preferred Window
              </label>
              <input
                type="text"
                value={form.preferred_window}
                onChange={(e) => update('preferred_window', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-slate-100 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="e.g. Tomorrow, 2-4 PM"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-1">
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm text-slate-100 outline-none resize-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="Any additional notes..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="lg:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition"
            style={{
              background: submitting ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#d7b73f',
            }}
          >
            {submitting ? 'Creating...' : 'Create Appointment'}
          </button>
          <Link
            href="/appointments"
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 transition hover:text-slate-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
