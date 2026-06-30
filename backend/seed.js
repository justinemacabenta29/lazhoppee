const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/product.model');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected');
    await Product.deleteMany({});

    await Product.insertMany([
      { name: 'Nike Air Max 270', price: 5999, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'shoes', stock: 15, rating: 4.8, sold: 120 },
      { name: 'Adidas Ultraboost 22', price: 7499, imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', category: 'shoes', stock: 10, rating: 4.7, sold: 85 },
      { name: 'Puma RS-X', price: 4599, imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', category: 'shoes', stock: 20, rating: 4.6, sold: 60 },
      { name: 'Vans Old Skool', price: 3299, imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400', category: 'shoes', stock: 25, rating: 4.9, sold: 200 },
      { name: 'Converse Chuck Taylor', price: 2999, imageUrl: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400', category: 'shoes', stock: 30, rating: 4.5, sold: 310 },
      { name: 'New Balance 574', price: 4999, imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400', category: 'shoes', stock: 12, rating: 4.7, sold: 44 },
      { name: 'Jordan 1 Retro High', price: 8999, imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400', category: 'shoes', stock: 8, rating: 4.9, sold: 180 },
      { name: 'Reebok Classic Leather', price: 3799, imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400', category: 'shoes', stock: 18, rating: 4.5, sold: 77 },
      { name: 'Asics Gel-Nimbus', price: 6499, imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', category: 'shoes', stock: 14, rating: 4.6, sold: 33 },
      { name: 'Skechers Go Walk', price: 2499, imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400', category: 'shoes', stock: 22, rating: 4.4, sold: 90 },
      { name: 'Timberland 6-inch Boot', price: 7999, imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400', category: 'shoes', stock: 9, rating: 4.8, sold: 55 },
      { name: 'Crocs Classic Clog', price: 1999, imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400', category: 'shoes', stock: 40, rating: 4.3, sold: 140 },
    ]);

    console.log('✅ Shoe products seeded!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });