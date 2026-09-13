import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Appointment } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const appointmentId = searchParams.get('appointment_id')
    const phone = searchParams.get('phone')

    if (!appointmentId && !phone) {
      return NextResponse.json(
        { error: 'Either appointment_id or phone is required' },
        { status: 400 }
      )
    }

    let appointments: Appointment[] = []

    if (appointmentId) {
      // Look up by appointment ID
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      })

      if (appointment) {
        appointments = [appointment]
      }
    } else if (phone) {
      // Look up by phone number
      appointments = await prisma.appointment.findMany({
        where: { phone },
        orderBy: { createdAt: 'desc' },
        take: 5, // Return up to 5 most recent appointments
      })
    }

    // If both are provided, filter by both
    if (appointmentId && phone) {
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          phone,
        },
      })

      appointments = appointment ? [appointment] : []
    }

    const formattedAppointments = appointments.map((apt) => ({
      id: apt.id,
      status: apt.status,
      job_type: apt.jobType,
      job_description: apt.jobDescription,
      scheduled_arrival_window: apt.scheduledArrivalWindow,
      service_address: apt.serviceAddress,
    }))

    return NextResponse.json({
      lookup: {
        matches: formattedAppointments.length,
        appointments: formattedAppointments,
      },
    })
  } catch (error) {
    console.error('Error looking up appointment:', error)
    return NextResponse.json(
      { error: 'Failed to lookup appointment' },
      { status: 500 }
    )
  }
}
