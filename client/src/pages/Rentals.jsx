import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import rentalsAPI from '../services/rentalsApi';
import './RentalsDynamic.css';
import {
  Search,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  X,
  ChevronRight,
  Mail,
  Phone,
  User,
  Cpu,
  Laptop as LaptopIcon,
  Smartphone,
  BookOpen,
  Cable as CableIcon,
  Compass,
  Sparkles
} from 'lucide-react';

import './Rentals.css';

// 6 Required Categories with High Definition Photography
const RENTAL_CATEGORIES = [
  {
    id: 'digital-devices',
    title: 'Digital devices',
    slug: 'digital-devices',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    icon: <Cpu size={22} />,
    description: 'DSLR & 4K video cameras, projectors, party speakers, action cams, and gimbals.',
    itemCount: 10,
    startingPrice: 1500
  },
  {
    id: 'computers-and-computer-accessories',
    title: 'Computers and computer accessories',
    slug: 'computers-and-computer-accessories',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    icon: <LaptopIcon size={22} />,
    description: 'Workstation laptops, 4K monitors, portable NVMe SSDs, mechanical keyboards, & mice.',
    itemCount: 10,
    startingPrice: 250
  },
  {
    id: 'mobile-accessories',
    title: 'Mobile accessories',
    slug: 'mobile-accessories',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    icon: <Smartphone size={22} />,
    description: 'Fast wall chargers, high-capacity power banks, ANC headphones, AirPods, & smartphone gimbals.',
    itemCount: 10,
    startingPrice: 200
  },
  {
    id: 'stationary-items',
    title: 'Stationary items',
    slug: 'stationary-items',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
    icon: <BookOpen size={22} />,
    description: 'Scientific & graphic calculators, engineering drafting kits, drawing boards, & instruments.',
    itemCount: 10,
    startingPrice: 200
  },
  {
    id: 'cables',
    title: 'Cables',
    slug: 'cables',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    icon: <CableIcon size={22} />,
    description: 'HDMI 2.1, DisplayPort, 10-in-1 USB-C hubs, Thunderbolt cables, & Cat8 ethernet cables.',
    itemCount: 10,
    startingPrice: 200
  },
  {
    id: 'camping-items',
    title: 'Camping items',
    slug: 'camping-items',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    icon: <Compass size={22} />,
    description: 'Waterproof tents, LED lanterns, sleeping bags, camping stoves, & hiking backpacks.',
    itemCount: 10,
    startingPrice: 200
  }
];

