const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const getCollection = req => req.db.collection('products');

router.get('/products', (req, res) => {
  getCollection(req)
    .find()
    .toArray()
    .then(products => res.json(products))
    .catch(err => res.status(500).json({ message: err }));
});

router.get('/products/random', (req, res) => {
  getCollection(req)
    .countDocuments()
    .then(count => {
      const rand = Math.floor(Math.random() * count);
      return getCollection(req).find().skip(rand).limit(1).next();
    })
    .then(product => {
      if (!product) res.status(404).json({ message: 'Not found' });
      else res.json(product);
    })
    .catch(err => res.status(500).json({ message: err }));
});

router.get('/products/:id', (req, res) => {
  getCollection(req)
    .findOne({ _id: ObjectId(req.params.id) })
    .then(product => {
      if (!product) res.status(404).json({ message: 'Not found' });
      else res.json(product);
    })
    .catch(err => res.status(500).json({ message: err }));
});

router.post('/products', (req, res) => {
  const { name, client } = req.body;

  getCollection(req)
    .insertOne({ name, client })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

router.put('/products/:id', (req, res) => {
  const { name, client } = req.body;

  getCollection(req)
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: { name, client } })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

router.delete('/products/:id', (req, res) => {
  getCollection(req)
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

module.exports = router;
