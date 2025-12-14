const express = require('express');
const Sweet = require('../models/Sweet');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// GET all sweets (public)
router.get('/', async (req, res) => {
  const q = req.query.q;
  const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
  const sweets = await Sweet.find(filter);
  res.json(sweets);
});

// purchase (any logged-in user)
router.post('/:id/purchase', auth, async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) return res.status(404).json({ msg: 'Not found' });
  if (sweet.quantity <= 0) {
    return res.status(400).json({ msg: 'Out of stock' });
  }
  sweet.quantity -= 1;
  await sweet.save();
  res.json({ remaining: sweet.quantity });
});

// admin add/update/delete
router.post('/', auth, admin, async (req, res) => {
  const sweet = new Sweet(req.body);
  await sweet.save();
  res.status(201).json(sweet);
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

module.exports = router;
