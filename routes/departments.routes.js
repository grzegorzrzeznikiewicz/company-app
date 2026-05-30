const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');

router.get('/departments', async (req, res) => {
  try {
    res.json(await Department.find({}));
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/departments/random', async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const department = await Department.findOne().skip(rand);
    if (!department) res.status(404).json({ message: 'Not found' });
    else res.json(department);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) res.status(404).json({ message: 'Not found' });
    else res.json(department);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/departments', async (req, res) => {
  const { name } = req.body;

  try {
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/departments/:id', async (req, res) => {
  const { name } = req.body;

  try {
    const department = await Department.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
    if (!department) res.status(404).json({ message: 'Not found' });
    else res.json(department);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) res.status(404).json({ message: 'Not found' });
    else res.json(department);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
