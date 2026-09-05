const { sequelize } = require('../src/config/db');

// Import only the rentals models
const RentalItem = require('../src/models/RentalItem');
const RentalBooking = require('../src/models/RentalBooking');

const syncDb = async () => {
  try {
    console.log('Connecting to MySQL and syncing Rentals models...');
    await sequelize.authenticate();
    console.log('Database connection authenticated.');
    
    // Sync only the rental models
    await RentalItem.sync({ alter: true });
    console.log('✔ RentalItem model synchronized.');
    
    await RentalBooking.sync({ alter: true });
    console.log('✔ RentalBooking model synchronized.');
    
    console.log('🚀 Rentals database models synchronized successfully with MySQL!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to synchronize database models:', error);
    process.exit(1);
  }
};

syncDb();
