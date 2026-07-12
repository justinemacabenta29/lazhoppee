const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/auth',     require('./routes/auth.routes'));
app.use('/products', require('./routes/product.routes'));
app.use('/cart',     require('./routes/cart.routes'));
app.use('/stores',   require('./routes/store.routes'));
app.use('/messages', require('./routes/message.routes'));
app.use('/orders',   require('./routes/order.routes'));
app.use('/users',    require('./routes/user.routes'));
app.use('/addresses', require('./routes/address.routes'));
app.use('/reviews', require('./routes/review.routes'));
app.use('/reviews', require('./routes/review.routes'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));