// Realistic Equipment Inventory with 10 Items per Category
const RENTAL_ITEMS = [
  // 1. Digital devices (10 Items)
  {
    id: 'dig-1',
    category: 'digital-devices',
    title: 'Sony Alpha A7 IV 4K Mirrorless Camera Kit',
    dailyPrice: 4500,
    specs: ['4K 60fps', '33MP Full-Frame', '128GB SD', '2x Batteries'],
    description: 'Top-tier hybrid 4K camera for cinema video shooting and portrait photography.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kasun Perera', email: 'kasun.p@gmail.com', phone: '+94 77 123 4567' },
    deposit: 10000
  },
  {
    id: 'dig-2',
    category: 'digital-devices',
    title: 'Canon EOS 90D DSLR Camera Kit',
    dailyPrice: 3500,
    specs: ['32.5MP APS-C', '4K Video', '18-135mm Lens', 'Extra Battery'],
    description: 'Ideal DSLR camera for campus documentary projects, sports coverage, and photojournalism.',
    image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dinuka Silva', email: 'dinuka.s@gmail.com', phone: '+94 71 987 6543' },
    deposit: 8000
  },
  {
    id: 'dig-3',
    category: 'digital-devices',
    title: 'Nikon Z6 II Full-Frame Mirrorless Camera',
    dailyPrice: 3800,
    specs: ['24.5MP Sensor', 'Dual EXPEED 6', '4K 60p', '24-70mm Lens'],
    description: 'Versatile mirrorless camera with excellent low-light performance for events.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Sahan Jayawardena', email: 'sahan.j@gmail.com', phone: '+94 78 999 0011' },
    deposit: 8500
  },
  {
    id: 'dig-4',
    category: 'digital-devices',
    title: 'Fujifilm X-T4 4K Video Camera & Lens',
    dailyPrice: 3200,
    specs: ['In-Body Stabilization', '4K 60p 10-Bit', 'Film Simulation'],
    description: 'Compact hybrid video camera with film color simulation profiles.',
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Lankanath Rodrigo', email: 'lankanath.r@gmail.com', phone: '+94 71 777 5511' },
    deposit: 7000
  },
  {
    id: 'dig-5',
    category: 'digital-devices',
    title: 'GoPro Hero 11 Black 4K Action Camera',
    dailyPrice: 1500,
    specs: ['5.3K Video', 'HyperSmooth 5.0', 'Waterproof 10m', 'Mounts'],
    description: 'Rugged waterproof action camera for outdoor sports, travel vlogging, and adventure.',
    image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Malith Fernando', email: 'malith.f@gmail.com', phone: '+94 75 456 7890' },
    deposit: 4000
  },
  {
    id: 'dig-6',
    category: 'digital-devices',
    title: 'Epson Pro Full HD 1080p 4000 Lumens Projector',
    dailyPrice: 2800,
    specs: ['4,000 Lumens', 'Full HD 1080p', 'Wireless Mirroring', 'HDMI'],
    description: 'Ultra-bright projector suitable for lecture halls, presentation slides, and movie nights.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dinuka Silva', email: 'dinuka.s@gmail.com', phone: '+94 71 987 6543' },
    deposit: 6000
  },
  {
    id: 'dig-7',
    category: 'digital-devices',
    title: 'Anker Nebula Capsule Mini Portable Projector',
    dailyPrice: 1800,
    specs: ['Pocket Sized', '360° Speaker', '4h Battery', 'Android TV'],
    description: 'Ultra-compact soda-can sized projector. Project anywhere onto any clean wall.',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Nisala Wickramasinghe', email: 'nisala.w@gmail.com', phone: '+94 75 222 9900' },
    deposit: 4000
  },
  {
    id: 'dig-8',
    category: 'digital-devices',
    title: 'BenQ MH535FHD High Brightness Projector',
    dailyPrice: 2400,
    specs: ['3600 ANSI Lumens', '1080p Native', 'Dual HDMI Ports'],
    description: 'Crisp presentation projector optimized for detailed engineering diagrams.',
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Tharindu Gamage', email: 'tharindu.g@gmail.com', phone: '+94 71 222 4455' },
    deposit: 5000
  },
  {
    id: 'dig-9',
    category: 'digital-devices',
    title: 'DJI Ronin SC 3-Axis Motorized Camera Gimbal',
    dailyPrice: 1600,
    specs: ['3-Axis Stabilization', '2.0kg Payload', 'Focus Wheel'],
    description: 'Smooth motorized stabilization for mirrorless cameras during dynamic handheld shoots.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Malith Fernando', email: 'malith.f@gmail.com', phone: '+94 75 456 7890' },
    deposit: 3500
  },
  {
    id: 'dig-10',
    category: 'digital-devices',
    title: 'JBL PartyBox 310 Portable Bluetooth Speaker',
    dailyPrice: 2500,
    specs: ['240W RMS Output', 'RGB Lightshow', '18h Battery', 'Wheels'],
    description: 'High power party speaker with deep bass, microphone inputs, and Bluetooth pairing.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Akila Karunaratne', email: 'akila.k@gmail.com', phone: '+94 77 999 1234' },
    deposit: 5000
  },

  // 2. Computers and computer accessories (10 Items)
  {
    id: 'cmp-1',
    category: 'computers-and-computer-accessories',
    title: 'Apple MacBook Pro 16" M2 Pro Workstation',
    dailyPrice: 5500,
    specs: ['32GB RAM', '1TB NVMe SSD', 'Liquid Retina XDR', 'MagSafe'],
    description: 'Powerhouse machine for video editing, iOS development, machine learning, & rendering.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kavindu Rathnayake', email: 'kavindu.r@gmail.com', phone: '+94 76 222 3344' },
    deposit: 15000
  },
  {
    id: 'cmp-2',
    category: 'computers-and-computer-accessories',
    title: 'Dell XPS 15 9530 Core i9 Workstation Laptop',
    dailyPrice: 4800,
    specs: ['Intel Core i9', 'RTX 4060 GPU', '32GB DDR5', '3.5K OLED'],
    description: 'Premium Windows laptop with dedicated graphics for CAD modeling, Unity, & Unreal Engine.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Tharindu Gamage', email: 'tharindu.g@gmail.com', phone: '+94 71 222 4455' },
    deposit: 12000
  },
  {
    id: 'cmp-3',
    category: 'computers-and-computer-accessories',
    title: 'Lenovo ThinkPad X1 Carbon Gen 10 Laptop',
    dailyPrice: 3500,
    specs: ['Intel Core i7', '16GB RAM', '512GB SSD', 'Ultra-Light 1.1kg'],
    description: 'Ultra-light business workstation laptop with superb keyboard for programming.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Gayan Weerasinghe', email: 'gayan.w@gmail.com', phone: '+94 71 444 8899' },
    deposit: 9000
  },
  {
    id: 'cmp-4',
    category: 'computers-and-computer-accessories',
    title: 'ASUS ROG Zephyrus G14 Gaming/Rendering Laptop',
    dailyPrice: 4000,
    specs: ['Ryzen 9', 'RTX 3070', '16GB RAM', '120Hz Display'],
    description: 'High refresh rate performance laptop for graphics design and 3D simulation.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Charith Mendis', email: 'charith.m@gmail.com', phone: '+94 77 555 6677' },
    deposit: 10000
  },
  {
    id: 'cmp-5',
    category: 'computers-and-computer-accessories',
    title: 'SanDisk 2TB Extreme Portable NVMe SSD',
    dailyPrice: 450,
    specs: ['1050MB/s Speed', 'USB 3.2 Gen 2', 'Drop Resistant'],
    description: 'Ultra-fast NVMe portable SSD drive for high speed video and project data backup.',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Chathura Bandara', email: 'chathura.b@gmail.com', phone: '+94 70 111 2233' },
    deposit: 1500
  },
  {
    id: 'cmp-6',
    category: 'computers-and-computer-accessories',
    title: 'LaCie Rugged Mini 4TB External Hard Drive',
    dailyPrice: 350,
    specs: ['4TB Capacity', 'Shock & Pressure Proof', 'USB-C'],
    description: 'Heavy duty high capacity drive to back up large datasets & raw files.',
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Praveen Ranasinghe', email: 'praveen.r@gmail.com', phone: '+94 72 333 4455' },
    deposit: 1200
  },
  {
    id: 'cmp-7',
    category: 'computers-and-computer-accessories',
    title: 'Samsung T7 Shield 1TB NVMe Portable SSD',
    dailyPrice: 300,
    specs: ['1050MB/s', 'Rubber Bumper', 'Hardware Encrypted'],
    description: 'Rugged portable drive ideal for storing final year project data.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kavindu Rathnayake', email: 'kavindu.r@gmail.com', phone: '+94 76 222 3344' },
    deposit: 1000
  },
  {
    id: 'cmp-8',
    category: 'computers-and-computer-accessories',
    title: 'Logitech MX Master 3S Wireless Ergonomic Mouse',
    dailyPrice: 250,
    specs: ['8K DPI Track', 'Quiet Clicks', 'MagSpeed Scroll'],
    description: 'Precision wireless ergonomic mouse for software developers & designers.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Praveen Ranasinghe', email: 'praveen.r@gmail.com', phone: '+94 72 333 4455' },
    deposit: 800
  },
  {
    id: 'cmp-9',
    category: 'computers-and-computer-accessories',
    title: 'Keychron K2 Mechanical Wireless Keyboard',
    dailyPrice: 300,
    specs: ['Gateron Brown Switches', 'RGB Backlight', 'Bluetooth 5.1'],
    description: 'Tactile mechanical keyboard for typing speed and coding accuracy.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Isuru Fonseka', email: 'isuru.f@gmail.com', phone: '+94 77 888 1122' },
    deposit: 1000
  },
  {
    id: 'cmp-10',
    category: 'computers-and-computer-accessories',
    title: 'Dell UltraSharp 27" 4K Monitor with USB-C Hub',
    dailyPrice: 1500,
    specs: ['4K IPS', '99% sRGB', '90W USB-C PD', 'Adjustable Stand'],
    description: 'Color-accurate 4K monitor for dual-screen productivity & graphic design.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kasun Perera', email: 'kasun.p@gmail.com', phone: '+94 77 123 4567' },
    deposit: 5000
  },

  // 3. Mobile accessories (10 Items)
  {
    id: 'mob-1',
    category: 'mobile-accessories',
    title: 'Anker 20,000mAh Power Bank Fast Charger',
    dailyPrice: 220,
    specs: ['20,000mAh', 'PowerIQ 3.0', 'Dual USB-C', 'Fast Charge'],
    description: 'High capacity power bank capable of charging phones 4-5 times.',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Charith Mendis', email: 'charith.m@gmail.com', phone: '+94 77 555 6677' },
    deposit: 800
  },
  {
    id: 'mob-2',
    category: 'mobile-accessories',
    title: 'Baseus 30,000mAh 65W Laptop & Phone Power Bank',
    dailyPrice: 280,
    specs: ['30,000mAh', '65W Power Delivery', 'Digital Display'],
    description: 'Heavy duty power bank that can power both laptops and smartphones.',
    image: 'https://images.unsplash.com/photo-1622445268465-8438b658a8fc?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Gayan Weerasinghe', email: 'gayan.w@gmail.com', phone: '+94 71 444 8899' },
    deposit: 1000
  },
  {
    id: 'mob-3',
    category: 'mobile-accessories',
    title: 'Anker 737 GaNPrime 120W USB-C Wall Charger',
    dailyPrice: 250,
    specs: ['120W Output', '2x USB-C + 1x USB-A', 'GaN Tech'],
    description: 'Charge 3 devices simultaneously at maximum speed.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Charith Mendis', email: 'charith.m@gmail.com', phone: '+94 77 555 6677' },
    deposit: 800
  },
  {
    id: 'mob-4',
    category: 'mobile-accessories',
    title: 'Apple 140W USB-C Adapter + MagSafe 3 Cable',
    dailyPrice: 300,
    specs: ['140W Power', 'MagSafe 3 Braided Cable', '2m Length'],
    description: 'Official fast charger for MacBook Pro 16-inch.',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Gayan Weerasinghe', email: 'gayan.w@gmail.com', phone: '+94 71 444 8899' },
    deposit: 1000
  },
  {
    id: 'mob-5',
    category: 'mobile-accessories',
    title: 'Samsung 65W Trio Fast Wall Power Adapter',
    dailyPrice: 200,
    specs: ['65W Max', 'Dual Type-C + USB-A', 'Super Fast Charge'],
    description: 'Versatile travel power adapter for laptops & phones.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dinuka Silva', email: 'dinuka.s@gmail.com', phone: '+94 71 987 6543' },
    deposit: 700
  },
  {
    id: 'mob-6',
    category: 'mobile-accessories',
    title: 'Bose SoundLink Revolve+ II Portable Bluetooth Speaker',
    dailyPrice: 400,
    specs: ['360° Sound', 'IP55 Water Resistant', '17h Playtime'],
    description: 'Crisp room-filling sound in a portable design with handle.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Roshen Cooray', email: 'roshen.c@gmail.com', phone: '+94 72 888 3322' },
    deposit: 1500
  },
  {
    id: 'mob-7',
    category: 'mobile-accessories',
    title: 'Sony Wireless Noise-Cancelling ANC Headphones',
    dailyPrice: 350,
    specs: ['Active Noise Cancellation', '30h Playtime', 'Crisp Bass'],
    description: 'Noise-cancelling wireless headphones for quiet studying.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Sahan Jayawardena', email: 'sahan.j@gmail.com', phone: '+94 78 999 0011' },
    deposit: 1200
  },
  {
    id: 'mob-8',
    category: 'mobile-accessories',
    title: 'Apple AirPods Pro (2nd Gen) with MagSafe Case',
    dailyPrice: 300,
    specs: ['Active Noise Cancellation', 'Adaptive Audio', 'MagSafe'],
    description: 'In-ear wireless earbuds with active noise cancellation.',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kasun Perera', email: 'kasun.p@gmail.com', phone: '+94 77 123 4567' },
    deposit: 1000
  },
  {
    id: 'mob-9',
    category: 'mobile-accessories',
    title: 'MagSafe Magnetic Wireless Car Mount Charger',
    dailyPrice: 200,
    specs: ['15W Fast Charge', 'Strong Magnet', '360° Rotation'],
    description: 'Convenient magnetic phone mount and wireless charger.',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Chathura Bandara', email: 'chathura.b@gmail.com', phone: '+94 70 111 2233' },
    deposit: 600
  },
  {
    id: 'mob-10',
    category: 'mobile-accessories',
    title: 'DJI Osmo Mobile 6 Smartphone Gimbal Stabilizer',
    dailyPrice: 450,
    specs: ['3-Axis Gimbal', 'ActiveTrack 5.0', 'Built-in Extension Rod'],
    description: 'Handheld smartphone stabilizer for smooth video recordings.',
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Malith Fernando', email: 'malith.f@gmail.com', phone: '+94 75 456 7890' },
    deposit: 1500
  },

  // 4. Stationary items (10 Items)
  {
    id: 'stn-1',
    category: 'stationary-items',
    title: 'Casio FX-991EX ClassWiz Scientific Calculator',
    dailyPrice: 200,
    specs: ['552 Functions', 'High-Res Display', 'Solar & Battery', 'Exam Legal'],
    description: 'Must-have scientific calculator for engineering and physical science exams.',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Isuru Fonseka', email: 'isuru.f@gmail.com', phone: '+94 77 888 1122' },
    deposit: 600
  },
  {
    id: 'stn-2',
    category: 'stationary-items',
    title: 'TI-84 Plus CE Color Graphic Calculator',
    dailyPrice: 350,
    specs: ['Color Display', 'Exam Legal', 'Rechargeable', 'Graphing Apps'],
    description: 'Standard graphic calculator for calculus, matrix algebra, statistics, & physics.',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Shehan Alwis', email: 'shehan.a@gmail.com', phone: '+94 71 333 7788' },
    deposit: 1000
  },
  {
    id: 'stn-3',
    category: 'stationary-items',
    title: 'TI-Nspire CX II CAS Graphic Calculator',
    dailyPrice: 450,
    specs: ['CAS Engine', '3D Graphing', 'Color Screen', 'Exam Approved'],
    description: 'Advanced Computer Algebra System calculator for complex differential equations.',
    image: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Chathura Bandara', email: 'chathura.b@gmail.com', phone: '+94 70 111 2233' },
    deposit: 1200
  },
  {
    id: 'stn-4',
    category: 'stationary-items',
    title: 'Casio FX-570ES Plus Natural Display Calculator',
    dailyPrice: 200,
    specs: ['417 Functions', 'Natural Textbook Display', 'Matrix/Vector'],
    description: 'Reliable non-programmable scientific calculator for university midterms.',
    image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dinuka Silva', email: 'dinuka.s@gmail.com', phone: '+94 71 987 6543' },
    deposit: 500
  },
  {
    id: 'stn-5',
    category: 'stationary-items',
    title: 'Complete Engineering Drawing & Drafting Kit',
    dailyPrice: 250,
    specs: ['T-Square', 'Set Squares', 'Compass Set', 'Board'],
    description: 'Complete set of engineering drafting instruments for civil & mechanical drawing.',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Nisala Wickramasinghe', email: 'nisala.w@gmail.com', phone: '+94 75 222 9900' },
    deposit: 800
  },
  {
    id: 'stn-6',
    category: 'stationary-items',
    title: 'Rotring Isograph Technical Drawing Pen Set',
    dailyPrice: 220,
    specs: ['0.25mm / 0.35mm / 0.5mm', 'Refillable Ink', 'High Precision'],
    description: 'Precision technical ink pens for architectural and engineering blueprint drawings.',
    image: 'https://images.unsplash.com/photo-1585336261026-6757f541a674?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Praveen Ranasinghe', email: 'praveen.r@gmail.com', phone: '+94 72 333 4455' },
    deposit: 700
  },
  {
    id: 'stn-7',
    category: 'stationary-items',
    title: 'Adjustable A2 Desktop Technical Drawing Board',
    dailyPrice: 300,
    specs: ['A2 Size', 'Parallel Motion Ruler', 'Angle Lock'],
    description: 'Portable drafting board with built-in straightedge ruler for design projects.',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kavindu Rathnayake', email: 'kavindu.r@gmail.com', phone: '+94 76 222 3344' },
    deposit: 1000
  },
  {
    id: 'stn-8',
    category: 'stationary-items',
    title: 'HP Prime Graphing Calculator with Touch Screen',
    dailyPrice: 400,
    specs: ['Color Touch Screen', 'CAS Engine', 'Rechargeable'],
    description: 'Full-color touchscreen graphic calculator with computer algebra capability.',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Shehan Alwis', email: 'shehan.a@gmail.com', phone: '+94 71 333 7788' },
    deposit: 1200
  },
  {
    id: 'stn-9',
    category: 'stationary-items',
    title: 'Professional Architectural Scale Ruler & Stencil Kit',
    dailyPrice: 200,
    specs: ['Triangular Scale', 'Metric Scales', 'Symbol Templates'],
    description: 'Metric triangular scale ruler set with circle and isometric drafting stencils.',
    image: 'https://images.unsplash.com/photo-1585336261026-6757f541a674?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Gayan Weerasinghe', email: 'gayan.w@gmail.com', phone: '+94 71 444 8899' },
    deposit: 500
  },
  {
    id: 'stn-10',
    category: 'stationary-items',
    title: 'Digital Vernier Caliper & Micrometer Measuring Kit',
    dailyPrice: 250,
    specs: ['0-150mm Range', '0.01mm Accuracy', 'Stainless Steel'],
    description: 'High precision electronic digital caliper for mechanical measurements and lab experiments.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kasun Perera', email: 'kasun.p@gmail.com', phone: '+94 77 123 4567' },
    deposit: 800
  },

  // 5. Cables (10 Items)
  {
    id: 'cbl-1',
    category: 'cables',
    title: 'Anker 10-in-1 USB-C Multiport Dongle Hub',
    dailyPrice: 300,
    specs: ['Dual 4K HDMI', '100W PD Pass-through', '1Gbps Ethernet', 'SD Reader'],
    description: 'Connect monitors, ethernet, flash drives, and power to any laptop with a single USB-C port.',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dileepa Jayasuriya', email: 'dileepa.j@gmail.com', phone: '+94 77 666 4433' },
    deposit: 800
  },
  {
    id: 'cbl-2',
    category: 'cables',
    title: 'Belkin Ultra High Speed 8K HDMI 2.1 Cable (3m)',
    dailyPrice: 200,
    specs: ['48Gbps Bandwidth', '8K@60Hz / 4K@120Hz', '3 Meters Long'],
    description: 'High performance HDMI cable for connecting laptops to projectors & monitors.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Lankanath Rodrigo', email: 'lankanath.r@gmail.com', phone: '+94 71 777 5511' },
    deposit: 500
  },
  {
    id: 'cbl-3',
    category: 'cables',
    title: 'Shielded Cat8 Heavy Duty Ethernet Cable (15m)',
    dailyPrice: 200,
    specs: ['40Gbps Speed', 'Snagless RJ45', 'Gold Plated', '15m Length'],
    description: 'Heavy-duty shielded RJ45 cable for zero-latency network connection during hackathons.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Roshen Cooray', email: 'roshen.c@gmail.com', phone: '+94 72 888 3322' },
    deposit: 500
  },
  {
    id: 'cbl-4',
    category: 'cables',
    title: 'DisplayPort 1.4 to HDMI 4K@120Hz Converter Cable',
    dailyPrice: 220,
    specs: ['DisplayPort to HDMI', '4K 120Hz Support', 'Aluminum Shell'],
    description: 'Connect desktop GPU DisplayPort output to HDMI monitors & TVs seamlessly.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Sahan Jayawardena', email: 'sahan.j@gmail.com', phone: '+94 78 999 0011' },
    deposit: 600
  },
  {
    id: 'cbl-5',
    category: 'cables',
    title: 'USB-C 100W Power Delivery Braided Cable (3m)',
    dailyPrice: 200,
    specs: ['100W Fast Charge', 'E-Marker Chip', '3m Length'],
    description: 'Heavy duty braided USB-C cable for high-power laptop charging.',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Charith Mendis', email: 'charith.m@gmail.com', phone: '+94 77 555 6677' },
    deposit: 500
  },
  {
    id: 'cbl-6',
    category: 'cables',
    title: 'VGA to HDMI Powered Signal Converter Cable',
    dailyPrice: 200,
    specs: ['VGA Input to HDMI Out', '1080p Resolution', 'Audio Jack'],
    description: 'Connect legacy VGA laptop outputs to modern HDMI projectors.',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dinuka Silva', email: 'dinuka.s@gmail.com', phone: '+94 71 987 6543' },
    deposit: 500
  },
  {
    id: 'cbl-7',
    category: 'cables',
    title: 'Apple Thunderbolt 4 Pro Braided Cable (2m)',
    dailyPrice: 350,
    specs: ['40Gbps Transfer', '100W Charging', 'DisplayPort Video'],
    description: 'Official Apple Thunderbolt 4 braided cable for ultra-fast SSD data transfers.',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kavindu Rathnayake', email: 'kavindu.r@gmail.com', phone: '+94 76 222 3344' },
    deposit: 1000
  },
  {
    id: 'cbl-8',
    category: 'cables',
    title: 'USB-C to Dual HDMI Splitter Adaptor (4K Extended)',
    dailyPrice: 280,
    specs: ['Dual HDMI 4K', 'MST Mode', 'Pass-Through Power'],
    description: 'Connect two 4K external monitors to a single USB-C laptop port.',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Chathura Bandara', email: 'chathura.b@gmail.com', phone: '+94 70 111 2233' },
    deposit: 800
  },
  {
    id: 'cbl-9',
    category: 'cables',
    title: 'High-Speed USB 3.0 Active Extension Cable (10m)',
    dailyPrice: 200,
    specs: ['10m Length', 'Built-in Signal Booster', 'USB 3.0 5Gbps'],
    description: 'Long distance USB extension cable with active chipset for cameras & sensors.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Malith Fernando', email: 'malith.f@gmail.com', phone: '+94 75 456 7890' },
    deposit: 500
  },
  {
    id: 'cbl-10',
    category: 'cables',
    title: 'Gigabit USB-C to RJ45 Ethernet Network Adaptor',
    dailyPrice: 220,
    specs: ['1000Mbps Speed', 'Aluminum Shell', 'Plug & Play'],
    description: 'Add a high-speed wired ethernet port to slim laptops without RJ45 ports.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Praveen Ranasinghe', email: 'praveen.r@gmail.com', phone: '+94 72 333 4455' },
    deposit: 600
  },

  // 6. Camping items (10 Items)
  {
    id: 'cmpg-1',
    category: 'camping-items',
    title: '4-Person Waterproof Outdoor Camping Tent',
    dailyPrice: 600,
    specs: ['4-Person Capacity', 'Waterproof PU3000', 'Double Layer', 'Easy Setup'],
    description: 'Spacious waterproof camping tent with rainfly cover for outdoor trips & hikes.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Akila Karunaratne', email: 'akila.k@gmail.com', phone: '+94 77 999 1234' },
    deposit: 1500
  },
  {
    id: 'cmpg-2',
    category: 'camping-items',
    title: '2-Person Instant Pop-Up Waterproof Dome Tent',
    dailyPrice: 400,
    specs: ['Pop-Up 60s Setup', '2-Person', 'UV Protection'],
    description: 'Quick setup instant dome tent perfect for weekend camping trips.',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Isuru Fonseka', email: 'isuru.f@gmail.com', phone: '+94 77 888 1122' },
    deposit: 1000
  },
  {
    id: 'cmpg-3',
    category: 'camping-items',
    title: 'Rechargeable LED Camping Lantern & Power Lamp',
    dailyPrice: 220,
    specs: ['1000 Lumens', 'USB Rechargeable', 'Power Bank Out', 'IPX4 Waterproof'],
    description: 'Ultra-bright lantern with dimmable light modes and USB phone charging capability.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Tharindu Gamage', email: 'tharindu.g@gmail.com', phone: '+94 71 222 4455' },
    deposit: 800
  },
  {
    id: 'cmpg-4',
    category: 'camping-items',
    title: 'Waterproof Outdoor Hiking Backpack (60L)',
    dailyPrice: 350,
    specs: ['60L Capacity', 'Ergonomic Support', 'Rain Cover Included'],
    description: 'Heavy duty hiking backpack with padded waist straps and hydration sleeve.',
    image: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Malith Fernando', email: 'malith.f@gmail.com', phone: '+94 75 456 7890' },
    deposit: 1000
  },
  {
    id: 'cmpg-5',
    category: 'camping-items',
    title: 'Thermal Insulated Outdoor Sleeping Bag (-5°C Rated)',
    dailyPrice: 250,
    specs: ['3-Season Warmth', 'Mummy Design', 'Lightweight Carry Bag'],
    description: 'Thermal insulated sleeping bag designed for cold mountain camping nights.',
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Nisala Wickramasinghe', email: 'nisala.w@gmail.com', phone: '+94 75 222 9900' },
    deposit: 800
  },
  {
    id: 'cmpg-6',
    category: 'camping-items',
    title: 'Foldable Outdoor Camping Chair with Cup Holder',
    dailyPrice: 200,
    specs: ['Steel Frame', '120kg Capacity', 'Compact Carry Bag'],
    description: 'Comfortable folding camp chair for outdoor relaxation and bonfires.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Kasun Perera', email: 'kasun.p@gmail.com', phone: '+94 77 123 4567' },
    deposit: 500
  },
  {
    id: 'cmpg-7',
    category: 'camping-items',
    title: 'Portable Gas Stove & Outdoor Cooking Cookset',
    dailyPrice: 300,
    specs: ['Piezo Ignition', 'Pots & Pans Included', 'Carry Case'],
    description: 'Compact camping gas burner with lightweight non-stick nesting pots.',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Dinuka Silva', email: 'dinuka.s@gmail.com', phone: '+94 71 987 6543' },
    deposit: 800
  },
  {
    id: 'cmpg-8',
    category: 'camping-items',
    title: 'Heavy-Duty Rechargeable Tactical LED Flashlight',
    dailyPrice: 200,
    specs: ['2000 Lumens', 'Zoomable Beam', 'IPX6 Waterproof'],
    description: 'Super bright handheld flashlight with long beam throw and strobe modes.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Shehan Alwis', email: 'shehan.a@gmail.com', phone: '+94 71 333 7788' },
    deposit: 500
  },
  {
    id: 'cmpg-9',
    category: 'camping-items',
    title: 'Inflatable Air Mattress Pad with Built-in Foot Pump',
    dailyPrice: 250,
    specs: ['Self-Inflating', 'Ergonomic Pillow', 'Tear Resistant'],
    description: 'Compact inflatable sleeping pad for tent comfort and insulation.',
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Chathura Bandara', email: 'chathura.b@gmail.com', phone: '+94 70 111 2233' },
    deposit: 700
  },
  {
    id: 'cmpg-10',
    category: 'camping-items',
    title: 'Waterproof Outdoor Trekking & Hiking Poles Set',
    dailyPrice: 200,
    specs: ['Aluminum 7075', 'Anti-Shock', 'Adjustable Height'],
    description: 'Lightweight telescoping hiking poles for mountain trail stability.',
    image: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=800&q=80',
    owner: { name: 'Sahan Jayawardena', email: 'sahan.j@gmail.com', phone: '+94 78 999 0011' },
    deposit: 500
  }
];

