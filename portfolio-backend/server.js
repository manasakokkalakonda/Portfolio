const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes'); 
app.use('/api/auth', authRoutes);

app.post('/api/auth/login', (req, res) => {
  console.log("Login request received with body:", req.body); // Check your terminal to see if data arrives

  if (email && password) {
    return res.status(200).json({
      success: true,
      token: "mock_jwt_token_success_12345",
      message: "Login successful"
    });
  }

  // Fallback if body was empty
  return res.status(401).json({
    success: false,
    message: "Email and password are required."
  });
});

let aboutData = {
  name: "Admin",
  title: "Full-Stack Web Developer",
  bio: "Passionate developer building scalable web applications with Node.js and React.",
  skills: ["Node.js", "React", "Express", "MongoDB", "JavaScript"]
};

let skillsData = [];
let projectsData = [];
let blogsData = [];
let experienceData = [];
let servicesData = [];
let testimonialsData = [];
let messagesData = [];
let mediaData = [];

// --- 1. ABOUT ROUTES (/api/about) ---
const aboutRouter = express.Router();
aboutRouter.get('/', (req, res) => res.json(aboutData));
aboutRouter.put('/', (req, res) => {
  aboutData = { ...aboutData, ...req.body };
  res.json(aboutData);
});
app.use('/api/about', aboutRouter);

// --- 2. SKILLS ROUTES (/api/skills) ---
const skillRouter = express.Router();
skillRouter.get('/', (req, res) => res.json(skillsData));
skillRouter.post('/', (req, res) => {
  const newSkill = { id: Date.now(), ...req.body };
  skillsData.push(newSkill);
  res.status(201).json(newSkill);
});
skillRouter.delete('/:id', (req, res) => {
  skillsData = skillsData.filter(s => s.id != req.params.id);
  res.json({ success: true });
});
app.use('/api/skills', skillRouter);

// --- 3. PROJECTS ROUTES (/api/projects) ---
const projectRouter = express.Router();
projectRouter.get('/', (req, res) => res.json(projectsData));
projectRouter.post('/', (req, res) => {
  const newProject = { id: Date.now(), ...req.body };
  projectsData.push(newProject);
  res.status(201).json(newProject);
});
projectRouter.delete('/:id', (req, res) => {
  projectsData = projectsData.filter(p => p.id != req.params.id);
  res.json({ success: true });
});
app.use('/api/projects', projectRouter);

// --- 4. BLOGS ROUTES (/api/blogs) ---
const blogRouter = express.Router();
blogRouter.get('/', (req, res) => res.json(blogsData));
blogRouter.post('/', (req, res) => {
  const newBlog = { id: Date.now(), ...req.body };
  blogsData.push(newBlog);
  res.status(201).json(newBlog);
});
blogRouter.delete('/:id', (req, res) => {
  blogsData = blogsData.filter(b => b.id != req.params.id);
  res.json({ success: true });
});
app.use('/api/blogs', blogRouter);

// --- 5. EXPERIENCE ROUTES (/api/experience) ---
const experienceRouter = express.Router();
experienceRouter.get('/', (req, res) => res.json(experienceData));
experienceRouter.post('/', (req, res) => {
  const newExp = { id: Date.now(), ...req.body };
  experienceData.push(newExp);
  res.status(201).json(newExp);
});
experienceRouter.delete('/:id', (req, res) => {
  experienceData = experienceData.filter(e => e.id != req.params.id);
  res.json({ success: true });
});
app.use('/api/experience', experienceRouter);

// --- 6. SERVICES ROUTES (/api/services) ---
const serviceRouter = express.Router();
serviceRouter.get('/', (req, res) => res.json(servicesData));
serviceRouter.post('/', (req, res) => {
  const newService = { id: Date.now(), ...req.body };
  servicesData.push(newService);
  res.status(201).json(newService);
});
serviceRouter.delete('/:id', (req, res) => {
  servicesData = servicesData.filter(s => s.id != req.params.id);
  res.json({ success: true });
});
app.use('/api/services', serviceRouter);

// --- 7. TESTIMONIALS ROUTES (/api/testimonials) ---
const testimonialRouter = express.Router();
testimonialRouter.get('/', (req, res) => res.json(testimonialsData));
testimonialRouter.post('/', (req, res) => {
  const newTestimonial = { id: Date.now(), ...req.body };
  testimonialsData.push(newTestimonial);
  res.status(201).json(newTestimonial);
});
testimonialRouter.delete('/:id', (req, res) => {
  testimonialsData = testimonialsData.filter(t => t.id != req.params.id);
  res.json({ success: true });
});
app.use('/api/testimonials', testimonialRouter);

// --- 8. MESSAGES ROUTES (/api/messages) ---
const messageRouter = express.Router();
messageRouter.get('/', (req, res) => res.json(messagesData));
messageRouter.post('/', (req, res) => {
  const newMessage = { id: Date.now(), ...req.body };
  messagesData.push(newMessage);
  res.status(201).json(newMessage);
});
messageRouter.delete('/:id', (req, res) => {
  messagesData = messagesData.filter(m => m.id != req.params.id);
  res.json({ success: true });
});
app.use('/api/messages', messageRouter);

// --- 9. MEDIA ROUTES (/api/media) ---
const mediaRouter = express.Router();
mediaRouter.get('/', (req, res) => res.json(mediaData));
mediaRouter.post('/', (req, res) => {
  const newMedia = { id: Date.now(), url: req.body.url || 'https://via.placeholder.com/150', ...req.body };
  mediaData.push(newMedia);
  res.status(201).json(newMedia);
});
mediaRouter.delete('/:id', (req, res) => {
  mediaData = mediaData.filter(m => m.id != req.params.id);
  res.json({ success: true });
});
app.use('/api/media', mediaRouter);

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Portfolio Backend API is running successfully...');
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('MongoDB connection warning:', err.message);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without active DB connection)`);
    });
  });