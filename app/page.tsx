export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'

async function getDashboardData() {
  const [
    totalAppointments,
    scheduledAppointments,
    inProgressAppointments,
    completedToday,
    recentAppointments,
    totalCustomers,
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'Scheduled' } }),
    prisma.appointment.count({ where: { status: 'InProgress' } }),
    prisma.appointment.count({
      where: {
        status: 'Completed',
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: true },
    }),
    prisma.customer.count(),
  ])

  return {
    totalAppointments,
    scheduledAppointments,
    inProgressAppointments,
    completedToday,
    recentAppointments,
    totalCustomers,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#d7b73f' }}>
          Command Center
        </h1>
        <p className="text-slate-400">
          Manage your plumbing business operations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={data.totalAppointments}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Scheduled"
          value={data.scheduledAppointments}
          icon="📅"
          color="green"
        />
        <StatCard
          title="In Progress"
          value={data.inProgressAppointments}
          icon="🔧"
          color="yellow"
        />
        <StatCard
          title="Completed Today"
          value={data.completedToday}
          icon="✅"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/appointments/new"
          className="group relative z-0 flex w-full items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12 px-6 py-4 text-center backdrop-blur transition hover:bg-[#D4AF37]/18 active:bg-[#D4AF37]/22"
        >
          <div className="text-lg font-semibold" style={{ color: '#d7b73f' }}>
            📞 New Appointment
          </div>
        </Link>

        <Link
          href="/appointments"
          className="group relative z-0 flex w-full items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12 px-6 py-4 text-center backdrop-blur transition hover:bg-[#D4AF37]/18 active:bg-[#D4AF37]/22"
        >
          <div className="text-lg font-semibold" style={{ color: '#d7b73f' }}>
            📋 All Appointments
          </div>
        </Link>

        <Link
          href="/customers"
          className="group relative z-0 flex w-full items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12 px-6 py-4 text-center backdrop-blur transition hover:bg-[#D4AF37]/18 active:bg-[#D4AF37]/22"
        >
          <div className="text-lg font-semibold" style={{ color: '#d7b73f' }}>
            👥 Customers
          </div>
        </Link>
      </div>

      <div className="surface">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold" style={{ color: '#d7b73f' }}>
            Recent Appointments
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.recentAppointments.map((appointment) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {format(appointment.createdAt, 'MMM d, yyyy')}
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

      <div className="mt-auto pb-6 text-center">
        <p className="text-2xl font-semibold text-slate-600">
          "Excellence in Every Service Call"
        </p>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: string
  color: 'blue' | 'green' | 'yellow' | 'purple'
}) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    yellow: 'from-[#D4AF37]/20 to-[#B8941F]/20 border-[#D4AF37]/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  }

  return (
    <div
      className={`surface bg-gradient-to-br ${colorClasses[color]} p-6 hover:scale-105 transition-transform`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
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
