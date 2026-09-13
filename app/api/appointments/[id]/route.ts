import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateAppointmentSchema = z.object({
  job_type: z.string().optional(),
  job_description: z.string().optional(),
  service_address: z.string().optional(),
  preferred_window: z.string().optional(),
  notes: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateAppointmentSchema.parse(body)

    // Check if appointment exists and is modifiable
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    if (existingAppointment.status !== 'Scheduled') {
      return NextResponse.json(
        { error: 'Appointment cannot be modified in its current status' },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    
    if (validatedData.job_type !== undefined) {
      updateData.jobType = validatedData.job_type
    }
    if (validatedData.job_description !== undefined) {
      updateData.jobDescription = validatedData.job_description
    }
    if (validatedData.service_address !== undefined) {
      updateData.serviceAddress = validatedData.service_address
    }
    if (validatedData.preferred_window !== undefined) {
      updateData.preferredWindow = validatedData.preferred_window
      updateData.scheduledArrivalWindow = validatedData.preferred_window
    }
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      scheduled_arrival_window: updatedAppointment.scheduledArrivalWindow,
      eta_minutes: updatedAppointment.etaMinutes,
    })
  } catch (error) {
    console.error('Error updating appointment:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}
