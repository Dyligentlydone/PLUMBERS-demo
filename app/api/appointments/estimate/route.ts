import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const estimateSchema = z.object({
  job_type: z.string(),
  job_description: z.string(),
})

// Simple pricing logic - can be expanded with more sophisticated rules
function calculateEstimate(jobType: string, jobDescription: string) {
  const lowerJobType = jobType.toLowerCase()
  const lowerDescription = jobDescription.toLowerCase()

  // Base estimates by job type
  let estimateLow = 100
  let estimateHigh = 200

  if (lowerJobType.includes('drain') || lowerJobType.includes('clog')) {
    estimateLow = 150
    estimateHigh = 300
  } else if (lowerJobType.includes('leak')) {
    estimateLow = 200
    estimateHigh = 400
  } else if (lowerJobType.includes('water heater')) {
    estimateLow = 300
    estimateHigh = 800
  } else if (lowerJobType.includes('toilet')) {
    estimateLow = 150
    estimateHigh = 350
  } else if (lowerJobType.includes('faucet')) {
    estimateLow = 100
    estimateHigh = 250
  } else if (lowerJobType.includes('pipe')) {
    estimateLow = 250
    estimateHigh = 600
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

    const estimate = calculateEstimate(
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
