const { sequelize } = require('../config/database');
const { User, Product, Order, OrderItem, Review } = require('../models');
const bcrypt = require('bcryptjs');

// Sample users data
const users = [
  {
    username: 'admin',
    email: 'admin@sneakerhead.com',
    password: 'admin123',
    fullName: 'Admin User',
    address: 'Admin Street, City',
    phone: '9876543210',
    role: 'admin'
  },
  {
    username: 'john',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe',
    address: '123 Main St, City',
    phone: '1234567890',
    role: 'user'
  },
  {
    username: 'jane',
    email: 'jane@example.com',
    password: 'password123',
    fullName: 'Jane Smith',
    address: '456 Oak St, Town',
    phone: '0987654321',
    role: 'user'
  }
];

// Sample products data
const products = [
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it nods to the original 1991 Air Max 180 with its exaggerated tongue top and heritage tongue logo.',
    price: 150.00,
    discountPrice: 129.99,
    imageUrl: '/images/products/nike-air-max-270.jpg',
    brand: 'Nike',
    category: 'Running',
    countInStock: 25,
    rating: 4.5,
    numReviews: 12,
    isFeatured: true,
    isNew: false,
    sizes: JSON.stringify(['7', '8', '9', '10', '11']),
    colors: JSON.stringify(['Black', 'White', 'Red'])
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'The Adidas Ultraboost 22 is designed to give you the ultimate energized running experience. The responsive Boost midsole and supportive Primeknit upper work together for a smooth and comfortable ride.',
    price: 180.00,
    discountPrice: 159.99,
    imageUrl: '/images/products/adidas-ultraboost-22.jpg',
    brand: 'Adidas',
    category: 'Running',
    countInStock: 15,
    rating: 4.8,
    numReviews: 24,
    isFeatured: true,
    isNew: true,
    sizes: JSON.stringify(['7', '8', '9', '10', '11', '12']),
    colors: JSON.stringify(['Black', 'White', 'Blue'])
  },
  {
    name: 'Jordan 1 Retro High',
    description: 'The Air Jordan 1 Retro High is the shoe that started it all. This iconic silhouette features premium materials, classic colorways, and the legendary Wings logo.',
    price: 170.00,
    discountPrice: null,
    imageUrl: '/images/products/jordan-1-retro-high.jpg',
    brand: 'Jordan',
    category: 'Basketball',
    countInStock: 10,
    rating: 4.9,
    numReviews: 36,
    isFeatured: true,
    isNew: false,
    sizes: JSON.stringify(['7', '8', '9', '10', '11', '12']),
    colors: JSON.stringify(['Red/Black', 'Blue/White', 'Black/White'])
  },
  {
    name: 'Puma RS-X',
    description: 'The Puma RS-X is a bold, chunky sneaker that reimagines Puma\'s 80s Running System (RS) line with exaggerated design elements and eye-catching colorways.',
    price: 110.00,
    discountPrice: 89.99,
    imageUrl: '/images/products/puma-rs-x.jpg',
    brand: 'Puma',
    category: 'Casual',
    countInStock: 20,
    rating: 4.2,
    numReviews: 18,
    isFeatured: false,
    isNew: true,
    sizes: JSON.stringify(['7', '8', '9', '10', '11']),
    colors: JSON.stringify(['White/Blue', 'Black/Yellow', 'Gray/Red'])
  },
  {
    name: 'New Balance 990v5',
    description: 'The New Balance 990v5 continues the legacy of the iconic 990 series. Made in the USA, it features premium suede and mesh construction with ENCAP midsole technology for superior comfort.',
    price: 185.00,
    discountPrice: null,
    imageUrl: '/images/products/new-balance-990v5.jpg',
    brand: 'New Balance',
    category: 'Running',
    countInStock: 8,
    rating: 4.7,
    numReviews: 15,
    isFeatured: false,
    isNew: false,
    sizes: JSON.stringify(['7', '8', '9', '10', '11', '12', '13']),
    colors: JSON.stringify(['Gray', 'Navy', 'Black'])
  },
  {
    name: 'Vans Old Skool',
    description: 'The Vans Old Skool is a classic skate shoe and the brand\'s first model to feature the iconic side stripe. Known for its durability and timeless style.',
    price: 70.00,
    discountPrice: 59.99,
    imageUrl: '/images/products/vans-old-skool.jpg',
    brand: 'Vans',
    category: 'Skate',
    countInStock: 30,
    rating: 4.5,
    numReviews: 42,
    isFeatured: false,
    isNew: false,
    sizes: JSON.stringify(['6', '7', '8', '9', '10', '11', '12']),
    colors: JSON.stringify(['Black/White', 'Navy/White', 'Red/White'])
  },
  {
    name: 'Converse Chuck Taylor All Star',
    description: 'The Converse Chuck Taylor All Star is an American icon with its unmistakable silhouette and star ankle patch. A versatile canvas sneaker that\'s been worn by everyone from basketball players to rock stars.',
    price: 60.00,
    discountPrice: 49.99,
    imageUrl: '/images/products/converse-chuck-taylor.jpg',
    brand: 'Converse',
    category: 'Casual',
    countInStock: 35,
    rating: 4.6,
    numReviews: 50,
    isFeatured: false,
    isNew: false,
    sizes: JSON.stringify(['5', '6', '7', '8', '9', '10', '11', '12']),
    colors: JSON.stringify(['Black', 'White', 'Red', 'Navy'])
  },
  {
    name: 'Reebok Club C 85',
    description: 'The Reebok Club C 85 is a tennis classic turned lifestyle staple. Its clean design features soft leather uppers, a padded foam sockliner, and a rubber cupsole.',
    price: 80.00,
    discountPrice: 69.99,
    imageUrl: '/images/products/reebok-club-c-85.jpg',
    brand: 'Reebok',
    category: 'Casual',
    countInStock: 18,
    rating: 4.3,
    numReviews: 22,
    isFeatured: false,
    isNew: true,
    sizes: JSON.stringify(['7', '8', '9', '10', '11']),
    colors: JSON.stringify(['White/Green', 'White/Navy', 'White/Red'])
  },
  {
    name: 'Asics Gel-Kayano 28',
    description: 'The Asics Gel-Kayano 28 is designed for stability and comfort during long-distance runs. Features GEL technology cushioning and Dynamic DuoMax Support System.',
    price: 160.00,
    discountPrice: 139.99,
    imageUrl: '/images/products/asics-gel-kayano-28.jpg',
    brand: 'Asics',
    category: 'Running',
    countInStock: 12,
    rating: 4.7,
    numReviews: 19,
    isFeatured: false,
    isNew: false,
    sizes: JSON.stringify(['7', '8', '9', '10', '11', '12']),
    colors: JSON.stringify(['Black/Blue', 'Gray/Yellow', 'Blue/Orange'])
  },
  {
    name: 'Under Armour Curry 9',
    description: 'The Under Armour Curry 9 is designed for speed and precision on the basketball court. Features UA Flow technology for better court feel and traction.',
    price: 160.00,
    discountPrice: null,
    imageUrl: '/images/products/under-armour-curry-9.jpg',
    brand: 'Under Armour',
    category: 'Basketball',
    countInStock: 10,
    rating: 4.6,
    numReviews: 14,
    isFeatured: true,
    isNew: true,
    sizes: JSON.stringify(['7', '8', '9', '10', '11', '12', '13']),
    colors: JSON.stringify(['Blue/Yellow', 'Black/White', 'White/Black'])
  }
];

