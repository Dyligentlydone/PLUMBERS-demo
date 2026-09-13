import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Smith',
      phone: '517-555-0101',
      email: 'john.smith@email.com',
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Sarah Johnson',
      phone: '517-555-0102',
      email: 'sarah.j@email.com',
    },
  })

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Mike Davis',
      phone: '517-555-0103',
    },
  })

  const customer4 = await prisma.customer.create({
    data: {
      name: 'Emily Brown',
      phone: '517-555-0104',
      email: 'emily.brown@email.com',
    },
  })

  // Create appointments
  await prisma.appointment.createMany({
    data: [
      {
        customerId: customer1.id,
        customerName: customer1.name,
        phone: customer1.phone,
        email: customer1.email,
        serviceAddress: '123 Main St, Lansing, MI 48933',
        jobType: 'Drain Clog',
        jobDescription: 'Kitchen sink backing up for 2 days',
        preferredWindow: 'Tomorrow, 2-4 PM',
        scheduledArrivalWindow: 'Tomorrow, 2-4 PM',
        status: 'Scheduled',
        notes: 'Customer mentioned hearing gurgling sounds',
      },
      {
        customerId: customer2.id,
        customerName: customer2.name,
        phone: customer2.phone,
        email: customer2.email,
        serviceAddress: '456 Oak Ave, Lansing, MI 48912',
        jobType: 'Water Heater Repair',
        jobDescription: 'No hot water since this morning',
        preferredWindow: 'Today, 10 AM - 12 PM',
        scheduledArrivalWindow: 'Today, 10 AM - 12 PM',
        status: 'InProgress',
        notes: 'Water heater is 8 years old',
      },
      {
        customerId: customer3.id,
        customerName: customer3.name,
        phone: customer3.phone,
        serviceAddress: '789 Elm St, East Lansing, MI 48823',
        jobType: 'Toilet Repair',
        jobDescription: 'Toilet running constantly',
        preferredWindow: 'This week',
        scheduledArrivalWindow: 'Friday, 1-3 PM',
        status: 'Scheduled',
      },
      {
        customerId: customer4.id,
        customerName: customer4.name,
        phone: customer4.phone,
        email: customer4.email,
        serviceAddress: '321 Pine Rd, Okemos, MI 48864',
        jobType: 'Faucet Installation',
        jobDescription: 'Install new kitchen faucet',
        preferredWindow: 'Next Monday',
        scheduledArrivalWindow: 'Monday, 9-11 AM',
        status: 'Scheduled',
        notes: 'Customer already purchased the faucet',
      },
      {
        customerId: customer1.id,
        customerName: customer1.name,
        phone: customer1.phone,
        email: customer1.email,
        serviceAddress: '123 Main St, Lansing, MI 48933',
        jobType: 'Pipe Leak',
        jobDescription: 'Leaking pipe under bathroom sink',
        preferredWindow: 'Last week',
        scheduledArrivalWindow: 'Last Tuesday, 2-4 PM',
        status: 'Completed',
      },
      {
        customerId: customer2.id,
        customerName: customer2.name,
        phone: customer2.phone,
        email: customer2.email,
        serviceAddress: '456 Oak Ave, Lansing, MI 48912',
        jobType: 'Drain Cleaning',
        jobDescription: 'Slow draining bathroom sink',
        preferredWindow: 'Two weeks ago',
        scheduledArrivalWindow: 'Two weeks ago, 3-5 PM',
        status: 'Completed',
      },
      {
        customerId: customer3.id,
        customerName: customer3.name,
        phone: customer3.phone,
        serviceAddress: '789 Elm St, East Lansing, MI 48823',
        jobType: 'Water Heater Installation',
        jobDescription: 'Replace old water heater',
        preferredWindow: 'Next week',
        scheduledArrivalWindow: 'Next Wednesday, 10 AM - 2 PM',
        status: 'Cancelled',
        cancellationReason: 'Customer decided to postpone',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
