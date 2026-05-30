const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

router.get('/products', async (req, res) => {
  try {
    res.json(await Product.find({}));
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/products/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const product = await Product.findOne().skip(rand);
    if (!product) res.status(404).json({ message: 'Not found' });
    else res.json(product);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) res.status(404).json({ message: 'Not found' });
    else res.json(product);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/products', async (req, res) => {
  const { name, client } = req.body;

  try {
    const newProduct = new Product({ name, client });
    await newProduct.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { name, client }, { runValidators: true });
    if (!product) res.status(404).json({ message: 'Not found' });
    else res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) res.status(404).json({ message: 'Not found' });
    else res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
