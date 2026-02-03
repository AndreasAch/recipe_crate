<div align="center">
  <img src="client/src/assets/banner.png" alt="Recipe Crate Banner" width="100%">
</div>

# 🥗 Recipe Crate
![React](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/AndreasAch/recipe_crate/main/client/package.json&query=$.dependencies.react&style=plastic&logo=react&label=React&color=61DAFB&logoColor=black)
![Vite](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/AndreasAch/recipe_crate/main/client/package.json&query=$.devDependencies.vite&style=plastic&logo=vite&label=Vite&color=646CFF&logoColor=white)
![Framer Motion](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/AndreasAch/recipe_crate/main/client/package.json&query=$.dependencies['framer-motion']&style=plastic&logo=framer&label=Framer%20Motion&color=0055FF&logoColor=white)
![React Router](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/AndreasAch/recipe_crate/main/client/package.json&query=$.dependencies['react-router-dom']&style=plastic&logo=react-router&label=React%20Router&color=CA4245&logoColor=white)

![Express](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/AndreasAch/recipe_crate/main/server/package.json&query=$.dependencies.express&style=plastic&logo=express&label=Express&color=404D59&logoColor=white)
![PostgreSQL Driver](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/AndreasAch/recipe_crate/main/server/package.json&query=$.dependencies.pg&style=plastic&logo=postgresql&label=pg%20(Driver)&color=316192&logoColor=white)
![TypeScript](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/AndreasAch/recipe_crate/main/server/package.json&query=$.devDependencies.typescript&style=plastic&logo=typescript&label=TypeScript&color=3178C6&logoColor=white)

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

