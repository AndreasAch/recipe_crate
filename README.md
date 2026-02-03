# 🥗 Recipe Crate

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
