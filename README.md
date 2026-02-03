<div align="center">
  <img src="client/src/assets/banner.png" alt="Recipe Crate Banner" width="100%">
</div>

# 🥗 Recipe Crate
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-7.12-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.28-0055FF?style=for-the-badge&logo=framer&logoColor=white)

![Express.js](https://img.shields.io/badge/Express.js-5.2-404D59?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/pg_(Driver)-8.17-316192?style=for-the-badge&logo=postgresql&logoColor=white)

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

A modern, full-stack application for managing recipes, planning meals, and handling ingredient lists. Built with the **PERN stack** (PostgreSQL, Express, React, Node), this project features a robust REST API and a responsive frontend powered by **Vite**.



## 🚀 Key Features

* **Hybrid Architecture:** Seamlessly switches between a local offline PostgreSQL database and a production cloud database based on environment variables.
* **"Cook Tonight" Roster:** A dedicated planning feature to toggle recipes into a daily cooking list.
* **Smart Forms:** Dynamic forms for adding ingredients and instructions with real-time state management.
* **Data Integrity:** Enforces unique constraints on tags and ingredients to prevent database duplication.
* **Responsive UI:** Built with raw CSS and TypeScript for granular control over layout and design.

## 🛠️ Tech Stack

**Frontend**
* **React 18+** (UI Library)
* **TypeScript** (Type Safety)
* **Vite** (Next-gen Build Tool)
* **CSS Modules** (Scoped Styling)

**Backend**
* **Node.js** (Runtime)
* **Express.js** (API Framework)
* **PostgreSQL** (Relational Database)
* **pg (node-postgres)** (Database Client)

---

## ⚙️ Installation & Setup (Local Offline Mode)

Follow these steps to run the application completely locally.

### 1. Prerequisites
* **Node.js** (v18 or higher)
* **PostgreSQL** (v14 or higher installed locally)
* **Git**

### 2. Clone the Repository
```bash
git clone [https://github.com/AndreasAch/recipe_crate.git](https://github.com/AndreasAch/recipe_crate.git)
cd recipe_crate
```

### 3. Database setup
* In your SQL Shell run the following:
```bash
CREATE DATABASE recipe_db;
\c recipe_db
\i '[PATH_TO_REPO_CLONE]/recipe_crate/schema.sql'
```

### 4. Server setup
* From the repo root ``recipe_crate/``:
```bash
cd server
npm install
```
* Create a ``.env`` file in the ``/server`` directory
* Inside the ``.env`` file add:
```bash
# Replace [YOUR_PASSWORD] with your actual Postgres password
# Update the port if your postgres is not running on default [5432].
LOCAL_DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/recipe_db
```
* Inside ``/server``:
```bash
npm run local
```

### 5. Client setup
* From the repo root ``recipe_crate/``:
```bash
cd client
npm install
```
* Inside ``/client``:
```bash
npm run local
```
* Visit ``http://localhost:5173``

## 📂 Project Structure
```text
recipe_crate
├── api
│   └── index.ts              # Entry point for Vercel Serverless functions (Production)
├── client                    # Frontend directory (React + Vite)
│   ├── index.html            # Main HTML document entry point
│   ├── package-lock.json     # Exact version lock for client dependencies
│   ├── package.json          # Client-side dependencies and scripts (npm run local)
│   ├── public                # Static assets folder (favicons, public images)
│   ├── src                   # Main React source code (Components, Hooks, Pages)
│   ├── tsconfig.app.json     # TypeScript configuration for the React application code
│   ├── tsconfig.json         # Main TypeScript configuration reference
│   ├── tsconfig.node.json    # TypeScript configuration for Vite/Node build tools
│   └── vite.config.ts        # Vite bundler configuration and API proxy settings
├── package-lock.json         # Exact version lock for root dependencies
├── package.json              # Root directory scripts (orchestrates both client/server)
├── schema.sql                # SQL script to create tables and database schema
├── server                    # Backend directory (Express + Node.js)
│   ├── package-lock.json     # Exact version lock for server dependencies
│   ├── package.json          # Server-side dependencies and scripts
│   ├── src                   # Backend source code (Controllers, Routes, DB connection)
│   └── tsconfig.json         # TypeScript configuration for the backend environment
└── vercel.json               # Deployment configuration and route rewrites for Vercel
```

