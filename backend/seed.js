const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/product.model');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected');
    await Product.deleteMany({});

    await Product.insertMany([

      // ── SHOES ──────────────────────────────────────────────
      { name: 'Nike Air Max 270',       price: 5999, category: 'shoes', stock: 15, rating: 4.8, sold: 120, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
      { name: 'Adidas Ultraboost 22',   price: 7499, category: 'shoes', stock: 10, rating: 4.7, sold: 85,  imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
      { name: 'Puma RS-X',              price: 4599, category: 'shoes', stock: 20, rating: 4.6, sold: 60,  imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400' },
      { name: 'Vans Old Skool',         price: 3299, category: 'shoes', stock: 25, rating: 4.9, sold: 200, imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400' },
      { name: 'Converse Chuck Taylor',  price: 2999, category: 'shoes', stock: 30, rating: 4.5, sold: 310, imageUrl: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400' },
      { name: 'New Balance 574',        price: 4999, category: 'shoes', stock: 12, rating: 4.7, sold: 44,  imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400' },
      { name: 'Jordan 1 Retro High',    price: 8999, category: 'shoes', stock: 8,  rating: 4.9, sold: 180, imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400' },
      { name: 'Reebok Classic Leather', price: 3799, category: 'shoes', stock: 18, rating: 4.5, sold: 77,  imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400' },
      { name: 'Asics Gel-Nimbus',       price: 6499, category: 'shoes', stock: 14, rating: 4.6, sold: 33,  imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400' },
      { name: 'Skechers Go Walk',       price: 2499, category: 'shoes', stock: 22, rating: 4.4, sold: 90,  imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400' },
      { name: 'Timberland 6-inch Boot', price: 7999, category: 'shoes', stock: 9,  rating: 4.8, sold: 55,  imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400' },
      { name: 'Crocs Classic Clog',     price: 1999, category: 'shoes', stock: 40, rating: 4.3, sold: 140, imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400' },

      // ── PANTS ──────────────────────────────────────────────
      { name: 'Slim Fit Chinos',    price: 1299, category: 'pants', stock: 20, rating: 4.5, sold: 88,  imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400' },
      { name: 'Classic Denim Jeans', price: 1599, category: 'pants', stock: 15, rating: 4.6, sold: 120, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
      { name: 'Jogger Sweatpants',  price: 899,  category: 'pants', stock: 30, rating: 4.4, sold: 95,  imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400' },
      { name: 'Cargo Pants',        price: 1199, category: 'pants', stock: 18, rating: 4.3, sold: 60,  imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=400' },

      // ── T-SHIRTS ───────────────────────────────────────────
      { name: 'Graphic Tee',            price: 599, category: 'tshirt', stock: 50, rating: 4.5, sold: 200, imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
      { name: 'Plain White Shirt',      price: 499, category: 'tshirt', stock: 60, rating: 4.6, sold: 310, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
      { name: 'Polo Shirt',             price: 799, category: 'tshirt', stock: 35, rating: 4.4, sold: 150, imageUrl: 'https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=400' },
      { name: 'Striped Long Sleeve',    price: 699, category: 'tshirt', stock: 25, rating: 4.3, sold: 80,  imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaAITVOdMaLwSUoNuf-z1GSIYrdGJmEOLLS73yz5vHbg&s=10' },
      { name: 'Maroon Oversized Tshirt', price: 655, category: 'tshirt', stock: 40, rating: 4.7, sold: 220, imageUrl: 'https://thalasiknitfab.com/cdn/shop/files/WhatsAppImage2025-09-24at9.34.13AM_490x.progressive.jpg?v=1760606450' },

      // ── HOODIES ────────────────────────────────────────────
      { name: 'Pullover Hoodie',     price: 1499, category: 'hoodie', stock: 25, rating: 4.6, sold: 140, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
      { name: 'Zip-Up Hoodie',       price: 1699, category: 'hoodie', stock: 20, rating: 4.5, sold: 95,  imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb0erqCTWoGrpWSA3_YgmxUumScBsfpZMdlhzi7NooUg&s=10' },
      { name: 'Oversized Hoodie',    price: 1899, category: 'hoodie', stock: 18, rating: 4.7, sold: 160, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjzZfi0P05bpIAdKTl_U2V8v9s9Bz0-jXLD66LaEskSg&s=10' },
      { name: 'Fleece-Lined Hoodie', price: 2199, category: 'hoodie', stock: 12, rating: 4.8, sold: 70,  imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-3_hy9pcp-9ITBZTIz5v0sKKPmfLyItqnnpm_tfX7gw&s=10' },

      // ── ACCESSORIES ────────────────────────────────────────
      { name: 'Leather Wallet',  price: 899, category: 'accessories', stock: 30, rating: 4.7, sold: 180, imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400' },
      { name: 'Canvas Tote Bag', price: 699, category: 'accessories', stock: 25, rating: 4.5, sold: 95,  imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
      { name: 'Baseball Cap',    price: 499, category: 'accessories', stock: 40, rating: 4.4, sold: 120, imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' },
      { name: 'Leather Belt',    price: 599, category: 'accessories', stock: 20, rating: 4.6, sold: 75,  imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400' },

    ]);

    console.log('✅ All products seeded!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });