export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'

async function getCustomers() {
  return await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      appointments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { appointments: true },
      },
    },
  })
}

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#d7b73f' }}>
            Customers
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your customer database
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="surface bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941F]/20 border-[#D4AF37]/30 p-6">
          <div className="text-sm text-slate-400">Total Customers</div>
          <div className="text-3xl font-bold text-slate-100 mt-1">
            {customers.length}
          </div>
        </div>
        <div className="surface bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 p-6">
          <div className="text-sm text-slate-400">Active This Month</div>
          <div className="text-3xl font-bold text-slate-100 mt-1">
            {
              customers.filter((c) =>
                c.appointments.some(
                  (a) =>
                    new Date(a.createdAt) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                )
              ).length
            }
          </div>
        </div>
        <div className="surface bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 p-6">
          <div className="text-sm text-slate-400">Avg. Appointments</div>
          <div className="text-3xl font-bold text-slate-100 mt-1">
            {customers.length > 0
              ? (
                  customers.reduce((sum, c) => sum + c._count.appointments, 0) /
                  customers.length
                ).toFixed(1)
              : 0}
          </div>
        </div>
      </div>

      <div className="surface">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold" style={{ color: '#d7b73f' }}>
            All Customers ({customers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Total Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Last Appointment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Customer Since
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-100">
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-100">
                      <a
                        href={`tel:${customer.phone}`}
                        className="hover:text-[#d7b73f] transition"
                      >
                        {customer.phone}
                      </a>
                    </div>
                    {customer.email && (
                      <div className="text-sm text-slate-400">
                        <a
                          href={`mailto:${customer.email}`}
                          className="hover:text-[#d7b73f] transition"
                        >
                          {customer.email}
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-100">
                      {customer._count.appointments}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {customer.appointments[0]
                      ? format(customer.appointments[0].createdAt, 'MMM d, yyyy')
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {format(customer.createdAt, 'MMM d, yyyy')}
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
