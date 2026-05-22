const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // 1. Create Event
  const event = await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Laufey - Bewitched Tour Jakarta',
      location: 'Gelora Bung Karno, Jakarta',
    },
  })

  // 2. Clear existing orders and seats to avoid duplicates and constraint errors when re-seeding
  await prisma.order.deleteMany({})
  await prisma.seat.deleteMany({ where: { eventId: event.id } })

  // 3. Create Seats
  const seatCategories = [
    {
      type: 'VVIP',
      price: 2500000,
      stock: 200,
    },
    {
      type: 'VIP',
      price: 1500000,
      stock: 4, // Sisa 4 sesuai permintaan untuk testing limit/habis
    },
    {
      type: 'Festival',
      price: 850000,
      stock: 3000,
    },
    {
      type: 'Regular',
      price: 450000,
      stock: 9000,
    },
  ]

  for (const seat of seatCategories) {
    await prisma.seat.create({
      data: {
        eventId: event.id,
        type: seat.type,
        price: seat.price,
        stock: seat.stock,
      },
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
