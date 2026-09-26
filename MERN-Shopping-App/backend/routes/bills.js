const express = require('express');
const mongoose = require('mongoose');
const Bill = require('../models/Bill');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all bill routes
router.use(auth);

// @route   GET /api/bills
// @desc    List bills owned by the authenticated user (exclude items array, include itemCount via $size)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          createdAt: 1,
          user: 1,
          itemCount: { $size: { $ifNull: ['$items', []] } },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.json(bills);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/bills
// @desc    Create a new bill for the authenticated user
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const bill = new Bill({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      items: [],
    });

    const savedBill = await bill.save();
    return res.status(201).json(savedBill);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/bills/:billId
// @desc    Get bill details with items if owned by user; else 404
// @access  Private
router.get('/:billId', async (req, res) => {
  try {
    const { billId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Critical ownership check: query strictly with _id AND user
    const bill = await Bill.findOne({
      _id: billId,
      user: req.user.id,
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    return res.json(bill);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/bills/:billId
// @desc    Delete owned bill; 404 otherwise
// @access  Private
router.delete('/:billId', async (req, res) => {
  try {
    const { billId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Critical ownership check: find and delete only if owned by req.user.id
    const bill = await Bill.findOneAndDelete({
      _id: billId,
      user: req.user.id,
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    return res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/bills/:billId/items
// @desc    Add an item to an owned bill
// @access  Private
router.post('/:billId/items', async (req, res) => {
  try {
    const { billId } = req.params;
    const { name, quantity } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Ownership check: must be owned by user
    const bill = await Bill.findOne({
      _id: billId,
      user: req.user.id,
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const newItem = {
      name: name.trim(),
      quantity: quantity ? Number(quantity) : 1,
      purchased: false,
    };

    bill.items.push(newItem);
    await bill.save();

    // Return the newly created item or the updated bill
    const createdItem = bill.items[bill.items.length - 1];
    return res.status(201).json(createdItem);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/bills/:billId/items/:itemId
// @desc    Toggle purchased status on subitem
// @access  Private
router.put('/:billId/items/:itemId', async (req, res) => {
  try {
    const { billId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(billId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(404).json({ error: 'Bill or item not found' });
    }

    // Ownership check: query bill by billId and req.user.id
    const bill = await Bill.findOne({
      _id: billId,
      user: req.user.id,
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Find embedded subdocument
    const sub = bill.items.id(itemId);
    if (!sub) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Toggle purchased status
    sub.purchased = !sub.purchased;
    await bill.save();

    return res.json(sub);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/bills/:billId/items/:itemId
// @desc    Pull subitem from bill
// @access  Private
router.delete('/:billId/items/:itemId', async (req, res) => {
  try {
    const { billId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(billId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(404).json({ error: 'Bill or item not found' });
    }

    // Ownership check: query bill by billId and req.user.id
    const bill = await Bill.findOne({
      _id: billId,
      user: req.user.id,
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Find embedded subdocument
    const sub = bill.items.id(itemId);
    if (!sub) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Pull subitem
    bill.items.pull(itemId);
    await bill.save();

    return res.json({ message: 'Item removed successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
