import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_ID = 'default'

async function getOrCreateSettings() {
  let settings = await prisma.setting.findUnique({ where: { id: DEFAULT_ID } })
  if (!settings) {
    settings = await prisma.setting.create({ data: { id: DEFAULT_ID } })
  }
  return settings
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings()
    return NextResponse.json({
      business: {
        name: settings.businessName,
        phone: settings.businessPhone,
        email: settings.businessEmail,
        address: settings.businessAddress,
      },
      pricing: {
        drainClog: { low: settings.pricingDrainClogLow, high: settings.pricingDrainClogHigh },
        waterHeater: { low: settings.pricingWaterHeaterLow, high: settings.pricingWaterHeaterHigh },
        pipeLeak: { low: settings.pricingPipeLeakLow, high: settings.pricingPipeLeakHigh },
        toiletRepair: { low: settings.pricingToiletRepairLow, high: settings.pricingToiletRepairHigh },
      },
      notifications: {
        newAppointments: settings.notifyNewAppointments,
        cancellations: settings.notifyCancellations,
        dailySummary: settings.notifyDailySummary,
      },
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const data: Record<string, unknown> = {}

    if (body.business) {
      if (body.business.name !== undefined) data.businessName = body.business.name
      if (body.business.phone !== undefined) data.businessPhone = body.business.phone
      if (body.business.email !== undefined) data.businessEmail = body.business.email
      if (body.business.address !== undefined) data.businessAddress = body.business.address
    }

    if (body.pricing) {
      if (body.pricing.drainClog) {
        if (body.pricing.drainClog.low !== undefined) data.pricingDrainClogLow = body.pricing.drainClog.low
        if (body.pricing.drainClog.high !== undefined) data.pricingDrainClogHigh = body.pricing.drainClog.high
      }
      if (body.pricing.waterHeater) {
        if (body.pricing.waterHeater.low !== undefined) data.pricingWaterHeaterLow = body.pricing.waterHeater.low
        if (body.pricing.waterHeater.high !== undefined) data.pricingWaterHeaterHigh = body.pricing.waterHeater.high
      }
      if (body.pricing.pipeLeak) {
        if (body.pricing.pipeLeak.low !== undefined) data.pricingPipeLeakLow = body.pricing.pipeLeak.low
        if (body.pricing.pipeLeak.high !== undefined) data.pricingPipeLeakHigh = body.pricing.pipeLeak.high
      }
      if (body.pricing.toiletRepair) {
        if (body.pricing.toiletRepair.low !== undefined) data.pricingToiletRepairLow = body.pricing.toiletRepair.low
        if (body.pricing.toiletRepair.high !== undefined) data.pricingToiletRepairHigh = body.pricing.toiletRepair.high
      }
    }

    if (body.notifications) {
      if (body.notifications.newAppointments !== undefined) data.notifyNewAppointments = body.notifications.newAppointments
      if (body.notifications.cancellations !== undefined) data.notifyCancellations = body.notifications.cancellations
      if (body.notifications.dailySummary !== undefined) data.notifyDailySummary = body.notifications.dailySummary
    }

    await getOrCreateSettings()
    const settings = await prisma.setting.update({
      where: { id: DEFAULT_ID },
      data,
    })

    return NextResponse.json({
      business: {
        name: settings.businessName,
        phone: settings.businessPhone,
        email: settings.businessEmail,
        address: settings.businessAddress,
      },
      pricing: {
        drainClog: { low: settings.pricingDrainClogLow, high: settings.pricingDrainClogHigh },
        waterHeater: { low: settings.pricingWaterHeaterLow, high: settings.pricingWaterHeaterHigh },
        pipeLeak: { low: settings.pricingPipeLeakLow, high: settings.pricingPipeLeakHigh },
        toiletRepair: { low: settings.pricingToiletRepairLow, high: settings.pricingToiletRepairHigh },
      },
      notifications: {
        newAppointments: settings.notifyNewAppointments,
        cancellations: settings.notifyCancellations,
        dailySummary: settings.notifyDailySummary,
      },
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
