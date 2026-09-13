import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createAppointmentSchema = z.object({
  customer_name: z.string(),
  phone: z.string(),
  email: z.string().email().optional().or(z.literal('')),
  service_address: z.string(),
  job_type: z.string(),
  job_description: z.string(),
  preferred_window: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: validatedData.phone },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: validatedData.customer_name,
          phone: validatedData.phone,
          email: validatedData.email || null,
        },
      })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        customerId: customer.id,
        customerName: validatedData.customer_name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        serviceAddress: validatedData.service_address,
        jobType: validatedData.job_type,
        jobDescription: validatedData.job_description,
        preferredWindow: validatedData.preferred_window || null,
        notes: validatedData.notes || null,
        status: 'Scheduled',
        scheduledArrivalWindow: validatedData.preferred_window || 'To be scheduled',
        etaMinutes: null,
      },
    })

    return NextResponse.json({
      appointment: { id: appointment.id },
      scheduled_arrival_window: appointment.scheduledArrivalWindow,
      eta_minutes: appointment.etaMinutes,
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