const Rentals = () => {
  const { category: categorySlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState(RENTAL_CATEGORIES);
  const [itemsList, setItemsList] = useState(RENTAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [daysMap, setDaysMap] = useState({});
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [toastMessage, setToastMessage] = useState('');

  // Dashboard state
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('my-requests'); // 'my-requests' | 'my-incoming'
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // New Listing Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('digital-devices');
  const [newPrice, setNewPrice] = useState('');
  const [newDeposit, setNewDeposit] = useState('');
  const [newImage, setNewImage] = useState('');
  const [specInput, setSpecInput] = useState('');
  const [specsList, setSpecsList] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  // Renter Information State
  const [renterName, setRenterName] = useState('Kasun Perera');
  const [renterEmail, setRenterEmail] = useState('kasun.p@gmail.com');
  const [renterPhone, setRenterPhone] = useState('+94 77 123 4567');

  // Fetch Categories & Items from Backend Database API on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await rentalsAPI.getCategories();
        if (catRes.data && catRes.data.data && catRes.data.data.length > 0) {
          // Map backend categories and attach icons
          const mappedCats = catRes.data.data.map(c => {
            const match = RENTAL_CATEGORIES.find(rc => rc.slug === c.slug);
            return { ...c, icon: match ? match.icon : <Cpu size={22} /> };
          });
          setCategoriesList(mappedCats);
        }
      } catch (err) {
        console.log('Using local category database fallback');
      }

      try {
        const itemsRes = await rentalsAPI.getItems();
        if (itemsRes.data && itemsRes.data.data && itemsRes.data.data.length > 0) {
          setItemsList(itemsRes.data.data);
        }
      } catch (err) {
        console.log('Using local equipment database fallback');
      }
    };

    fetchData();
  }, []);

  // Find active category if slug is present in route
  const activeCategory = categoriesList.find(c => c.slug === categorySlug);

  useEffect(() => {
    fetchItems();
  }, [categorySlug]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await rentalsAPI.getItems({
        category: activeCategory?.slug,
        search: searchQuery
      });
      setItems(res.data);
    } catch (error) {
      console.error('Failed to load rental items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  // Run search when searchQuery is cleared
  useEffect(() => {
    if (searchQuery === '') {
      fetchItems();
    }
  }, [searchQuery]);

  const fetchBookings = async () => {
    if (!user) return;
    setDashboardLoading(true);
    try {
      const [reqsRes, incRes] = await Promise.all([
        rentalsAPI.getMyRequests(),
        rentalsAPI.getMyIncoming()
      ]);
      setMyRequests(reqsRes.data);
      setIncomingRequests(incRes.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (showDashboard) {
      fetchBookings();
    }
  }, [showDashboard]);

  // Helper to format currency in Sri Lankan Rupees (Rs.)
  const formatRs = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-US')}`;
  };

  // Get selected days for item (default 1)
  const getSelectedDays = (itemId) => {
    return daysMap[itemId] || 1;
  };

  const handleDaysChange = (itemId, delta) => {
    const current = getSelectedDays(itemId);
    const updated = Math.max(1, Math.min(30, current + delta));
    setDaysMap(prev => ({ ...prev, [itemId]: updated }));
  };

  const handleDirectDaysInput = (itemId, val) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 30) {
      setDaysMap(prev => ({ ...prev, [itemId]: parsed }));
    } else if (val === '') {
      setDaysMap(prev => ({ ...prev, [itemId]: 1 }));
    }
  };

  const handleOpenModal = (item) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setActiveModalItem(item);
  };

  const handleCloseModal = () => {
    setActiveModalItem(null);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!activeModalItem) return;

    const days = getSelectedDays(activeModalItem._id || activeModalItem.id);
    const total = activeModalItem.dailyPrice * days;

    // Save Booking to Backend Database
    try {
      await rentalsAPI.createBooking({
        itemId: activeModalItem._id || activeModalItem.id,
        startDate,
        duration: days
      });

      setToastMessage(`Rental Request Sent! Booked "${activeModalItem.title}" for ${days} day(s) (${formatRs(total)}).`);
      setActiveModalItem(null);
      
      if (showDashboard) {
        fetchBookings();
      }

      setTimeout(() => {
        setToastMessage('');
      }, 4500);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit booking request');
    }
  };

