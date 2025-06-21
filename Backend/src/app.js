require('dotenv').config();
const express = require('express'); 
const port = 3000;
const cors = require('cors');

const menuRoutes = require('./routes/menu.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');

const app = express(); 


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
   res.send('Order Cafe Coyy');
});

app.use('/api/categories', categoryRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Example app listening on at http://localhost:${port}`);
});