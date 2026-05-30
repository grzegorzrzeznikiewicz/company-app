const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const getCollection = req => req.db.collection('departments');

router.get('/departments', (req, res) => {
  getCollection(req)
    .find()
    .toArray()
    .then(departments => res.json(departments))
    .catch(err => res.status(500).json({ message: err }));
});

router.get('/departments/random', (req, res) => {
  getCollection(req)
    .countDocuments()
    .then(count => {
      const rand = Math.floor(Math.random() * count);
      return getCollection(req).find().skip(rand).limit(1).next();
    })
    .then(department => {
      if (!department) res.status(404).json({ message: 'Not found' });
      else res.json(department);
    })
    .catch(err => res.status(500).json({ message: err }));
});

router.get('/departments/:id', (req, res) => {
  getCollection(req)
    .findOne({ _id: ObjectId(req.params.id) })
    .then(department => {
      if (!department) res.status(404).json({ message: 'Not found' });
      else res.json(department);
    })
    .catch(err => res.status(500).json({ message: err }));
});

router.post('/departments', (req, res) => {
  const { name } = req.body;

  getCollection(req)
    .insertOne({ name })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

router.put('/departments/:id', (req, res) => {
  const { name } = req.body;

  getCollection(req)
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: { name } })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

router.delete('/departments/:id', (req, res) => {
  getCollection(req)
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

module.exports = router;
