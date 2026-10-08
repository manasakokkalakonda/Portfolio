# Portfolio Project - Full Documentation (Frontend + Backend + CMS)

A full-stack portfolio application paired with a custom-coded Content Management System (CMS) built entirely from scratch, avoiding any reliance on third-party headless CMS platforms

## 🏗️ Architecture Overview

This project is built using a decoupled architecture consisting of two primary repositories/modules plus a custom admin dashboard
1. **Frontend Repo (`portfolio-frontend`)** - React / Next.js + Tailwind CSS
2. **Backend Repo (`portfolio-backend`)** - Node.js + Express.js CMS & API server
3. **Admin Panel (`portfolio-admin`)** - Custom-built admin panel with content management APIs and database schemas

## 📁 1. Frontend Repository (`portfolio-frontend`)

### Tech Stack
* React / Next.js + Tailwind CSS
### Responsibilities
* Fetch dynamic content from the custom CMS backend via REST API endpoints
* Render core pages: Home, About, Projects, Skills, Experience, Blog, and Contact
* Handle SEO optimization, animations, and UI polish

### Frontend Installation & Execution
```powershell
cd portfolio-frontend
npm install
npm run dev

## ⚙️ 2. Backend Repository (Custom CMS + APIs) (`portfolio-backend`)

### Tech Stack
* **Runtime**: Node.js + Express.js
* **Database**: MongoDB 

### Core Responsibilities
* Full CMS implementation from scratch
* Admin dashboard for managing content and handling authentication
* CRUD APIs for each content type and contact form handling
* Image/file upload processing

### Database Schema Collections / Tables
* `dashboard`, `about`, `skills`, `projects`, `blogs`, `experience`, `testimonials`, `services`, `messages` (contact form), `media`

### Backend Installation & Execution
```powershell
# Navigate to backend folder
cd portfolio-backend
npm install
node server.js

## 🔐 3. Admin Panel CMS (`portfolio-admin`)

### Tech Stack
* React / Vite or Next.js

### Features Built
* Login page with JWT-based authentication
* Main control dashboard
* Management CRUD screens for About, Skills, Projects, Blogs, Experience/Timeline, Testimonials, and Services
* Media upload system

### Admin Installation & Execution
```powershell
cd portfolio-admin
npm install
npm run dev
