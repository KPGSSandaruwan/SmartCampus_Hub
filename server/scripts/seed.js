const { sequelize } = require('../src/config/db');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Listing = require('../src/models/Listing');
const Order = require('../src/models/Order');
const RentalCategory = require('../src/models/RentalCategory');
const RentalItem = require('../src/models/RentalItem');
const RentalBooking = require('../src/models/RentalBooking');
const Parcel = require('../src/models/Parcel');
const Rider = require('../src/models/Rider');
const ParcelAssignment = require('../src/models/ParcelAssignment');

dotenv.config();

const RENTAL_CATEGORIES_DATA = [
  {
    title: 'Digital devices',
    slug: 'digital-devices',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    description: 'DSLR & 4K video cameras, projectors, party speakers, action cams, and gimbals.',
    itemCount: 10,
    startingPrice: 1500
  },
  {
    title: 'Computers and computer accessories',
    slug: 'computers-and-computer-accessories',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    description: 'Workstation laptops, 4K monitors, portable NVMe SSDs, mechanical keyboards, & mice.',
    itemCount: 10,
    startingPrice: 250
  },
  {
    title: 'Mobile accessories',
    slug: 'mobile-accessories',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: 'Fast wall chargers, high-capacity power banks, ANC headphones, AirPods, & smartphone gimbals.',
    itemCount: 10,
    startingPrice: 200
  },
  {
    title: 'Stationary items',
    slug: 'stationary-items',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
    description: 'Scientific & graphic calculators, engineering drafting kits, drawing boards, & instruments.',
    itemCount: 10,
    startingPrice: 200
  },
  {
    title: 'Cables',
    slug: 'cables',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    description: 'HDMI 2.1, DisplayPort, 10-in-1 USB-C hubs, Thunderbolt cables, & Cat8 ethernet cables.',
    itemCount: 10,
    startingPrice: 200
  },
  {
    title: 'Camping items',
    slug: 'camping-items',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    description: 'Waterproof tents, LED lanterns, sleeping bags, camping stoves, & hiking backpacks.',
    itemCount: 10,
    startingPrice: 200
  }
];

const RENTAL_ITEMS_DATA = [
  // Digital devices
  {
    title: 'Sony Alpha A7 IV 4K Mirrorless Camera Kit',
    category: 'digital-devices',
    dailyPrice: 4500,
    specs: ['4K 60fps', '33MP Full-Frame', '128GB SD', '2x Batteries'],
    description: 'Top-tier hybrid 4K camera for cinema video shooting and portrait photography.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kasun Perera', email: 'kasun.p@gmail.com', phone: '+94 77 123 4567' },
    deposit: 10000
  },
  {
    title: 'Canon EOS 90D DSLR Camera Kit',
    category: 'digital-devices',
    dailyPrice: 3500,
    specs: ['32.5MP APS-C', '4K Video', '18-135mm Lens', 'Extra Battery'],
    description: 'Ideal DSLR camera for campus documentary projects, sports coverage, and photojournalism.',
    image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dinuka Silva', email: 'dinuka.s@gmail.com', phone: '+94 71 987 6543' },
    deposit: 8000
  },
  {
    title: 'Nikon Z6 II Full-Frame Mirrorless Camera',
    category: 'digital-devices',
    dailyPrice: 3800,
    specs: ['24.5MP Sensor', 'Dual EXPEED 6', '4K 60p', '24-70mm Lens'],
    description: 'Versatile mirrorless camera with excellent low-light performance for events.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Sahan Jayawardena', email: 'sahan.j@gmail.com', phone: '+94 78 999 0011' },
    deposit: 8500
  },
  {
    title: 'Epson Pro Full HD 1080p 4000 Lumens Projector',
    category: 'digital-devices',
    dailyPrice: 2800,
    specs: ['4,000 Lumens', 'Full HD 1080p', 'Wireless Mirroring', 'HDMI'],
    description: 'Ultra-bright projector suitable for lecture halls, presentation slides, and movie nights.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dinuka Silva', email: 'dinuka.s@gmail.com', phone: '+94 71 987 6543' },
    deposit: 6000
  },

  // Computers and computer accessories
  {
    title: 'Apple MacBook Pro 16" M2 Pro Workstation',
    category: 'computers-and-computer-accessories',
    dailyPrice: 5500,
    specs: ['32GB RAM', '1TB NVMe SSD', 'Liquid Retina XDR', 'MagSafe'],
    description: 'Powerhouse machine for video editing, iOS development, machine learning, & rendering.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kavindu Rathnayake', email: 'kavindu.r@gmail.com', phone: '+94 76 222 3344' },
    deposit: 15000
  },
  {
    title: 'Dell XPS 15 9530 Core i9 Workstation Laptop',
    category: 'computers-and-computer-accessories',
    dailyPrice: 4800,
    specs: ['Intel Core i9', 'RTX 4060 GPU', '32GB DDR5', '3.5K OLED'],
    description: 'Premium Windows laptop with dedicated graphics for CAD modeling, Unity, & Unreal Engine.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Tharindu Gamage', email: 'tharindu.g@gmail.com', phone: '+94 71 222 4455' },
    deposit: 12000
  },

  // Mobile accessories
  {
    title: 'Anker 20,000mAh Power Bank Fast Charger',
    category: 'mobile-accessories',
    dailyPrice: 220,
    specs: ['20,000mAh', 'PowerIQ 3.0', 'Dual USB-C', 'Fast Charge'],
    description: 'High capacity power bank capable of charging phones 4-5 times.',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Charith Mendis', email: 'charith.m@gmail.com', phone: '+94 77 555 6677' },
    deposit: 800
  },

  // Stationary items
  {
    title: 'Casio FX-991EX ClassWiz Scientific Calculator',
    category: 'stationary-items',
    dailyPrice: 200,
    specs: ['552 Functions', 'High-Res Display', 'Solar & Battery', 'Exam Legal'],
    description: 'Must-have scientific calculator for engineering and physical science exams.',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Isuru Fonseka', email: 'isuru.f@gmail.com', phone: '+94 77 888 1122' },
    deposit: 600
  },

  // Cables
  {
    title: 'Anker 10-in-1 USB-C Multiport Dongle Hub',
    category: 'cables',
    dailyPrice: 300,
    specs: ['Dual 4K HDMI', '100W PD Pass-through', '1Gbps Ethernet', 'SD Reader'],
    description: 'Connect monitors, ethernet, flash drives, and power to any laptop with a single USB-C port.',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dileepa Jayasuriya', email: 'dileepa.j@gmail.com', phone: '+94 77 666 4433' },
    deposit: 800
  },

  // Camping items
  {
    title: '4-Person Waterproof Outdoor Camping Tent',
    category: 'camping-items',
    dailyPrice: 600,
    specs: ['4-Person Capacity', 'Waterproof PU3000', 'Double Layer', 'Easy Setup'],
    description: 'Spacious waterproof camping tent with rainfly cover for outdoor trips & hikes.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Akila Karunaratne', email: 'akila.k@gmail.com', phone: '+94 77 999 1234' },
    deposit: 1500
  }
];

