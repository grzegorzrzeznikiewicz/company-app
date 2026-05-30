const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const getCollection = req => req.db.collection('employees');

router.get('/employees', (req, res) => {
  getCollection(req)
    .find()
    .toArray()
    .then(employees => res.json(employees))
    .catch(err => res.status(500).json({ message: err }));
});

router.get('/employees/random', (req, res) => {
  getCollection(req)
    .countDocuments()
    .then(count => {
      const rand = Math.floor(Math.random() * count);
      return getCollection(req).find().skip(rand).limit(1).next();
    })
    .then(employee => {
      if (!employee) res.status(404).json({ message: 'Not found' });
      else res.json(employee);
    })
    .catch(err => res.status(500).json({ message: err }));
});

router.get('/employees/:id', (req, res) => {
  getCollection(req)
    .findOne({ _id: ObjectId(req.params.id) })
    .then(employee => {
      if (!employee) res.status(404).json({ message: 'Not found' });
      else res.json(employee);
    })
    .catch(err => res.status(500).json({ message: err }));
});

router.post('/employees', (req, res) => {
  const { firstName, lastName, department } = req.body;

  getCollection(req)
    .insertOne({ firstName, lastName, department })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

router.put('/employees/:id', (req, res) => {
  const { firstName, lastName, department } = req.body;

  getCollection(req)
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: { firstName, lastName, department } })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

router.delete('/employees/:id', (req, res) => {
  getCollection(req)
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(() => res.json({ message: 'OK' }))
    .catch(err => res.status(500).json({ message: err }));
});

module.exports = router;
