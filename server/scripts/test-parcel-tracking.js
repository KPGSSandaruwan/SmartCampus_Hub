const parcelService = require('../src/services/parcelService');
const { sequelize } = require('../src/config/db');

async function testParcelTracking() {
  try {
    console.log('--- Testing Parcel Tracking System ---');
    await sequelize.authenticate();

    // 1. Create a new parcel request
    const newParcel = await parcelService.createParcelRequest(
      '2', // sender Sarah
      'Science Complex Lab 3',
      'Highland Oaks Dorm A',
      2.5
    );

    console.log('✅ Created Parcel Request:');
    console.log(`- ID: ${newParcel.id}`);
    console.log(`- Tracking Code: ${newParcel.trackingCode}`);
    console.log(`- Status: ${newParcel.status}`);

    if (!newParcel.trackingCode || !newParcel.trackingCode.startsWith('TRK-')) {
      throw new Error('Tracking code was not correctly generated!');
    }

    // 2. Track parcel by tracking code
    const trackedParcel = await parcelService.trackParcelByCode(newParcel.trackingCode);
    console.log('\n✅ Tracked Parcel by Code:');
    console.log(`- Found ID: ${trackedParcel.id}`);
    console.log(`- Pickup: ${trackedParcel.pickupLocation}`);
    console.log(`- Dropoff: ${trackedParcel.dropLocation}`);

    if (trackedParcel.id !== newParcel.id) {
      throw new Error('Tracked parcel ID mismatch!');
    }

    // 3. Test pre-seeded tracking codes
    const sampleCode = 'TRK-892347';
    const seededParcel = await parcelService.trackParcelByCode(sampleCode);
    if (seededParcel) {
      console.log(`\n✅ Tracked Pre-Seeded Code (${sampleCode}): Status = ${seededParcel.status}`);
    } else {
      console.log(`\n⚠️ Pre-seeded tracking code ${sampleCode} not found in database.`);
    }

    console.log('\n🎉 Parcel Tracking System Tests Passed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
  }
}

testParcelTracking();