const seedData = async () => {
  try {
    console.log('Authenticating connection to MySQL...');
    await sequelize.authenticate();
    console.log('Connected to MySQL successfully.');

    // Force sync drops existing tables in MySQL and recreates them
    console.log('Re-creating MySQL database tables (sync force)...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Re-created all database tables.');

    // 1. Seed Users individually to guarantee auto-increment IDs are populated
    console.log('Seeding users...');
    const alex = await User.create({
      name: 'Alex Rivera',
      email: 'alex@uni.edu',
      password: 'password123',
      universityId: 'UNI-2024-8841',
      role: 'student',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
      rating: 4.9
    });

    const sarah = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@uni.edu',
      password: 'password123',
      universityId: 'UNI-2024-9912',
      role: 'student',
      phone: '+1 (555) 876-5432',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      rating: 4.8
    });

    const admin = await User.create({
      name: 'Campus Admin',
      email: 'admin@uni.edu',
      password: 'adminpassword123',
      universityId: 'ADMIN-0001',
      role: 'admin',
      phone: '+1 (555) 000-1111',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      rating: 5.0
    });

    console.log(`✅ Seeded Users: Alex (${alex.id}), Sarah (${sarah.id}), Admin (${admin.id}).`);

    // 2. Seed Listings individually to guarantee auto-increment IDs are populated
    console.log('Seeding marketplace listings...');
    const l1 = await Listing.create({
      title: 'Ride to Airport / Metro Station',
      description: 'Driving down to the Central Metro & Airport this Friday afternoon at 4:30 PM. Room for 3 people with luggage.',
      category: 'rides',
      price: 15,
      location: 'North Campus Gate -> Central Metro',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600'],
      details: {
        departureTime: '2026-08-15 16:30',
        seatsAvailable: 3,
        vehicleModel: 'Honda Civic White'
      },
      ownerId: alex.id
    });

    const l2 = await Listing.create({
      title: 'Express Parcel Pick & Drop from Post Office',
      description: 'I am visiting the main university post office today at 2 PM. Can pick up packages or deliver items across South Campus.',
      category: 'parcels',
      price: 8,
      location: 'University Main Post Office -> South Dorms',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600'],
      details: {
        weightKg: 5,
        deadline: 'Today before 5 PM'
      },
      ownerId: sarah.id
    });

    const l3 = await Listing.create({
      title: 'Sony Alpha Camera & Tripod Rental',
      description: 'Rent my Sony A6400 4K mirrorless camera kit for weekend video projects or events. Includes 16-50mm lens and SD card.',
      category: 'rentals',
      price: 25,
      location: 'Media Arts Center / West Hall',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'],
      details: {
        durationType: 'daily',
        deposit: 50
      },
      ownerId: alex.id
    });

    const l4 = await Listing.create({
      title: 'Calculus III & Linear Algebra Tutoring',
      description: 'Senior Math major offering 1-on-1 tutoring sessions for Calc 1-3, Linear Algebra, and Intro Stats.',
      category: 'services',
      price: 20,
      location: 'Science Library / Zoom',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600'],
      details: {
        estimatedHours: 1,
        skillTags: ['Math', 'Calculus', 'Linear Algebra']
      },
      ownerId: sarah.id
    });

    const l5 = await Listing.create({
      title: 'Ergonomic Desk Chair (Like New)',
      description: 'Selling my mesh high-back desk chair with lumbar support. Used for 1 semester, perfectly clean.',
      category: 'products',
      price: 45,
      location: 'Highland Oaks Dorm B, Room 304',
      status: 'active',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'],
      details: {
        condition: 'Like New',
        brand: 'Autonomous'
      },
      ownerId: alex.id
    });
    
    console.log(`✅ Seeded 5 Marketplace Listings.`);

    // 3. Seed Order
    console.log('Seeding order...');
    await Order.create({
      listingId: l1.id,
      requesterId: sarah.id,
      providerId: alex.id,
      status: 'pending',
      totalPrice: 15.00,
      notes: 'Hey Alex! I have one small backpack with me. Can I reserve 1 seat?'
    });
    console.log('✅ Seeded Orders.');

    // 4. Seed Rental Categories
    console.log('Seeding equipment rental categories...');
    await RentalCategory.bulkCreate(RENTAL_CATEGORIES_DATA);
    console.log(`✅ Seeded ${RENTAL_CATEGORIES_DATA.length} Rental Categories.`);

    // 5. Seed Rental Items
    console.log('Seeding equipment rental items...');
    const rentalItemsToInsert = RENTAL_ITEMS_DATA.map((item, idx) => {
      const ownerUser = idx % 2 === 0 ? alex : sarah;
      return {
        id: `rent-${idx + 1}-${Date.now().toString().slice(-4)}`,
        category: item.category,
        title: item.title,
        dailyPrice: item.dailyPrice,
        specs: item.specs,
        description: item.description,
        image: item.image,
        ownerId: ownerUser.id.toString(),
        ownerName: item.owner.name,
        ownerEmail: item.owner.email,
        ownerPhone: item.owner.phone || '+94 77 123 4567',
        deposit: item.deposit,
        status: 'active'
      };
    });
    await RentalItem.bulkCreate(rentalItemsToInsert);
    console.log(`✅ Seeded ${rentalItemsToInsert.length} Rental Items.`);

    // 6. Seed Rider and Parcel Delivery Requests with Tracking Codes
    console.log('Seeding riders and parcel delivery requests...');
    const alexRider = await Rider.create({
      userId: alex.id.toString(),
      bikeNumber: 'WP BIKE-8841',
      bikeModel: 'Yamaha FZ-S V3 150cc',
      licenseNumber: 'DL-8841-2024'
    });

    const p1 = await Parcel.create({
      senderId: sarah.id.toString(),
      pickupLocation: 'Science Library / Faculty of Science',
      dropLocation: 'Highland Oaks Dorm B, Room 304',
      weightKg: 1.5,
      price: 200,
      trackingCode: 'TRK-892347',
      status: 'pending'
    });

    const p2 = await Parcel.create({
      senderId: sarah.id.toString(),
      pickupLocation: 'Main University Gate Post Office',
      dropLocation: 'Engineering Complex Lab 02',
      weightKg: 3.0,
      price: 600,
      trackingCode: 'TRK-415902',
      status: 'in_transit',
      pickedUpAt: new Date(Date.now() - 30 * 60 * 1000)
    });
    await ParcelAssignment.create({
      parcelId: p2.id,
      riderId: alexRider.id
    });

    const p3 = await Parcel.create({
      senderId: alex.id.toString(),
      pickupLocation: 'Central Student Union Canteen',
      dropLocation: 'Medical Faculty Lecture Hall 1',
      weightKg: 0.8,
      price: 100,
      trackingCode: 'TRK-630129',
      status: 'completed',
      pickedUpAt: new Date(Date.now() - 120 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 20 * 60 * 1000)
    });
    await ParcelAssignment.create({
      parcelId: p3.id,
      riderId: alexRider.id
    });
    console.log('✅ Seeded Parcels with Tracking Codes.');

    console.log('🎉 MySQL Database Sync & Seeding Complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MySQL database:', error.message);
    process.exit(1);
  }
};

seedData();
