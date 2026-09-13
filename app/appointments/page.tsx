import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'

async function getAppointments() {
  return await prisma.appointment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true },
  })
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments()

  const scheduled = appointments.filter((a) => a.status === 'Scheduled')
  const inProgress = appointments.filter((a) => a.status === 'InProgress')
  const completed = appointments.filter((a) => a.status === 'Completed')
  const cancelled = appointments.filter((a) => a.status === 'Cancelled')

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#d7b73f' }}>
            All Appointments
          </h1>
          <p className="text-slate-400 mt-1">
            Manage and track all service appointments
          </p>
        </div>
        <Link href="/appointments/new" className="btn-gold">
          + New Appointment
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="surface bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 p-4">
          <div className="text-sm text-slate-400">Scheduled</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {scheduled.length}
          </div>
        </div>
        <div className="surface bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 p-4">
          <div className="text-sm text-slate-400">In Progress</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {inProgress.length}
          </div>
        </div>
        <div className="surface bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 p-4">
          <div className="text-sm text-slate-400">Completed</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {completed.length}
          </div>
        </div>
        <div className="surface bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30 p-4">
          <div className="text-sm text-slate-400">Cancelled</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {cancelled.length}
          </div>
        </div>
      </div>

      <div className="surface">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold" style={{ color: '#d7b73f' }}>
            All Appointments ({appointments.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Job Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-100">
                      {appointment.customerName}
                    </div>
                    <div className="text-sm text-slate-400">
                      {appointment.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-100">
                      {appointment.jobType}
                    </div>
                    <div className="text-sm text-slate-400 max-w-xs truncate">
                      {appointment.jobDescription}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                    {appointment.serviceAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {appointment.scheduledArrivalWindow || 'Not scheduled'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/appointments/${appointment.id}`}
                      className="font-medium hover:text-[#d7b73f] transition"
                      style={{ color: '#d7b73f' }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    Scheduled: 'bg-green-500/15 text-green-300 ring-green-500/30',
    InProgress: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
    Completed: 'bg-purple-500/15 text-purple-300 ring-purple-500/30',
    Cancelled: 'bg-red-500/15 text-red-300 ring-red-500/30',
  }

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${
        statusStyles[status as keyof typeof statusStyles] ||
        'bg-gray-500/15 text-gray-300 ring-gray-500/30'
      }`}
    >
      {status}
    </span>
  )
}
