const express = require('express');
const router = express.Router();

// Generic fallback CRUD endpoints so dashboard and managers stop throwing 404s
router.get('/', (req, res) => res.json([]));
router.post('/', (req, res) => res.status(201).json(req.body));
router.get('/:id', (req, res) => res.json({ id: req.params.id }));
router.put('/:id', (req, res) => res.json(req.body));
router.delete('/:id', (req, res) => res.json({ success: true }));

module.exports = router;