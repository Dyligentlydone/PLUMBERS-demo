import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const cancelAppointmentSchema = z.object({
  reason: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = cancelAppointmentSchema.parse(body)

    // Check if appointment exists and can be cancelled
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    if (existingAppointment.status === 'Cancelled') {
      return NextResponse.json(
        { error: 'Appointment is already cancelled' },
        { status: 400 }
      )
    }

    if (existingAppointment.status === 'Completed') {
      return NextResponse.json(
        { error: 'Cannot cancel a completed appointment' },
        { status: 400 }
      )
    }

    // Cancel appointment
    await prisma.appointment.update({
      where: { id },
      data: {
        status: 'Cancelled',
        cancellationReason: validatedData.reason || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling appointment:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    )
  }
}