// ===== Supun logic =====
const handleBookingStatusUpdate = async (bookingId, nextStatus) => {
  try {
    await rentalsAPI.updateStatus(bookingId, nextStatus);
    fetchBookings();
    setToastMessage(`Booking status updated to ${nextStatus}.`);
    setTimeout(() => setToastMessage(''), 3000);
  } catch (error) {
    alert('Failed to update status');
  }
};

const handleAddSpec = (e) => {
  e.preventDefault();
  if (specInput.trim() && !specsList.includes(specInput.trim())) {
    setSpecsList([...specsList, specInput.trim()]);
    setSpecInput('');
  }
};

const handleRemoveSpec = (specToRemove) => {
  setSpecsList(specsList.filter(s => s !== specToRemove));
};

const handleCreateRentalItem = async (e) => {
  e.preventDefault();
  if (!newTitle || !newDesc || !newPrice || !newImage || !newDeposit) {
    alert('Please fill in all required fields');
    return;
  }

  setFormSubmitting(true);
  try {
    await rentalsAPI.createItem({
      category: newCategory,
      title: newTitle,
      dailyPrice: Number(newPrice),
      specs: specsList,
      description: newDesc,
      image: newImage,
      deposit: Number(newDeposit)
    });

    setToastMessage(`Successfully listed "${newTitle}" for rent!`);
    setIsFormOpen(false);

    setNewTitle('');
    setNewDesc('');
    setNewCategory('digital-devices');
    setNewPrice('');
    setNewDeposit('');
    setNewImage('');
    setSpecsList([]);

    fetchItems();

    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to create rental item');
  } finally {
    setFormSubmitting(false);
  }
};

