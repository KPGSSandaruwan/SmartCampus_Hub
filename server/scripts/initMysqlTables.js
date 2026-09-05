const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const initMysqlDatabase = async () => {
  try {
    console.log('Connecting to Aiven MySQL Database (campuslink)...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'bluebirddb-sandeepal513-4009.k.aivencloud.com',
      port: Number(process.env.DB_PORT) || 15359,
      user: process.env.DB_USER || 'avnadmin',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'campuslink',
      connectTimeout: 10000,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ Connected to Aiven MySQL Server!');

    // 1. users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        university_id VARCHAR(100),
        role VARCHAR(50) DEFAULT 'student',
        phone VARCHAR(50),
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `users` ready.');

    // 2. rides table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS rides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        origin VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        departure_time VARCHAR(100) NOT NULL,
        seats_available INT DEFAULT 3,
        vehicle_model VARCHAR(100),
        price DECIMAL(10,2) DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `rides` ready.');

    // 3. riders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS riders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        vehicle_type VARCHAR(100),
        vehicle_number VARCHAR(100),
        license_number VARCHAR(100),
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `riders` ready.');

    // 4. ride_requests table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ride_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ride_id INT,
        passenger_id INT,
        seats_requested INT DEFAULT 1,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `ride_requests` ready.');

    // 5. ride_ratings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ride_ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ride_id INT,
        reviewer_id INT,
        rating INT DEFAULT 5,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `ride_ratings` ready.');

    // 6. parcels table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS parcels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT,
        pickup_location VARCHAR(255) NOT NULL,
        delivery_location VARCHAR(255) NOT NULL,
        weight_kg DECIMAL(5,2) DEFAULT 1.0,
        description TEXT,
        fee DECIMAL(10,2) DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `parcels` ready.');

    // 7. parcel_assignments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS parcel_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        parcel_id INT,
        rider_id INT,
        status VARCHAR(50) DEFAULT 'assigned',
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        delivered_at TIMESTAMP NULL
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `parcel_assignments` ready.');

    // 8. rental_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS rental_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        daily_price DECIMAL(10,2) NOT NULL,
        specs TEXT,
        description TEXT,
        image VARCHAR(500) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        owner_email VARCHAR(255) NOT NULL,
        owner_phone VARCHAR(50) NOT NULL,
        deposit DECIMAL(10,2) DEFAULT 500.00,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `rental_items` ready.');

    // 9. rental_bookings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS rental_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT,
        item_title VARCHAR(255) NOT NULL,
        renter_name VARCHAR(255) NOT NULL,
        renter_email VARCHAR(255) NOT NULL,
        renter_phone VARCHAR(50) NOT NULL,
        start_date VARCHAR(100) NOT NULL,
        days INT DEFAULT 1,
        daily_price DECIMAL(10,2) NOT NULL,
        deposit DECIMAL(10,2) DEFAULT 0.00,
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `rental_bookings` ready.');

    // Seed Sample Equipment Items into rental_items MySQL table
    const [existingItems] = await connection.query('SELECT COUNT(*) as cnt FROM rental_items');
    if (existingItems[0].cnt === 0) {
      await connection.query(`
        INSERT INTO rental_items (title, category, daily_price, specs, description, image, owner_name, owner_email, owner_phone, deposit)
        VALUES
        ('Sony Alpha A7 IV 4K Mirrorless Camera Kit', 'digital-devices', 4500.00, '4K 60fps, 33MP, 128GB SD', 'Top-tier hybrid 4K camera for cinema video shooting and portrait photography.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Kasun Perera', 'kasun.p@gmail.com', '+94 77 123 4567', 10000.00),
        ('Canon EOS 90D DSLR Camera Kit', 'digital-devices', 3500.00, '32.5MP APS-C, 4K Video, 18-135mm Lens', 'Ideal DSLR camera for campus documentary projects and photojournalism.', 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80', 'Dinuka Silva', 'dinuka.s@gmail.com', '+94 71 987 6543', 8000.00),
        ('Apple MacBook Pro 16" M2 Pro Workstation', 'computers-and-computer-accessories', 5500.00, '32GB RAM, 1TB SSD, Liquid Retina XDR', 'Powerhouse machine for video editing, iOS development, & rendering.', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80', 'Kavindu Rathnayake', 'kavindu.r@gmail.com', '+94 76 222 3344', 15000.00),
        ('Casio FX-991EX ClassWiz Scientific Calculator', 'stationary-items', 200.00, '552 Functions, High-Res Display, Solar', 'Must-have scientific calculator for engineering exams.', 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80', 'Isuru Fonseka', 'isuru.f@gmail.com', '+94 77 888 1122', 600.00),
        ('Anker 10-in-1 USB-C Multiport Dongle Hub', 'cables', 300.00, 'Dual 4K HDMI, 100W PD, 1Gbps Ethernet', 'Connect monitors and power to laptop with single USB-C port.', 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80', 'Dileepa Jayasuriya', 'dileepa.j@gmail.com', '+94 77 666 4433', 800.00),
        ('4-Person Waterproof Outdoor Camping Tent', 'camping-items', 600.00, '4-Person Capacity, PU3000 Waterproof', 'Spacious waterproof camping tent for outdoor trips.', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', 'Akila Karunaratne', 'akila.k@gmail.com', '+94 77 999 1234', 1500.00);
      `);
      console.log('✅ Seeded MySQL `rental_items` with sample records.');
    }

    // 10. jobs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        provider_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        job_type VARCHAR(100) NOT NULL,
        pay_rate VARCHAR(100) NOT NULL,
        max_applicants INT DEFAULT 2,
        applicants_count INT DEFAULT 0,
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `jobs` ready.');

    // 11. job_applications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        applicant_name VARCHAR(255) NOT NULL,
        applicant_email VARCHAR(255) NOT NULL,
        applicant_phone VARCHAR(50) NOT NULL,
        note TEXT,
        status VARCHAR(50) DEFAULT 'applied',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Table `job_applications` ready.');

    await connection.end();
    console.log('🎉 All 11 MySQL Tables Created & Verified Successfully on Aiven Cloud!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MySQL Init Error:', error.message);
    process.exit(1);
  }
};

initMysqlDatabase();
