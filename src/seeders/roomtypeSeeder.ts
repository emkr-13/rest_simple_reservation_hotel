import { db } from '../config/db';
import { roomTypes } from '../models/roomType​';
async function seed() {
  // Array data yang akan di-insert secara bulk
  const roomTypesa = [
    {
      name: 'Single Room',
    },
    {
      name: 'Double Room',
    },
    {
      name: 'Triple Room',
    },
    {
      name: 'Quadruple Room',
    },
    {
      name: 'VIP Room',
    },
  ];

  // Lakukan bulk insert
  await db.insert(roomTypes).values(roomTypesa);

  console.log('Bulk insert room types completed');
}

seed()
  .then(() => {
    console.log('Seeder completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  });