// ===== version1 logic (KEEP THIS instead of old filteredItems) =====
const filteredItems = itemsList.filter(item => {
  const matchesCategory = activeCategory
    ? item.category === activeCategory.slug
    : true;

  const q = searchQuery.trim().toLowerCase();

  const matchesSearch =
    q === '' ||
    item.title.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    (item.owner && item.owner.name && item.owner.name.toLowerCase().includes(q)) ||
    (item.specs && item.specs.some(s => s.toLowerCase().includes(q)));

  return matchesCategory && matchesSearch;
});

// ===== categories filter (merge properly) =====
const filteredCategories = categoriesList.filter(cat => {
  if (!searchQuery.trim()) return true;
  const q = searchQuery.toLowerCase();
  return cat.title.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
});

  return (
    <div className="rental-page-wrapper">
      <div className="rental-container">

        {/* Main Header Banner */}
        <div className="rental-header">
          <div className="rental-header-badge">
            <Sparkles size={14} />
            <span>Campus Verified Equipment Rentals</span>
          </div>

          <h1 className="rental-title">
            {activeCategory ? `${activeCategory.title} Rentals` : 'Equipment & Tool Rentals'}
          </h1>

          <p className="rental-subtitle">
            {activeCategory
              ? activeCategory.description
              : 'Browse verified equipment items across digital devices, computers, mobile accessories, stationary, cables, and camping gear.'}
          </p>

          {/* Real-Time Search Bar & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '650px', margin: '0 auto' }}>
            <form onSubmit={handleSearchSubmit} className="rental-search-form" style={{ width: '100%' }}>
              <Search size={20} color="#0066FF" />
              <input
                type="text"
                className="rental-search-input"
                placeholder={activeCategory ? `Search items in ${activeCategory.title}...` : "Search camera, laptop, projector, SSD, calculator..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 0.4rem' }}
                >
                  <X size={18} color="#09090B" />
                </button>
              )}
              <button type="submit" className="rental-search-btn">
                <span>Search</span>
              </button>
            </form>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {user ? (
                <>
                  <button
                    onClick={() => setShowDashboard(!showDashboard)}
                    className={`btn-manage-bookings ${showDashboard ? 'active' : ''}`}
                  >
                    <span>{showDashboard ? 'Close Bookings Board' : 'Manage My Rentals'}</span>
                  </button>

                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="btn-manage-bookings"
                    style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}
                  >
                    <span>List Item for Rent</span>
                  </button>
                </>
              ) : (
                <button onClick={() => navigate('/auth')} className="btn-manage-bookings">
                  <span>Log in to List / Rent Equipment</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Booking Dashboard Section */}
        {showDashboard && user && (
          <div className="booking-dashboard-panel">
            <div className="booking-dashboard-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>Rental Bookings Board</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Track sent requests and incoming rental offers</span>
              </div>

              <div className="booking-tab-group">
                <button
                  onClick={() => setDashboardTab('my-requests')}
                  className={`booking-tab-btn ${dashboardTab === 'my-requests' ? 'active' : ''}`}
                >
                  My Requests ({myRequests.length})
                </button>
                <button
                  onClick={() => setDashboardTab('my-incoming')}
                  className={`booking-tab-btn ${dashboardTab === 'my-incoming' ? 'active' : ''}`}
                >
                  Incoming Requests ({incomingRequests.length})
                </button>
              </div>
            </div>

            {dashboardLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading bookings data...</div>
            ) : (
              <div>
                {/* My Requests Tab */}
                {dashboardTab === 'my-requests' && (
                  <div>
                    {myRequests.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>You haven't requested any items yet.</p>
                    ) : (
                      <div className="booking-list">
                        {myRequests.map((b) => (
                          <div key={b.id} className="booking-card">
                            <div className="booking-item-details">
                              <img src={b.itemImage} alt={b.itemTitle} className="booking-item-img" />
                              <div>
                                <div className="booking-item-title">{b.itemTitle}</div>
                                <div className="booking-item-subtitle">
                                  <strong>Start Date:</strong> {b.startDate} | <strong>Duration:</strong> {b.duration} {b.duration === 1 ? 'day' : 'days'}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                  <strong>Owner:</strong> {b.providerName} | Email: {b.providerEmail}
                                </div>
                                
                                <div className="contact-actions">
                                  <a href={`tel:${b.providerPhone}`} className="contact-link contact-phone">
                                    <Phone size={11} /> Call: {b.providerPhone}
                                  </a>
                                  {b.providerPhone && (
                                    <a
                                      href={`https://wa.me/${b.providerPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.providerName)},%20I%20am%20contacting%20you%20regarding%20my%20rental%20request%20for%20"${encodeURIComponent(b.itemTitle)}"`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="contact-link contact-whatsapp"
                                    >
                                      WhatsApp
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                              <span className={`booking-status-badge status-${b.status}`}>{b.status}</span>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                                Total: {formatRs(b.totalPrice + b.itemDeposit)}
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                (Rent: {formatRs(b.totalPrice)} + Deposit: {formatRs(b.itemDeposit)})
                              </span>
                              {b.status === 'accepted' && (
                                <button
                                  onClick={() => handleBookingStatusUpdate(b.id, 'completed')}
                                  className="btn"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', background: '#0066FF', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginTop: '0.2rem' }}
                                >
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Incoming Requests Tab */}
                {dashboardTab === 'my-incoming' && (
                  <div>
                    {incomingRequests.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No incoming booking requests received.</p>
                    ) : (
                      <div className="booking-list">
                        {incomingRequests.map((b) => (
                          <div key={b.id} className="booking-card">
                            <div className="booking-item-details">
                              <img src={b.itemImage} alt={b.itemTitle} className="booking-item-img" />
                              <div>
                                <div className="booking-item-title">{b.itemTitle}</div>
                                <div className="booking-item-subtitle">
                                  <strong>Start Date:</strong> {b.startDate} | <strong>Duration:</strong> {b.duration} {b.duration === 1 ? 'day' : 'days'}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                  <strong>Requester:</strong> {b.requesterName} | Email: {b.requesterEmail}
                                </div>
                                
                                <div className="contact-actions">
                                  <a href={`tel:${b.requesterPhone}`} className="contact-link contact-phone">
                                    <Phone size={11} /> Call: {b.requesterPhone}
                                  </a>
                                  {b.requesterPhone && (
                                    <a
                                      href={`https://wa.me/${b.requesterPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.requesterName)},%20I%20am%20contacting%20you%20regarding%20your%20rental%20request%20for%20my%20"${encodeURIComponent(b.itemTitle)}"`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="contact-link contact-whatsapp"
                                    >
                                      WhatsApp
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                              <span className={`booking-status-badge status-${b.status}`}>{b.status}</span>
                              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center' }}>
                                Earn: {formatRs(b.totalPrice)}
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                (+ Deposit: {formatRs(b.itemDeposit)})
                              </span>

                              {b.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                                  <button
                                    onClick={() => handleBookingStatusUpdate(b.id, 'accepted')}
                                    className="btn btn-sm"
                                    style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.35rem 0.7rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleBookingStatusUpdate(b.id, 'rejected')}
                                    className="btn btn-sm"
                                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.35rem 0.7rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                                  >
                                    Decline
                                  </button>
                                </div>
                              )}
                              
                              {b.status === 'accepted' && (
                                <button
                                  onClick={() => handleBookingStatusUpdate(b.id, 'completed')}
                                  className="btn"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', background: '#0066FF', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginTop: '0.2rem' }}
                                >
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 1: Categories Grid View */}
        {!activeCategory ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#09090B', margin: 0 }}>
                Rental Categories ({filteredCategories.length})
              </h2>
              <span style={{ fontSize: '0.88rem', color: '#52525b', fontWeight: 600 }}>
                Click any category card to view items
              </span>
            </div>

            <div className="categories-grid">
              {filteredCategories.map(cat => (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => navigate(`/rentals/${cat.slug}`)}
                >
                  <div className="category-card-top-bar">
                    <h3 className="category-card-title" style={{ margin: 0 }}>{cat.title}</h3>
                  </div>

                  <div className="category-image-container">
                    <img src={cat.image} alt={cat.title} className="category-image" />
                  </div>

                  <p className="category-card-desc">{cat.description}</p>

                  <div className="category-card-footer">
                    <div className="category-starting-price">
                      From <span className="category-price-highlight">{formatRs(cat.startingPrice)}</span>/day
                    </div>
                    <div className="category-action-btn">
                      <span>Explore</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW 2: Category Items Grid View */
          <div>
            <div className="rental-back-bar">
              <button className="btn-back-categories" onClick={() => navigate('/rentals')}>
                <ArrowLeft size={18} />
                <span>All Categories</span>
              </button>

              <div className="category-active-header">
                <div className="category-header-icon">
                  {activeCategory.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#09090B', margin: 0 }}>{activeCategory.title}</h3>
                  <span style={{ fontSize: '0.82rem', color: '#52525b', fontWeight: 600 }}>
                    Showing {filteredItems.length} verified item(s)
                  </span>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#71717a' }}>
                Loading equipment list...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rental-empty-state">
                <h3 className="rental-empty-title">No rental items found in this category</h3>
                <p className="rental-empty-desc">Be the first to list an item in {activeCategory.title}!</p>
              </div>
            ) : (
              <div className="items-grid">
                {filteredItems.map(item => {
                  const days = getSelectedDays(item.id);
                  const totalPrice = item.dailyPrice * days;

                  return (
                    <div key={item.id} className="rental-item-card">
                      <div>
                        <div className="item-image-wrapper">
                          <img src={item.image} alt={item.title} className="item-image" />
                          <div className="item-verified-badge">
                            <ShieldCheck size={13} />
                            <span>Verified</span>
                          </div>
                        </div>

                        <div className="item-details">
                          <h3 className="item-title">{item.title}</h3>

                          <div className="item-specs-tags">
                            {item.specs.map((spec, idx) => (
                              <span key={idx} className="spec-chip">{spec}</span>
                            ))}
                          </div>

                          <p className="item-description">{item.description}</p>
                        </div>

                        <div className="item-owner-contact">
                          <div className="owner-contact-title">
                            <User size={14} color="#0066FF" />
                            <span>Listed By: {item.ownerName}</span>
                          </div>
                          <div className="owner-contact-row">
                            <Mail size={13} color="#0066FF" />
                            <span>{item.ownerEmail}</span>
                          </div>
                          <div className="owner-contact-row">
                            <Phone size={13} color="#0066FF" />
                            <span>{item.ownerPhone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="item-rent-box">
                          <div className="rent-days-row">
                            <span className="rent-days-label">Rental Days:</span>

                            <div className="rent-days-counter">
                              <button
                                type="button"
                                className="days-counter-btn"
                                onClick={() => handleDaysChange(item.id, -1)}
                              >
                                -
                              </button>

                              <input
                                type="number"
                                className="days-input-field"
                                value={days}
                                min="1"
                                max="30"
                                onChange={(e) => handleDirectDaysInput(item.id, e.target.value)}
                              />

                              <button
                                type="button"
                                className="days-counter-btn"
                                onClick={() => handleDaysChange(item.id, 1)}
                              >
                                +
                              </button>

                              <span className="days-unit-text">{days === 1 ? 'Day' : 'Days'}</span>
                            </div>
                          </div>

                          <div className="rent-calculation-row">
                            <div className="daily-rate-display">
                              Rate: <span className="daily-rate-price">{formatRs(item.dailyPrice)}</span> / day
                            </div>

                            <div className="total-calculated-price">
                              <span className="total-price-label">Total Amount</span>
                              <span className="total-price-value">{formatRs(totalPrice)}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="btn-rent-now"
                          onClick={() => handleOpenModal(item)}
                        >
                          <ShoppingBag size={18} />
                          <span>Rent Item ({formatRs(totalPrice)})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Rental Booking Modal */}
        {activeModalItem && (
          <div className="rental-modal-backdrop" onClick={handleCloseModal}>
            <div className="rental-modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={18} />
              </button>

              <h3 className="modal-header-title">Confirm Rental Reservation</h3>
              <p className="modal-header-subtitle">Review rental period and confirm your equipment request.</p>

              <div className="modal-item-summary">
                <img src={activeModalItem.image} alt={activeModalItem.title} className="modal-item-thumb" />
                <div className="modal-item-info">
                  <div className="modal-item-name">{activeModalItem.title}</div>
                  <div className="modal-item-price-rate">{formatRs(activeModalItem.dailyPrice)} per day</div>
                  <div style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '0.2rem' }}>
                    Owner: {activeModalItem.ownerName} ({activeModalItem.ownerPhone})
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking}>
                <div className="modal-form-group">
                  <label className="modal-form-label">Rental Start Date</label>
                  <input
                    type="date"
                    className="modal-form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-form-label">Selected Duration</label>
                  <input
                    type="text"
                    className="modal-form-input"
                    value={`${getSelectedDays(activeModalItem.id)} Day(s)`}
                    disabled
                  />
                </div>

                <div className="modal-bill-breakdown">
                  <div className="bill-line">
                    <span>Daily Rate:</span>
                    <span>{formatRs(activeModalItem.dailyPrice)} × {getSelectedDays(activeModalItem.id)} day(s)</span>
                  </div>
                  {activeModalItem.deposit > 0 && (
                    <div className="bill-line" style={{ color: '#71717a', fontSize: '0.85rem' }}>
                      <span>Refundable Security Deposit (held on pickup):</span>
                      <span>{formatRs(activeModalItem.deposit)}</span>
                    </div>
                  )}
                  <div className="bill-line total">
                    <span>Total Amount Payable:</span>
                    <span>{formatRs(activeModalItem.dailyPrice * getSelectedDays(activeModalItem.id))}</span>
                  </div>
                </div>

                <button type="submit" className="btn-confirm-rental">
                  Confirm & Request Equipment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* List Item For Rent Modal */}
        {isFormOpen && user && (
          <div className="rental-modal-backdrop" onClick={() => setIsFormOpen(false)}>
            <div className="rental-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
                <X size={18} />
              </button>

              <h3 className="modal-header-title">List Equipment for Rent</h3>
              <p className="modal-header-subtitle">Fill in details to share your tools with the campus.</p>

              <form onSubmit={handleCreateRentalItem}>
                <div className="rental-form-grid">
                  <div className="modal-form-group">
                    <label className="modal-form-label">Item Title</label>
                    <input
                      type="text"
                      className="rental-form-control"
                      placeholder="e.g. Sony a6400 Camera Kit"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-form-label">Category</label>
                    <select
                      className="rental-form-control"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      {RENTAL_CATEGORIES.map(c => (
                        <option key={c.id} value={c.slug}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-form-label">Daily Price (Rs.)</label>
                    <input
                      type="number"
                      className="rental-form-control"
                      placeholder="e.g. 1500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                      min="1"
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-form-label">Security Deposit (Rs.)</label>
                    <input
                      type="number"
                      className="rental-form-control"
                      placeholder="e.g. 5000"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(e.target.value)}
                      required
                      min="0"
                    />
                  </div>

                  <div className="modal-form-group-full" style={{ gridColumn: 'span 2' }}>
                    <label className="modal-form-label">Image URL</label>
                    <input
                      type="url"
                      className="rental-form-control"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-form-group-full" style={{ gridColumn: 'span 2' }}>
                    <label className="modal-form-label">Specs & Inclusions (Press Add)</label>
                    <div className="specs-input-container">
                      <input
                        type="text"
                        className="rental-form-control"
                        placeholder="e.g. 2x Batteries"
                        value={specInput}
                        onChange={(e) => setSpecInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleAddSpec}
                        style={{ padding: '0.5rem 1rem', background: '#0066FF', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                      >
                        Add
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                      {specsList.map((spec, idx) => (
                        <span key={idx} className="spec-tag">
                          {spec}
                          <button type="button" onClick={() => handleRemoveSpec(spec)}>&times;</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="modal-form-group-full" style={{ gridColumn: 'span 2' }}>
                    <label className="modal-form-label">Item Description</label>
                    <textarea
                      className="rental-form-control"
                      rows="3"
                      placeholder="Inclusions, condition details, pickup location..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-confirm-rental" style={{ marginTop: '1.5rem', background: '#10b981' }} disabled={formSubmitting}>
                  {formSubmitting ? 'Listing Item...' : 'List Item for Rent'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="rental-toast-notification">
            <CheckCircle2 size={22} color="#0066FF" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default Rentals;
