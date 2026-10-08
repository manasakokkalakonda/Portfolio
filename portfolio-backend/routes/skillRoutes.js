const express = require('express');
const router = express.Router();

let skills = [
  { id: '1', name: 'Node.js', proficiency: '90', icon: '' },
  { id: '2', name: 'React', proficiency: '85', icon: '' }
];

// GET /api/skills
router.get('/', (req, res) => {
  res.json(skills);
});

// POST /api/skills
router.post('/', (req, res) => {
  const { name, proficiency, icon } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Skill name is required' });
  }
  const newSkill = { id: Date.now().toString(), name, proficiency, icon };
  skills.push(newSkill);
  res.status(201).json(newSkill);
});

// DELETE /api/skills/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  skills = skills.filter(s => s.id !== id && s._id !== id);
  res.json({ message: 'Skill deleted successfully' });
});

module.exports = router;