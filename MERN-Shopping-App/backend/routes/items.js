const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items - Return all items sorted by createdAt descending
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items - Validate name is non-empty; create item; return 201 with created doc
router.post('/', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const newItem = new Item({
      name: name.trim(),
      quantity: quantity !== undefined ? Number(quantity) : 1,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/items/:id - Toggle purchased field; return updated doc; 404 if not found
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.purchased = !item.purchased;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/items/:id - Delete by id; return { message: "Item deleted" }; 404 if not found
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
