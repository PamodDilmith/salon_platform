// Mock data store for offline/fallback mode

const initialCategories = [
  { _id: 'c1', name: 'Haircut', type: 'service', description: 'Hair shaping and trimming' },
  { _id: 'c2', name: 'Nail Art', type: 'service', description: 'Acrylics, gel manicures and art' },
  { _id: 'c3', name: 'Facial & Skincare', type: 'service', description: 'Skin rejuvenation therapies' },
  { _id: 'c4', name: 'Bridal Makeup', type: 'service', description: 'Professional wedding styling' },
  { _id: 'c5', name: 'Colombo', type: 'location', description: 'Capital city hub' },
  { _id: 'c6', name: 'Kandy', type: 'location', description: 'Hill country area' },
  { _id: 'c7', name: 'Galle', type: 'location', description: 'Southern coastal region' },
];

const initialSalons = [
  {
    _id: 's1',
    name: 'Glamour Haven Salon',
    description: 'Ultra modern luxury beauty lounge for ladies and gents.',
    address: '45 Orchard Lane, Colombo 03',
    location: 'Colombo',
    phoneNumber: '111-222-3333',
    categories: ['Haircut', 'Nail Art', 'Facial & Skincare'],
    status: 'approved',
    subscriptionStatus: 'active',
    owner: { name: 'Elena Rostova', email: 'elena@glamour.com' },
    createdAt: '2026-05-20T10:00:00.000Z'
  },
  {
    _id: 's2',
    name: 'Marco Gentleman Barber',
    description: 'Classic grooming and shaving lounge for modern men.',
    address: '12 Temple Road, Kandy',
    location: 'Kandy',
    phoneNumber: '222-333-4444',
    categories: ['Haircut'],
    status: 'pending',
    subscriptionStatus: 'active',
    owner: { name: 'Marco Pierre', email: 'marco@barber.com' },
    createdAt: '2026-05-22T14:30:00.000Z'
  }
];

const initialBeauticians = [
  {
    _id: 'b1',
    name: 'Chloe Makeup Artistry',
    description: 'Certified freelance makeup artist specializing in bridal and fashion.',
    specialties: ['Bridal Makeup', 'Facial & Skincare'],
    experienceYears: 6,
    location: 'Colombo',
    phoneNumber: '444-555-6666',
    certificationUrl: 'https://example.com/certs/chloe.pdf',
    status: 'approved',
    subscriptionStatus: 'unpaid',
    user: { name: 'Chloe Frazer', email: 'chloe@makeup.com' },
    createdAt: '2026-05-21T08:15:00.000Z'
  },
  {
    _id: 'b2',
    name: 'David Miller Hair Styles',
    description: 'Expert hair stylist and coloring consultant.',
    specialties: ['Haircut'],
    experienceYears: 10,
    location: 'Galle',
    phoneNumber: '777-888-9999',
    certificationUrl: 'https://example.com/certs/david.pdf',
    status: 'pending',
    subscriptionStatus: 'active',
    user: { name: 'David Miller', email: 'david@style.com' },
    createdAt: '2026-05-23T09:00:00.000Z'
  }
];

const initialSubscriptions = [
  {
    _id: 'sub1',
    vendorId: 's1',
    vendorName: 'Glamour Haven Salon',
    vendorType: 'salon',
    planName: 'Premium',
    price: 49.99,
    status: 'active',
    owner: { name: 'Elena Rostova', email: 'elena@glamour.com' },
    startDate: '2026-05-01T00:00:00.000Z',
    endDate: '2026-05-31T23:59:59.000Z'
  },
  {
    _id: 'sub2',
    vendorId: 'b1',
    vendorName: 'Chloe Makeup Artistry',
    vendorType: 'beautician',
    planName: 'Basic',
    price: 19.99,
    status: 'unpaid',
    owner: { name: 'Chloe Frazer', email: 'chloe@makeup.com' },
    startDate: '2026-04-20T00:00:00.000Z',
    endDate: '2026-05-20T23:59:59.000Z' // Expired
  }
];

