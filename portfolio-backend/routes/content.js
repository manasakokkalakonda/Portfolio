const express = require('express');
const verifyToken = require('../middleware/auth');

function createContentRouter(Model) {
  const router = express.Router();

  // GET: Public fetch all items
  router.get('/', async (req, res) => {
    try {
      const items = await Model.find().sort({ createdAt: -1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET: Public fetch single item by ID
  router.get('/:id', async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: Protected create item
  router.post('/', verifyToken, async (req, res) => {
    try {
      const newItem = new Model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT: Protected update item
  router.put('/:id', verifyToken, async (req, res) => {
    try {
      const updatedItem = await Model.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
      res.json(updatedItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE: Protected remove item
  router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const deletedItem = await Model.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createContentRouter;