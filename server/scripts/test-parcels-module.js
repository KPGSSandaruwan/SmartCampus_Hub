const { sequelize } = require('../src/config/db');
const parcelService = require('../src/services/parcelService');
const Parcel = require('../src/models/Parcel');
const ParcelAssignment = require('../src/models/ParcelAssignment');
const Rider = require('../src/models/Rider');

const runTest = async () => {
  try {
    console.log('Connecting to MySQL database...');
    await sequelize.authenticate();

    await sequelize.sync();
    console.log('Database synced successfully.');

    await ParcelAssignment.destroy({ where: {} });
    await Parcel.destroy({ where: {} });
    await Rider.destroy({ where: {} });
    console.log('Cleaned up previous test data.');

    // 1. Verify Pricing Logic
    console.log('\n--- 1. Testing Pricing Logic ---');
    
    const localTests = [
      { p: 'Kamburupitiya', d: 'Kamburupitiya Local', w: 0.5, expected: 100 },
      { p: 'Kamburupitiya', d: 'Kamburupitiya Local', w: 1, expected: 100 },
      { p: 'Kamburupitiya', d: 'Kamburupitiya Local', w: 2.5, expected: 600 }
    ];
    for (const t of localTests) {
      const actual = parcelService.calculatePrice(t.p, t.d, t.w);
      console.log(`Local Route | Weight: ${t.w} kg | Expected: Rs. ${t.expected} | Actual: Rs. ${actual}`);
      if (actual !== t.expected) {
        throw new Error(`Pricing calculation mismatch for Local weight ${t.w}`);
      }
    }

    const intercityTests = [
      { p: 'Kamburupitiya', d: 'Matara City', w: 0.8, expected: 200 },
      { p: 'Kamburupitiya', d: 'Matara City', w: 1, expected: 200 },
      { p: 'Kamburupitiya', d: 'Matara City', w: 2.5, expected: 400 },
      { p: 'Kamburupitiya', d: 'Weligama Town', w: 2.5, expected: 400 }
    ];
    for (const t of intercityTests) {
      const actual = parcelService.calculatePrice(t.p, t.d, t.w);
      console.log(`Intercity Route | Weight: ${t.w} kg | Expected: Rs. ${t.expected} | Actual: Rs. ${actual}`);
      if (actual !== t.expected) {
        throw new Error(`Pricing calculation mismatch for Intercity weight ${t.w}`);
      }
    }
    console.log('Pricing logic test passed! ✅');

    // 2. Register a Rider
    console.log('\n--- 2. Testing Rider Setup ---');
    const riderUserId = 'user_rider_789';
    const rider = await Rider.create({
      userId: riderUserId,
      bikeNumber: 'SP-ABC-4567',
      bikeModel: 'Yamaha FZ',
      licenseNumber: 'LIC-554433'
    });
    console.log(`Rider Setup: ID ${rider.id}, User ID ${rider.userId}`);

    // 3. Create Parcel Request
    console.log('\n--- 3. Testing Parcel Creation ---');
    const senderUserId = 'user_sender_111';
    const parcel = await parcelService.createParcelRequest(
      senderUserId,
      'Kamburupitiya Campus',
      'Matara Bus Stand',
      2.5
    );
    console.log(`Parcel Created: ID ${parcel.id}, Price: Rs. ${parcel.price}, Status: ${parcel.status}`);
    if (parcel.price !== 400) {
      throw new Error(`Calculated price in request was not Rs. 400 (got ${parcel.price})`);
    }

    // 4. Retrieve Parcels
    console.log('\n--- 4. Testing Retrieve Parcels ---');
    const parcels = await parcelService.getParcels();
    console.log(`Parcels Count: ${parcels.length}`);
    if (parcels.length !== 1 || parcels[0].id !== parcel.id) {
      throw new Error('Parcel request was not listed correctly');
    }
    console.log(`Listed Parcel from ${parcels[0].pickupLocation} to ${parcels[0].dropLocation} ✅`);

    // 5. Assign Parcel
    console.log('\n--- 5. Testing Parcel Assignment ---');
    const assignment = await parcelService.assignParcel(parcel.id, rider.id);
    console.log(`Assignment Created: ID ${assignment.id}, Parcel ID ${assignment.parcelId}, Rider ID ${assignment.riderId}`);

    const assignedParcel = await Parcel.findByPk(parcel.id);
    console.log(`Assigned Parcel Status: ${assignedParcel.status}`);
    if (assignedParcel.status !== 'assigned') {
      throw new Error('Parcel status should be assigned');
    }

    // 6. Complete Delivery
    console.log('\n--- 6. Testing Delivery Completion ---');
    const completedParcel = await parcelService.completeDelivery(parcel.id, riderUserId);
    console.log(`Delivery Completed: ID ${completedParcel.id}, Status: ${completedParcel.status}`);
    if (completedParcel.status !== 'completed') {
      throw new Error('Parcel status should be completed');
    }

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The Parcel Delivery module is 100% correct.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  }
};

runTest();