const initialReviews = [
  {
    _id: 'r1',
    userName: 'Sarah Connor',
    vendorName: 'Glamour Haven Salon',
    vendorType: 'salon',
    rating: 5,
    comment: 'Absolutely amazing experience at Glamour Haven. Highly professional staff and great service!',
    createdAt: '2026-05-20T11:20:00.000Z'
  },
  {
    _id: 'r2',
    userName: 'John Doe',
    vendorName: 'Glamour Haven Salon',
    vendorType: 'salon',
    rating: 2,
    comment: 'The waiting time was way too long, though the haircut itself was decent.',
    createdAt: '2026-05-21T15:40:00.000Z'
  },
  {
    _id: 'r3',
    userName: 'Sarah Connor',
    vendorName: 'Chloe Makeup Artistry',
    vendorType: 'beautician',
    rating: 4,
    comment: 'Chloe did a fantastic job with my party makeup. Will book again.',
    createdAt: '2026-05-22T18:10:00.000Z'
  }
];

const initialTickets = [
  {
    _id: 't1',
    user: { name: 'John Doe', email: 'john@example.com', role: 'customer' },
    subject: 'Double charged for booking',
    description: 'I was charged twice on my credit card for my booking at Glamour Haven Salon on May 20th. Please refund one transaction.',
    priority: 'high',
    status: 'open',
    messages: [
      {
        senderName: 'John Doe',
        senderRole: 'customer',
        message: 'I was charged twice on my credit card. Here are transaction IDs: TXN12345 and TXN12346.',
        timestamp: '2026-05-20T12:00:00.000Z'
      }
    ],
    createdAt: '2026-05-20T12:00:00.000Z'
  },
  {
    _id: 't2',
    user: { name: 'Elena Rostova', email: 'elena@glamour.com', role: 'salon_owner' },
    subject: 'Inquiry about Premium Subscription plan details',
    description: 'Does the Premium Plan include SMS reminder features for customers? Let me know.',
    priority: 'low',
    status: 'in_progress',
    messages: [
      {
        senderName: 'Elena Rostova',
        senderRole: 'salon_owner',
        message: 'Does the Premium Plan include SMS reminder features for customers? Let me know.',
        timestamp: '2026-05-21T09:00:00.000Z'
      },
      {
        senderName: 'System Admin',
        senderRole: 'admin',
        message: 'Hello Elena, yes it does! Premium package includes up to 500 automated SMS reminders per month.',
        timestamp: '2026-05-21T10:15:00.000Z'
      }
    ],
    createdAt: '2026-05-21T09:00:00.000Z'
  }
];

