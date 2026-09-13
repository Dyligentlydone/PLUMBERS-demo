import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getAppointment(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { customer: true },
  })

  if (!appointment) {
    notFound()
  }

  return appointment
}

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const appointment = await getAppointment(id)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/appointments"
            className="text-sm font-medium hover:text-[#d7b73f] transition mb-2 inline-block"
            style={{ color: '#d7b73f' }}
          >
            ← Back to Appointments
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: '#d7b73f' }}>
            Appointment Details
          </h1>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            Customer Information
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-400">Name</dt>
              <dd className="mt-1 text-sm text-slate-100">
                {appointment.customerName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">Phone</dt>
              <dd className="mt-1 text-sm text-slate-100">
                <a
                  href={`tel:${appointment.phone}`}
                  className="hover:text-[#d7b73f] transition"
                >
                  {appointment.phone}
                </a>
              </dd>
            </div>
            {appointment.email && (
              <div>
                <dt className="text-sm font-medium text-slate-400">Email</dt>
                <dd className="mt-1 text-sm text-slate-100">
                  <a
                    href={`mailto:${appointment.email}`}
                    className="hover:text-[#d7b73f] transition"
                  >
                    {appointment.email}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Service Address
              </dt>
              <dd className="mt-1 text-sm text-slate-100">
                {appointment.serviceAddress}
              </dd>
            </div>
          </dl>
        </div>

        <div className="surface p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
            Job Details
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-400">Job Type</dt>
              <dd className="mt-1 text-sm text-slate-100">
                {appointment.jobType}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Description
              </dt>
              <dd className="mt-1 text-sm text-slate-100">
                {appointment.jobDescription}
              </dd>
            </div>
            {appointment.preferredWindow && (
              <div>
                <dt className="text-sm font-medium text-slate-400">
                  Preferred Window
                </dt>
                <dd className="mt-1 text-sm text-slate-100">
                  {appointment.preferredWindow}
                </dd>
              </div>
            )}
            {appointment.scheduledArrivalWindow && (
              <div>
                <dt className="text-sm font-medium text-slate-400">
                  Scheduled Arrival
                </dt>
                <dd className="mt-1 text-sm text-slate-100">
                  {appointment.scheduledArrivalWindow}
                </dd>
              </div>
            )}
            {appointment.notes && (
              <div>
                <dt className="text-sm font-medium text-slate-400">Notes</dt>
                <dd className="mt-1 text-sm text-slate-100">
                  {appointment.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="surface p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#d7b73f' }}>
          Timeline
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-slate-400">Created</dt>
            <dd className="mt-1 text-sm text-slate-100">
              {format(appointment.createdAt, 'MMMM d, yyyy h:mm a')}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-400">
              Last Updated
            </dt>
            <dd className="mt-1 text-sm text-slate-100">
              {format(appointment.updatedAt, 'MMMM d, yyyy h:mm a')}
            </dd>
          </div>
          {appointment.status === 'Cancelled' &&
            appointment.cancellationReason && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-slate-400">
                  Cancellation Reason
                </dt>
                <dd className="mt-1 text-sm text-slate-100">
                  {appointment.cancellationReason}
                </dd>
              </div>
            )}
        </dl>
      </div>

      <div className="surface-muted p-4">
        <p className="text-sm text-slate-400">
          <strong className="text-slate-300">Appointment ID:</strong>{' '}
          <code className="surface px-2 py-1 rounded text-xs text-[#d7b73f]">
            {appointment.id}
          </code>
        </p>
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
      className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ring-1 ring-inset ${
        statusStyles[status as keyof typeof statusStyles] ||
        'bg-gray-500/15 text-gray-300 ring-gray-500/30'
      }`}
    >
      {status}
    </span>
  )
}
