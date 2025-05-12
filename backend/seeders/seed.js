require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User, Product, Review } = require('../models');

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synchronized. All tables dropped and recreated.');

    // Create admin user - let the model hooks handle the password hashing
    const admin = await User.create({
      username: 'admin',
      email: 'admin@sneakerhead.com',
      password: 'admin123', // Model hooks will hash this
      fullName: 'Admin User',
      role: 'admin'
    });
    console.log('Admin user created:', admin.username);

    // Create regular user - let the model hooks handle the password hashing
    const user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'user123', // Model hooks will hash this
      fullName: 'Regular User',
      address: '123 Main St, Kathmandu',
      phone: '9876543210',
      role: 'user'
    });
    console.log('Regular user created:', user.username);

    // Create sample products
    const products = [
      {
        name: 'Nike Air Max 270',
        description: 'The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it nods to the original 1991 Air Max 180 with its exaggerated tongue top and heritage tongue logo. The Nike Air Max 270 is a lifestyle shoe that delivers a fresh combination of heritage and innovation.',
        price: 150.00,
        discountPrice: 129.99,
        imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-shoes-V4DfZQ.png',
        brand: 'Nike',
        category: 'Running',
        countInStock: 25,
        rating: 4.5,
        numReviews: 12,
        isFeatured: true,
        isNew: true,
        sizes: JSON.stringify(['7', '8', '9', '10', '11']),
        colors: JSON.stringify(['Black', 'White', 'Red'])
      },
      {
        name: 'Adidas Ultraboost 21',
        description: 'Ultraboost 21. Feel the future of running with these high-performance neutral running shoes. The Adidas Ultraboost 21 is designed to give you incredible energy return with each step.',
        price: 180.00,
        discountPrice: null,
        imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
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
        description: "The Air Jordan 1 Retro High is the shoe that started it all. Michael Jordan's first signature model was designed by Peter Moore and released in 1985. The Nike Air Jordan 1 Retro High is an iconic silhouette that continues to influence sneaker culture.",
        price: 170.00,
        discountPrice: null,
        imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2e6797ce02f3/air-jordan-1-high-og-shoes-VdpsB7.png',
        brand: 'Jordan',
        category: 'Basketball',
        countInStock: 10,
        rating: 5.0,
        numReviews: 36,
        isFeatured: true,
        isNew: false,
        sizes: JSON.stringify(['8', '9', '10', '11', '12']),
        colors: JSON.stringify(['Red', 'Black', 'White'])
      },
      {
        name: 'Puma RS-X',
        description: 'The RS-X takes the RS series to a new level. The design features a bulky silhouette with a mesh and textile upper, leather overlays, and a molded sockliner for extra comfort.',
        price: 110.00,
        discountPrice: 89.99,
        imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/373308/02/sv01/fnd/IND/fmt/png/RS-X-Puzzle-Men-s-Sneakers',
        brand: 'Puma',
        category: 'Casual',
        countInStock: 20,
        rating: 4.2,
        numReviews: 18,
        isFeatured: false,
        isNew: true,
        sizes: JSON.stringify(['7', '8', '9', '10', '11']),
        colors: JSON.stringify(['White', 'Blue', 'Yellow'])
      },
      {
        name: 'New Balance 574',
        description: 'The 574 is a classic. Originally designed as a technical running shoe in the 80s, the 574 has become one of New Balance most iconic lifestyle sneakers.',
        price: 80.00,
        discountPrice: null,
        imageUrl: 'https://nb.scene7.com/is/image/NB/ml574evn_nb_02_i?$pdpflexf2$&wid=440&hei=440',
        brand: 'New Balance',
        category: 'Casual',
        countInStock: 30,
        rating: 4.3,
        numReviews: 22,
        isFeatured: false,
        isNew: false,
        sizes: JSON.stringify(['7', '8', '9', '10', '11', '12']),
        colors: JSON.stringify(['Grey', 'Navy', 'Green'])
      },
      {
        name: 'Converse Chuck Taylor All Star',
        description: 'The Chuck Taylor All Star is the most iconic sneaker in the world, recognized for its unmistakable silhouette and cultural authenticity. And like the best paradigms, it only gets better with time.',
        price: 55.00,
        discountPrice: 49.99,
        imageUrl: 'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw9d15d1e6/images/a_107/M9160_A_107X1.jpg',
        brand: 'Converse',
        category: 'Casual',
        countInStock: 40,
        rating: 4.6,
        numReviews: 45,
        isFeatured: true,
        isNew: false,
        sizes: JSON.stringify(['6', '7', '8', '9', '10', '11', '12']),
        colors: JSON.stringify(['Black', 'White', 'Red', 'Navy'])
      },
      {
        name: 'Nike Kyrie 7',
        description: 'Kyrie Irving is a creative force on and off the court. He needs his shoes to keep up with his playmaking, but also sync with his boundary-pushing style and ethos.',
        price: 130.00,
        discountPrice: 119.99,
        imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d98a212e-ad9c-42e9-9f34-1b04960f5202/kyrie-7-basketball-shoes-nNMZ3b.png',
        brand: 'Nike',
        category: 'Basketball',
        countInStock: 18,
        rating: 4.7,
        numReviews: 28,
        isFeatured: false,
        isNew: true,
        sizes: JSON.stringify(['8', '9', '10', '11', '12', '13']),
        colors: JSON.stringify(['Black', 'White', 'Blue', 'Red'])
      },
      {
        name: 'Adidas NMD_R1',
        description: 'The NMD_R1 is a lifestyle sneaker created for urban exploration. These shoes combine a technical look with the latest comfort innovations from adidas.',
        price: 140.00,
        discountPrice: 119.99,
        imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c2a18c4e3f104d52a697ad6a01477bb7_9366/NMD_R1_Shoes_Black_GZ9256_01_standard.jpg',
        brand: 'Adidas',
        category: 'Casual',
        countInStock: 22,
        rating: 4.4,
        numReviews: 32,
        isFeatured: true,
        isNew: false,
        sizes: JSON.stringify(['7', '8', '9', '10', '11', '12']),
        colors: JSON.stringify(['Black', 'White', 'Red', 'Blue'])
      }
    ];

    // Insert products
    const createdProducts = await Product.bulkCreate(products);
    console.log(`${createdProducts.length} products created`);

    // Create sample reviews
    const reviews = [
      {
        userId: user.id,
        productId: createdProducts[0].id,
        rating: 5,
        comment: 'These shoes are amazing! Super comfortable and stylish.'
      },
      {
        userId: user.id,
        productId: createdProducts[1].id,
        rating: 4,
        comment: 'Great shoes, but a bit expensive.'
      },
      {
        userId: admin.id,
        productId: createdProducts[0].id,
        rating: 4,
        comment: 'Very good quality and comfortable for running.'
      }
    ];

    // Insert reviews
    const createdReviews = await Review.bulkCreate(reviews);
    console.log(`${createdReviews.length} reviews created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