// Initialize localStorage
const initDB = () => {
  if (!localStorage.getItem('ag_categories')) {
    localStorage.setItem('ag_categories', JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem('ag_salons')) {
    localStorage.setItem('ag_salons', JSON.stringify(initialSalons));
  }
  if (!localStorage.getItem('ag_beauticians')) {
    localStorage.setItem('ag_beauticians', JSON.stringify(initialBeauticians));
  }
  if (!localStorage.getItem('ag_subscriptions')) {
    localStorage.setItem('ag_subscriptions', JSON.stringify(initialSubscriptions));
  }
  if (!localStorage.getItem('ag_reviews')) {
    localStorage.setItem('ag_reviews', JSON.stringify(initialReviews));
  }
  if (!localStorage.getItem('ag_tickets')) {
    localStorage.setItem('ag_tickets', JSON.stringify(initialTickets));
  }
};

initDB();

const getFromStore = (key) => JSON.parse(localStorage.getItem(key));
const saveToStore = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const mockApi = {
  login: async (email, password) => {
    if (email === 'admin@salon.com' && password === 'admin123') {
      return {
        _id: 'admin_1',
        name: 'System Admin (Mock)',
        email: 'admin@salon.com',
        role: 'admin',
        token: 'mock-jwt-token-xyz'
      };
    }
    throw new Error('Invalid admin credentials');
  },

  getStats: async () => {
    const categories = getFromStore('ag_categories');
    const salons = getFromStore('ag_salons');
    const beauticians = getFromStore('ag_beauticians');
    const subscriptions = getFromStore('ag_subscriptions');
    const tickets = getFromStore('ag_tickets');
    const reviews = getFromStore('ag_reviews');

    const totalUsers = 4; // Mock general customer base
    const totalSalons = salons.length;
    const totalBeauticians = beauticians.length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
    const openTickets = tickets.filter(t => t.status !== 'resolved').length;
    const totalReviews = reviews.length;

    const pendingSalons = salons.filter(s => s.status === 'pending').length;
    const pendingBeauticians = beauticians.filter(b => b.status === 'pending').length;

    return {
      metrics: {
        totalUsers,
        totalSalons,
        totalBeauticians,
        activeSubscriptions,
        openTickets,
        totalReviews,
      },
      pendingRequests: pendingSalons + pendingBeauticians,
    };
  },

  getRegistrations: async () => {
    const salons = getFromStore('ag_salons').filter(s => s.status === 'pending');
    const beauticians = getFromStore('ag_beauticians').filter(b => b.status === 'pending');
    return { salons, beauticians };
  },

  updateRegistration: async (type, id, status, rejectionReason) => {
    const storeKey = type === 'salon' ? 'ag_salons' : 'ag_beauticians';
    const list = getFromStore(storeKey);
    const index = list.findIndex(item => item._id === id);
    if (index !== -1) {
      list[index].status = status;
      if (status === 'rejected') {
        list[index].rejectionReason = rejectionReason || '';
      }
      saveToStore(storeKey, list);
      return list[index];
    }
    throw new Error('Profile not found');
  },

  getCategories: async () => {
    return getFromStore('ag_categories');
  },

  createCategory: async (category) => {
    const list = getFromStore('ag_categories');
    const newCat = {
      _id: 'c_' + Date.now(),
      ...category
    };
    list.push(newCat);
    saveToStore('ag_categories', list);
    return newCat;
  },

  updateCategory: async (id, updatedFields) => {
    const list = getFromStore('ag_categories');
    const index = list.findIndex(c => c._id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      saveToStore('ag_categories', list);
      return list[index];
    }
    throw new Error('Category not found');
  },

  deleteCategory: async (id) => {
    const list = getFromStore('ag_categories');
    const filtered = list.filter(c => c._id !== id);
    saveToStore('ag_categories', filtered);
    return { message: 'Category removed' };
  },

  getSubscriptions: async () => {
    return getFromStore('ag_subscriptions');
  },

  suspendVendor: async (type, id) => {
    // Suspend profile
    const storeKey = type === 'salon' ? 'ag_salons' : 'ag_beauticians';
    const vendors = getFromStore(storeKey);
    const vendorIndex = vendors.findIndex(v => v._id === id);
    if (vendorIndex !== -1) {
      vendors[vendorIndex].subscriptionStatus = 'suspended';
      saveToStore(storeKey, vendors);
    }

    // Suspend subscriptions
    const subs = getFromStore('ag_subscriptions');
    const updatedSubs = subs.map(sub => {
      if (sub.vendorId === id) {
        return { ...sub, status: 'suspended' };
      }
      return sub;
    });
    saveToStore('ag_subscriptions', updatedSubs);
    return { message: 'Profile suspended' };
  },

  getTickets: async () => {
    return getFromStore('ag_tickets');
  },

  getTicketById: async (id) => {
    const tickets = getFromStore('ag_tickets');
    const ticket = tickets.find(t => t._id === id);
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  },

  replyToTicket: async (id, message, adminName) => {
    const tickets = getFromStore('ag_tickets');
    const index = tickets.findIndex(t => t._id === id);
    if (index !== -1) {
      const newMsg = {
        senderName: adminName || 'System Admin',
        senderRole: 'admin',
        message: message,
        timestamp: new Date().toISOString()
      };
      tickets[index].messages.push(newMsg);
      if (tickets[index].status === 'open') {
        tickets[index].status = 'in_progress';
      }
      saveToStore('ag_tickets', tickets);
      return tickets[index];
    }
    throw new Error('Ticket not found');
  },

  updateTicketStatus: async (id, status) => {
    const tickets = getFromStore('ag_tickets');
    const index = tickets.findIndex(t => t._id === id);
    if (index !== -1) {
      tickets[index].status = status;
      saveToStore('ag_tickets', tickets);
      return tickets[index];
    }
    throw new Error('Ticket not found');
  },

  getReviews: async () => {
    return getFromStore('ag_reviews');
  },

  deleteReview: async (id) => {
    const reviews = getFromStore('ag_reviews');
    const filtered = reviews.filter(r => r._id !== id);
    saveToStore('ag_reviews', filtered);
    return { message: 'Review removed' };
  }
};
