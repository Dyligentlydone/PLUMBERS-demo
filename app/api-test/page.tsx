'use client'

import { useState } from 'react'

export default function ApiTestPage() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEndpoint = async (
    method: string,
    url: string,
    body?: any
  ) => {
    setLoading(true)
    setResponse(null)

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const res = await fetch(url, options)
      const data = await res.json()

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      })
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#d7b73f' }}>
          API Testing
        </h1>
        <p className="text-slate-400 mt-1">
          Test all API endpoints for your AI agent integration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" style={{ color: '#d7b73f' }}>
            Test Endpoints
          </h2>

          <TestButton
            title="1. Customer Lookup"
            description="GET /api/customers/lookup?phone=517-555-0101"
            onClick={() =>
              testEndpoint(
                'GET',
                '/api/customers/lookup?phone=517-555-0101'
              )
            }
            loading={loading}
          />

          <TestButton
            title="2. Get Estimate"
            description="POST /api/appointments/estimate"
            onClick={() =>
              testEndpoint('POST', '/api/appointments/estimate', {
                job_type: 'Drain Clog',
                job_description: 'Kitchen sink backing up for 2 days',
              })
            }
            loading={loading}
          />

          <TestButton
            title="3. Create Appointment"
            description="POST /api/appointments"
            onClick={() =>
              testEndpoint('POST', '/api/appointments', {
                customer_name: 'Test Customer',
                phone: '517-555-9999',
                email: 'test@example.com',
                service_address: '999 Test St, Lansing, MI',
                job_type: 'Test Job',
                job_description: 'This is a test appointment',
                preferred_window: 'Tomorrow, 2-4 PM',
                notes: 'Created via API test page',
              })
            }
            loading={loading}
          />

          <TestButton
            title="4. Appointment Lookup"
            description="GET /api/appointments/lookup?phone=517-555-0101"
            onClick={() =>
              testEndpoint(
                'GET',
                '/api/appointments/lookup?phone=517-555-0101'
              )
            }
            loading={loading}
          />

          <div className="surface-muted p-4">
            <p className="text-sm text-slate-400">
              <strong className="text-slate-300">Note:</strong> Update/Cancel endpoints require an
              appointment ID. Create an appointment first, then use its ID to
              test those endpoints.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            Response
          </h2>
          <div className="surface bg-black/50 p-4 min-h-[500px] rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-400">Loading...</div>
              </div>
            ) : response ? (
              <pre className="text-green-400 text-sm overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            ) : (
              <div className="text-slate-500 text-center py-20">
                Click a test button to see the response
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="surface p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#d7b73f' }}>
          API Documentation
        </h3>
        <p className="text-slate-400 mb-4">
          All endpoints are documented and ready for integration:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="surface-muted p-3 rounded">
            <code className="text-xs text-[#d7b73f]">
              POST /api/appointments
            </code>
            <p className="text-xs text-slate-400 mt-1">Create appointment</p>
          </div>
          <div className="surface-muted p-3 rounded">
            <code className="text-xs text-[#d7b73f]">
              POST /api/appointments/estimate
            </code>
            <p className="text-xs text-slate-400 mt-1">Get price estimate</p>
          </div>
          <div className="surface-muted p-3 rounded">
            <code className="text-xs text-[#d7b73f]">
              GET /api/customers/lookup
            </code>
            <p className="text-xs text-slate-400 mt-1">Look up customer</p>
          </div>
          <div className="surface-muted p-3 rounded">
            <code className="text-xs text-[#d7b73f]">
              PATCH /api/appointments/[id]
            </code>
            <p className="text-xs text-slate-400 mt-1">Update appointment</p>
          </div>
          <div className="surface-muted p-3 rounded">
            <code className="text-xs text-[#d7b73f]">
              POST /api/appointments/[id]/cancel
            </code>
            <p className="text-xs text-slate-400 mt-1">Cancel appointment</p>
          </div>
          <div className="surface-muted p-3 rounded">
            <code className="text-xs text-[#d7b73f]">
              GET /api/appointments/lookup
            </code>
            <p className="text-xs text-slate-400 mt-1">Look up appointments</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestButton({
  title,
  description,
  onClick,
  loading,
}: {
  title: string
  description: string
  onClick: () => void
  loading: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full text-left surface p-4 hover:bg-white/8 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <h3 className="font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </button>
  )
}
