import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SkillManager from './pages/SkillManager';
import ProjectManager from './pages/ProjectManager';
import AboutManager from './pages/AboutManager';
import BlogManager from './pages/BlogManager';
import ExperienceManager from './pages/ExperienceManager';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/skills" element={<SkillManager />} />
      <Route path="/projects" element={<ProjectManager />} />
      <Route path="/about" element={<AboutManager />} />
      <Route path="/blogs" element={<BlogManager />} />
      <Route path="/experience" element={<ExperienceManager />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}