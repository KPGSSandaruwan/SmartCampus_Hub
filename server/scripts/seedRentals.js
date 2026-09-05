const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { sequelize } = require('../src/config/db');
const RentalItem = require('../src/models/RentalItem');
const User = require('../src/models/User');

dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

const seedRentals = async () => {
  try {
    // 1. Connect to MySQL
    await sequelize.authenticate();
    console.log('Connected to MySQL...');

    // 2. Try to get user IDs from MySQL
    let alexId = '1';
    let sarahId = '2';
    
    try {
      const users = await User.findAll({ where: { role: 'student' } });
      if (users.length > 0) {
        const alex = users.find(u => u.name.includes('Alex')) || users[0];
        const sarah = users.find(u => u.name.includes('Sarah')) || users[1] || users[0];
        alexId = alex.id.toString();
        sarahId = sarah.id.toString();
      } else {
        console.log('No student users found in MySQL. Using default mock user IDs.');
      }
    } catch (dbError) {
      console.log('⚠️ Error querying users. Using fallback mock user IDs for seeding:', dbError.message);
    }
    
    console.log(`Using User IDs: Alex (${alexId}) and Sarah (${sarahId}) as owners.`);

    // 3. Clear existing rental items
    await RentalItem.destroy({ where: {} });
    console.log('Cleared existing rental items from MySQL.');

    // 4. Extract RENTAL_ITEMS dynamically from client/src/pages/Rentals.jsx
    const rentalsPagePath = path.join(__dirname, '../../client/src/pages/Rentals.jsx');
    if (!fs.existsSync(rentalsPagePath)) {
      throw new Error(`Rentals.jsx not found at ${rentalsPagePath}`);
    }

    const fileContent = fs.readFileSync(rentalsPagePath, 'utf8');
    const startKeyword = 'const RENTAL_ITEMS = [';
    const startIdx = fileContent.indexOf(startKeyword);
    if (startIdx === -1) {
      throw new Error('Could not find RENTAL_ITEMS array in Rentals.jsx');
    }

    // Find closing brace of the array
    let braceCount = 1;
    let currentIdx = startIdx + startKeyword.length;
    while (braceCount > 0 && currentIdx < fileContent.length) {
      if (fileContent[currentIdx] === '[') braceCount++;
      if (fileContent[currentIdx] === ']') braceCount--;
      currentIdx++;
    }
    const itemsText = fileContent.substring(startIdx + 'const RENTAL_ITEMS = '.length - 1, currentIdx);

    // Evaluate the array safely
    const rawItems = eval(itemsText);
    console.log(`Extracted ${rawItems.length} rental items from Rentals.jsx.`);

    // 5. Seed MySQL rental_items table
    const itemsToInsert = rawItems.map((item, idx) => {
      // Alternate owners between Alex and Sarah
      const ownerId = idx % 2 === 0 ? alexId : sarahId;

      return {
        id: item.id,
        category: item.category,
        title: item.title,
        dailyPrice: item.dailyPrice,
        specs: item.specs, // Mapped via Sequelize getter/setter
        description: item.description,
        image: item.image,
        ownerId,
        ownerName: item.owner.name,
        ownerEmail: item.owner.email,
        ownerPhone: item.owner.phone || '+94 77 123 4567',
        deposit: item.deposit,
        status: 'active'
      };
    });

    await RentalItem.bulkCreate(itemsToInsert);
    console.log(`🚀 Successfully seeded ${itemsToInsert.length} rental items in MySQL!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MySQL rental items:', error);
    process.exit(1);
  }
};

seedRentals();
