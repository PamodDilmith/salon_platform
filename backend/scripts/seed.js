require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Salon = require('../models/salon');
const Beautician = require('../models/beautician');
const Category = require('../models/category');
const SupportTicket = require('../models/supportTicket');
const Subscription = require('../models/subscription');
const Review = require('../models/review');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Salon.deleteMany();
    await Beautician.deleteMany();
    await Category.deleteMany();
    await SupportTicket.deleteMany();
    await Subscription.deleteMany();
    await Review.deleteMany();
    console.log('Cleared existing database entries.');

    // 1. Create Users
    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@salon.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      phoneNumber: '123-456-7890',
    });

    const customer1 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'customer123',
      role: 'customer',
      phoneNumber: '987-654-3210',
    });

    const customer2 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'customer123',
      role: 'customer',
      phoneNumber: '555-555-5555',
    });

    const salonOwner1 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@glamour.com',
      password: 'vendor123',
      role: 'salon_owner',
      phoneNumber: '111-222-3333',
    });

    const salonOwner2 = await User.create({
      name: 'Marco Pierre',
      email: 'marco@barber.com',
      password: 'vendor123',
      role: 'salon_owner',
      phoneNumber: '222-333-4444',
    });

    const beauticianUser1 = await User.create({
      name: 'Chloe Frazer',
      email: 'chloe@makeup.com',
      password: 'vendor123',
      role: 'beautician',
      phoneNumber: '444-555-6666',
    });

    const beauticianUser2 = await User.create({
      name: 'David Miller',
      email: 'david@style.com',
      password: 'vendor123',
      role: 'beautician',
      phoneNumber: '777-888-9999',
    });

    console.log('Seeding Categories & Locations...');
    // 2. Create Categories & Locations
    const categories = await Category.insertMany([
      { name: 'Haircut', type: 'service', description: 'Hair shaping and trimming' },
      { name: 'Nail Art', type: 'service', description: 'Acrylics, gel manicures and art' },
      { name: 'Facial & Skincare', type: 'service', description: 'Skin rejuvenation therapies' },
      { name: 'Bridal Makeup', type: 'service', description: 'Professional wedding styling' },
      { name: 'Colombo', type: 'location', description: 'Capital city hub' },
      { name: 'Kandy', type: 'location', description: 'Hill country area' },
      { name: 'Galle', type: 'location', description: 'Southern coastal region' },
    ]);

    console.log('Seeding Salons...');
    // 3. Create Salons (Approved, Pending, Suspended)
    const salon1 = await Salon.create({
      owner: salonOwner1._id,
      name: 'Glamour Haven Salon',
      description: 'Ultra modern luxury beauty lounge for ladies and gents.',
      address: '45 Orchard Lane, Colombo 03',
      location: 'Colombo',
      phoneNumber: '111-222-3333',
      categories: ['Haircut', 'Nail Art', 'Facial & Skincare'],
      status: 'approved',
      subscriptionStatus: 'active',
    });

    const salon2 = await Salon.create({
      owner: salonOwner2._id,
      name: 'Marco Gentleman Barber',
      description: 'Classic grooming and shaving lounge for modern men.',
      address: '12 Temple Road, Kandy',
      location: 'Kandy',
      phoneNumber: '222-333-4444',
      categories: ['Haircut'],
      status: 'pending',
      subscriptionStatus: 'active',
    });

    console.log('Seeding Beauticians...');
    // 4. Create Beauticians
    const beautician1 = await Beautician.create({
      user: beauticianUser1._id,
      name: 'Chloe Makeup Artistry',
      description: 'Certified freelance makeup artist specializing in bridal and fashion.',
      specialties: ['Bridal Makeup', 'Facial & Skincare'],
      experienceYears: 6,
      location: 'Colombo',
      phoneNumber: '444-555-6666',
      certificationUrl: 'https://example.com/certs/chloe.pdf',
      status: 'approved',
      subscriptionStatus: 'unpaid', // unpaid to test warning/suspension
    });

    const beautician2 = await Beautician.create({
      user: beauticianUser2._id,
      name: 'David Miller Hair Styles',
      description: 'Expert hair stylist and coloring consultant.',
      specialties: ['Haircut'],
      experienceYears: 10,
      location: 'Galle',
      phoneNumber: '777-888-9999',
      certificationUrl: 'https://example.com/certs/david.pdf',
      status: 'pending',
      subscriptionStatus: 'active',
    });

    console.log('Seeding Subscriptions...');
    // 5. Create Subscriptions
    const sub1 = await Subscription.create({
      owner: salonOwner1._id,
      vendorType: 'salon',
      vendorId: salon1._id,
      vendorName: salon1.name,
      planName: 'Premium',
      price: 49.99,
      status: 'active',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });

    const sub2 = await Subscription.create({
      owner: beauticianUser1._id,
      vendorType: 'beautician',
      vendorId: beautician1._id,
      vendorName: beautician1.name,
      planName: 'Basic',
      price: 19.99,
      status: 'unpaid', // unpaid
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Expired 2 days ago
    });

    console.log('Seeding Reviews...');
    // 6. Create Reviews
    await Review.create({
      user: customer1._id,
      userName: customer1.name,
      vendorType: 'salon',
      vendorId: salon1._id,
      vendorName: salon1.name,
      rating: 5,
      comment: 'Absolutely amazing experience at Glamour Haven. Highly professional staff and great service!',
    });

    await Review.create({
      user: customer2._id,
      userName: customer2.name,
      vendorType: 'salon',
      vendorId: salon1._id,
      vendorName: salon1.name,
      rating: 2,
      comment: 'The waiting time was way too long, though the haircut itself was decent.',
    });

    await Review.create({
      user: customer1._id,
      userName: customer1.name,
      vendorType: 'beautician',
      vendorId: beautician1._id,
      vendorName: beautician1.name,
      rating: 4,
      comment: 'Chloe did a fantastic job with my party makeup. Will book again.',
    });

    console.log('Seeding Support Tickets...');
    // 7. Create Support Tickets
    const ticket1 = await SupportTicket.create({
      user: customer2._id,
      subject: 'Double charged for booking',
      description: 'I was charged twice on my credit card for my booking at Glamour Haven Salon on May 20th. Please refund one transaction.',
      priority: 'high',
      status: 'open',
      messages: [
        {
          sender: customer2._id,
          senderRole: 'customer',
          message: 'I was charged twice on my credit card. Here are transaction IDs: TXN12345 and TXN12346.',
        },
      ],
    });

    const ticket2 = await SupportTicket.create({
      user: salonOwner1._id,
      subject: 'Inquiry about Premium Subscription plan details',
      description: 'Does the Premium Plan include SMS reminder features for customers? Let me know.',
      priority: 'low',
      status: 'in_progress',
      messages: [
        {
          sender: salonOwner1._id,
          senderRole: 'salon_owner',
          message: 'Does the Premium Plan include SMS reminder features for customers? Let me know.',
        },
        {
          sender: adminUser._id,
          senderRole: 'admin',
          message: 'Hello Elena, yes it does! Premium package includes up to 500 automated SMS reminders per month.',
        },
      ],
    });

    console.log('Database seeded successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
