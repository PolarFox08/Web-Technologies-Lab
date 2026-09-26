# MERN Shopping List App

A full-stack MERN (MongoDB, Express, React, Node.js) shopping list application. Manage your shopping items with real-time CRUD operations, quantity tracking, and purchased status toggles.

---

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Architecture](#project-architecture)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Screenshots & Placeholders](#screenshots--placeholders)
- [Features & Tech Stack](#features--tech-stack)

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher, v18/v20/v22+ recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port `27017`)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (GUI for inspecting your database and collections)
- [Postman](https://www.postman.com/) or any HTTP client for testing API endpoints

---

## 🏗️ Project Architecture

```
mern-shopping-app/
├── backend/
│   ├── models/
│   │   └── Item.js
│   ├── routes/
│   │   └── items.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskList.jsx
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── AGENT.md
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Verify your `backend/.env` file exists with the following configuration:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/shoppinglist
   PORT=5000
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (including `axios`):
   ```bash
   npm install
   npm install axios
   ```
3. Ensure `"proxy": "http://localhost:5000"` is set in `frontend/package.json`.

---

## 🏃 Running the Application

To run the full stack application, open **three terminal windows**:

### Terminal 1: MongoDB Service
Ensure MongoDB is running locally:
- **Windows (Service):** MongoDB usually runs automatically as a Windows service. You can start it via PowerShell if needed:
  ```powershell
  net start MongoDB
  ```
- **macOS / Linux:**
  ```bash
  mongod --dbpath /data/db
  # or using brew:
  brew services start mongodb-community
  ```

### Terminal 2: Backend API Server
```bash
cd backend
npm run dev
```
You should see:
```
MongoDB connected
Server running on port 5000
```

### Terminal 3: Frontend React Client
```bash
cd frontend
npm start
```
The browser will automatically open at `http://localhost:3000`.

---

## 📡 API Endpoints

The backend exposes RESTful endpoints at `/api/items`:

| Method | Endpoint | Description | Request Body | Response Status |
|--------|----------|-------------|--------------|-----------------|
| `GET` | `/` | API Health Check | None | `200 OK` (`{ message: "Shopping List API running" }`) |
| `GET` | `/api/items` | Retrieve all items sorted by newest first | None | `200 OK` (Array of item objects) |
| `POST` | `/api/items` | Create a new shopping item | `{ "name": "Milk", "quantity": 2 }` | `201 Created` (Created item object), `400 Bad Request` if name is missing/empty |
| `PUT` | `/api/items/:id` | Toggle the `purchased` status of an item | None | `200 OK` (Updated item object), `404 Not Found` if id does not exist |
| `DELETE` | `/api/items/:id` | Delete an item by ID | None | `200 OK` (`{ message: "Item deleted" }`), `404 Not Found` if id does not exist |

---

## 📸 Screenshots & Placeholders

### 1. Running Application (Web UI)
![Running Application Placeholder](https://via.placeholder.com/800x450.png?text=Running+App+Screenshot+-+Shopping+List+UI)
*Add your screenshot of the running React app at `http://localhost:3000` showing added, toggled, and listed items.*

### 2. MongoDB Compass Collection
![MongoDB Compass Placeholder](https://via.placeholder.com/800x450.png?text=MongoDB+Compass+-+shoppinglist.items)
*Add your screenshot of MongoDB Compass connected to `mongodb://127.0.0.1:27017` showing the `shoppinglist` database and documents inside the `items` collection.*

### 3. Postman API Requests
![Postman Requests Placeholder](https://via.placeholder.com/800x450.png?text=Postman+API+Testing+-+GET+POST+PUT+DELETE)
*Add your screenshot of Postman showing successful calls to `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, and `DELETE /api/items/:id`.*

---

## 🛠️ Features & Implementation Details

- **Class Component Architecture:** `frontend/src/App.js` is built as a React Class Component using lifecycle method `componentDidMount()` to fetch data upon mounting.
- **Controlled Forms:** Form inputs are controlled using React state for dynamic two-way data binding.
- **Optimized UI Updates:** State is updated immutably for adding, toggling, and deleting items.
- **Robust Error Handling:** Mongoose schema validations, try/catch blocks on all endpoints, and status codes (200, 201, 400, 404, 500).
