import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Find customer by phone
    const customer = await prisma.customer.findUnique({
      where: { phone },
      include: {
        appointments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!customer) {
      return NextResponse.json({
        lookup: {
          is_known: false,
          customer_name: null,
          has_recent_appointment: false,
          recent_appointment_id: null,
          recent_appointment_summary: null,
          recent_appointment_status: null,
          recent_appointment_modifiable: false,
          total_appointments: 0,
        },
      })
    }

    // Get total appointments count
    const totalAppointments = await prisma.appointment.count({
      where: { customerId: customer.id },
    })

    const recentAppointment = customer.appointments[0]
    const hasRecentAppointment = !!recentAppointment

    let appointmentSummary = null
    let isModifiable = false

    if (recentAppointment) {
      const appointmentDate = format(recentAppointment.createdAt, 'EEE M/d')
      appointmentSummary = `${recentAppointment.jobType} on ${appointmentDate}${
        recentAppointment.scheduledArrivalWindow
          ? ', ' + recentAppointment.scheduledArrivalWindow
          : ''
      }`
      
      // Appointment is modifiable if it's scheduled and not in progress or completed
      isModifiable = recentAppointment.status === 'Scheduled'
    }

    return NextResponse.json({
      lookup: {
        is_known: true,
        customer_name: customer.name,
        has_recent_appointment: hasRecentAppointment,
        recent_appointment_id: recentAppointment?.id || null,
        recent_appointment_summary: appointmentSummary,
        recent_appointment_status: recentAppointment?.status || null,
        recent_appointment_modifiable: isModifiable,
        total_appointments: totalAppointments,
      },
    })
  } catch (error) {
    console.error('Error looking up customer:', error)
    return NextResponse.json(
      { error: 'Failed to lookup customer' },
      { status: 500 }
    )
  }
}
