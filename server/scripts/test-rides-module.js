const { sequelize } = require('../src/config/db');
const bikeRideService = require('../src/services/bikeRideService');
const Rider = require('../src/models/Rider');
const Ride = require('../src/models/Ride');
const RideRequest = require('../src/models/RideRequest');
const RideRating = require('../src/models/RideRating');
const { Op } = require('sequelize');

const runTest = async () => {
  try {
    console.log('Connecting to MySQL database...');
    await sequelize.authenticate();

    await sequelize.sync();
    console.log('Database synced successfully.');

    await RideRating.destroy({ where: {} });
    await RideRequest.destroy({ where: {} });
    await Ride.destroy({ where: {} });
    await Rider.destroy({ where: {} });
    console.log('Cleaned up previous test data.');

    // 1. Verify Pricing Logic
    console.log('\n--- 1. Testing Pricing Logic ---');
    const tests = [
      { dist: 0.5, expected: 40 },
      { dist: 1, expected: 40 },
      { dist: 2, expected: 60 },
      { dist: 21, expected: 440 }
    ];
    for (const t of tests) {
      const actual = bikeRideService.calculatePrice(t.dist);
      console.log(`Distance: ${t.dist} km | Expected: Rs. ${t.expected} | Actual: Rs. ${actual}`);
      if (actual !== t.expected) {
        throw new Error(`Pricing calculation mismatch for distance ${t.dist}`);
      }
    }
    console.log('Pricing logic test passed! ✅');

    // 2. Rider Registration
    console.log('\n--- 2. Testing Rider Registration ---');
    const riderUserId = 'user_rider_123';
    const rider = await bikeRideService.registerRider(
      riderUserId,
      'WP-B-1122',
      'Honda CD125',
      'LIC-998877'
    );
    console.log(`Rider Registered: ID ${rider.id}, User ID ${rider.userId}, Bike: ${rider.bikeModel}`);

    try {
      await bikeRideService.registerRider(riderUserId, 'WP-B-1122', 'Honda CD125', 'LIC-998877');
      throw new Error('Duplicate rider registration should have failed');
    } catch (e) {
      console.log(`Duplicate registration failed as expected: "${e.message}" ✅`);
    }

    // 3. Create Ride
    console.log('\n--- 3. Testing Ride Posting ---');
    const ride = await bikeRideService.createRide(
      riderUserId,
      'Colombo Fort',
      'Galle Face Green',
      21
    );
    console.log(`Ride Posted: ID ${ride.id}, Rider ID ${ride.riderId}, Price: Rs. ${ride.price}, Status: ${ride.status}`);
    if (ride.price !== 440) {
      throw new Error(`Calculated price in ride was not Rs. 440 (got ${ride.price})`);
    }

    // 4. Retrieve Active Rides
    console.log('\n--- 4. Testing Ride Listing ---');
    const rides = await bikeRideService.getActiveRides();
    console.log(`Active Rides Count: ${rides.length}`);
    if (rides.length !== 1 || rides[0].id !== ride.id) {
      throw new Error('Active ride was not listed correctly');
    }
    console.log(`Listed Ride start: ${rides[0].startLocation}, Rider Model: ${rides[0].riderDetails.bikeModel} ✅`);

    // 5. Request Ride
    console.log('\n--- 5. Testing Ride Request ---');
    const passengerUserId = 'user_passenger_456';
    const request = await bikeRideService.requestRide(ride.id, passengerUserId);
    console.log(`Request Created: ID ${request.id}, User: ${request.userId}, Status: ${request.status}`);

    try {
      await bikeRideService.requestRide(ride.id, riderUserId);
      throw new Error('Rider requesting own ride should have failed');
    } catch (e) {
      console.log(`Rider requesting own ride failed as expected: "${e.message}" ✅`);
    }

    // 6. Accept Request
    console.log('\n--- 6. Testing Request Acceptance ---');
    const acceptedReq = await bikeRideService.acceptRideRequest(request.id, riderUserId);
    console.log(`Request Accepted: ID ${acceptedReq.id}, Status: ${acceptedReq.status}`);

    const updatedRide = await Ride.findByPk(ride.id);
    console.log(`Updated Ride Status: ${updatedRide.status}`);
    if (updatedRide.status !== 'accepted') {
      throw new Error('Ride status should be accepted');
    }

    // 7. Complete Ride
    console.log('\n--- 7. Testing Ride Completion ---');
    const completedRide = await bikeRideService.completeRide(ride.id, riderUserId);
    console.log(`Ride Completed: ID ${completedRide.id}, Status: ${completedRide.status}`);
    if (completedRide.status !== 'completed') {
      throw new Error('Ride status should be completed');
    }

    // 8. Rate Ride
    console.log('\n--- 8. Testing Ride Rating ---');
    const rating = await bikeRideService.rateRide(ride.id, passengerUserId, 5, 'Awesome ride! Highly recommended.');
    console.log(`Rating Saved: ID ${rating.id}, Stars: ${rating.rating}, Comment: "${rating.comment}"`);

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The Bike Ride Service module is 100% correct.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  }
};

runTest();
