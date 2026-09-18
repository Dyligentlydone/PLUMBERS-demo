import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const estimateSchema = z.object({
  job_type: z.string(),
  job_description: z.string(),
})

async function getPricing() {
  let settings = await prisma.setting.findUnique({ where: { id: 'default' } })
  if (!settings) {
    settings = await prisma.setting.create({ data: { id: 'default' } })
  }
  return {
    drain: { low: settings.pricingDrainClogLow, high: settings.pricingDrainClogHigh },
    waterHeater: { low: settings.pricingWaterHeaterLow, high: settings.pricingWaterHeaterHigh },
    pipeLeak: { low: settings.pricingPipeLeakLow, high: settings.pricingPipeLeakHigh },
    toilet: { low: settings.pricingToiletRepairLow, high: settings.pricingToiletRepairHigh },
  }
}

// Pricing logic using database-configured prices
async function calculateEstimate(jobType: string, jobDescription: string) {
  const p = await getPricing()
  const lowerJobType = jobType.toLowerCase()
  const lowerDescription = jobDescription.toLowerCase()

  let estimateLow = 100
  let estimateHigh = 200

  if (lowerJobType.includes('drain') || lowerJobType.includes('clog')) {
    estimateLow = p.drain.low
    estimateHigh = p.drain.high
  } else if (lowerJobType.includes('water heater')) {
    estimateLow = p.waterHeater.low
    estimateHigh = p.waterHeater.high
  } else if (lowerJobType.includes('leak') || lowerJobType.includes('pipe')) {
    estimateLow = p.pipeLeak.low
    estimateHigh = p.pipeLeak.high
  } else if (lowerJobType.includes('toilet')) {
    estimateLow = p.toilet.low
    estimateHigh = p.toilet.high
  } else if (lowerJobType.includes('faucet')) {
    estimateLow = 100
    estimateHigh = 250
  } else if (lowerJobType.includes('sewer')) {
    estimateLow = 400
    estimateHigh = 1200
  } else if (lowerJobType.includes('install')) {
    estimateLow = 300
    estimateHigh = 1000
  }

  // Adjust based on description keywords
  if (lowerDescription.includes('emergency') || lowerDescription.includes('urgent')) {
    estimateLow += 50
    estimateHigh += 100
  }

  if (lowerDescription.includes('multiple') || lowerDescription.includes('several')) {
    estimateLow += 100
    estimateHigh += 200
  }

  return {
    estimate_low: estimateLow,
    estimate_high: estimateHigh,
    range_text: `$${estimateLow}–$${estimateHigh}`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = estimateSchema.parse(body)

    const estimate = await calculateEstimate(
      validatedData.job_type,
      validatedData.job_description
    )

    return NextResponse.json(estimate)
  } catch (error) {
    console.error('Error calculating estimate:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to calculate estimate' },
      { status: 500 }
    )
  }
}