// Sample reviews data (to be created after users and products)
const createReviews = async (users, products) => {
  const reviews = [
    {
      userId: users[1].id, // John
      productId: products[0].id, // Nike Air Max 270
      rating: 5,
      comment: 'Great shoes! Very comfortable for all-day wear.'
    },
    {
      userId: users[2].id, // Jane
      productId: products[0].id, // Nike Air Max 270
      rating: 4,
      comment: 'Good quality but runs a bit small.'
    },
    {
      userId: users[1].id, // John
      productId: products[1].id, // Adidas Ultraboost 22
      rating: 5,
      comment: 'Best running shoes I\'ve ever owned. Great energy return!'
    },
    {
      userId: users[2].id, // Jane
      productId: products[2].id, // Jordan 1 Retro High
      rating: 5,
      comment: 'Classic design, premium materials. Worth every penny!'
    }
  ];

  for (const review of reviews) {
    await Review.create(review);
  }

  console.log('Sample reviews created!');
};

// Sample orders data (to be created after users and products)
const createOrders = async (users, products) => {
  // Order for John
  const johnOrder = await Order.create({
    userId: users[1].id,
    totalAmount: 309.98, // Two products
    shippingAddress: '123 Main St',
    shippingCity: 'City',
    shippingPostalCode: '12345',
    shippingCountry: 'Country',
    paymentMethod: 'eSewa',
    paymentStatus: 'completed',
    orderStatus: 'delivered',
    paymentId: 'ESEWA12345',
    deliveredAt: new Date()
  });

  // Order items for John
  await OrderItem.create({
    orderId: johnOrder.id,
    productId: products[0].id, // Nike Air Max 270
    quantity: 1,
    price: 129.99,
    size: '9',
    color: 'Black'
  });

  await OrderItem.create({
    orderId: johnOrder.id,
    productId: products[5].id, // Vans Old Skool
    quantity: 3,
    price: 59.99,
    size: '8',
    color: 'Black/White'
  });

  // Order for Jane
  const janeOrder = await Order.create({
    userId: users[2].id,
    totalAmount: 159.99, // One product
    shippingAddress: '456 Oak St',
    shippingCity: 'Town',
    shippingPostalCode: '67890',
    shippingCountry: 'Country',
    paymentMethod: 'eSewa',
    paymentStatus: 'pending',
    orderStatus: 'processing'
  });

  // Order item for Jane
  await OrderItem.create({
    orderId: janeOrder.id,
    productId: products[1].id, // Adidas Ultraboost 22
    quantity: 1,
    price: 159.99,
    size: '7',
    color: 'White'
  });

  console.log('Sample orders created!');
};

// Main seeder function
const seedDatabase = async () => {
  try {
    // Sync database (force: true will drop tables if they exist)
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const createdUser = await User.create({
        ...user,
        password: hashedPassword
      });
      
      createdUsers.push(createdUser);
    }
    console.log('Sample users created!');

    // Create products
    const createdProducts = [];
    for (const product of products) {
      const createdProduct = await Product.create(product);
      createdProducts.push(createdProduct);
    }
    console.log('Sample products created!');

    // Create reviews and orders
    await createReviews(createdUsers, createdProducts);
    await createOrders(createdUsers, createdProducts);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
