# MERN Shopping List App — Agent Implementation Prompt

You are an expert full-stack developer. Implement a complete MERN-stack shopping list application based on the specification below. Follow every requirement precisely. Do not skip files. Do not ask clarifying questions — build everything.

---

## Context

The user has already:
- Created the directory structure:
  ```
  mern-shopping-app/
  ├── backend/
  └── frontend/
  ```
- Run `npm init -y` inside `backend/`
- Installed backend dependencies (`express`, `mongoose`, `cors`, `dotenv`, `nodemon`)
- Added `"start": "node server.js"` and `"dev": "nodemon server.js"` scripts in `backend/package.json`

Your job is to generate all remaining files for the backend and create and configure the entire frontend.

---

## Part 1 — Backend (Node.js + Express + MongoDB)

Create the following files with the exact specifications:

### `backend/.env`
```
MONGO_URI=mongodb://127.0.0.1:27017/shoppinglist
PORT=5000
```

### `backend/models/Item.js`
- Import `mongoose`.
- Define an `Item` schema with:
  - `name`: String, required, trimmed
  - `quantity`: Number, default 1
  - `purchased`: Boolean, default false
  - `createdAt`: Date, default `Date.now`
- Export `mongoose.model('Item', itemSchema)`.

### `backend/routes/items.js`
- Import `express` and the `Item` model.
- Create an `express.Router()`.
- Define these endpoints (all wrapped in try/catch, returning proper HTTP status codes):

| Method | Path       | Behavior                                                                 |
|--------|------------|--------------------------------------------------------------------------|
| GET    | `/`        | Return all items sorted by `createdAt` descending                        |
| POST   | `/`        | Validate `name` is non-empty; create item; return 201 with created doc   |
| PUT    | `/:id`     | Toggle `purchased` field; return updated doc; 404 if not found           |
| DELETE | `/:id`     | Delete by id; return `{ message: "Item deleted" }`; 404 if not found     |

- Return 400 with `{ error: "Name is required" }` on invalid POST.
- Return 500 with `{ error: err.message }` on any server error.
- Export the router.

### `backend/server.js`
- `require('dotenv').config()`
- Import `express`, `mongoose`, `cors`, and the items router.
- Create the Express app.
- Apply middleware: `cors()` and `express.json()`.
- Connect to MongoDB using `process.env.MONGO_URI`.
  - On success: `console.log('MongoDB connected')`
  - On failure: `console.error(err.message)` and `process.exit(1)`
- Mount the router: `app.use('/api/items', itemsRouter)`.
- Add root route `GET /` returning `{ message: 'Shopping List API running' }`.
- Listen on `process.env.PORT || 5000` and log `Server running on port <PORT>`.

---

## Part 2 — Frontend (React)

Run this command inside `mern-shopping-app/`:
```bash
npx create-react-app frontend
cd frontend
npm install axios
```

Then generate the following files. **`App.js` must be a class component** (the assignment requires `componentDidMount`).

### `frontend/package.json`
Add the proxy line so axios calls go to the backend:
```json
"proxy": "http://localhost:5000"
```

### Folder Structure
```
frontend/src/
├── components/
│   ├── TaskList.jsx
│   ├── TaskItem.jsx
│   └── TaskForm.jsx
├── App.js
├── App.css
└── index.js   (leave CRA default, but ensure it imports App.css if needed)
```

### `frontend/src/App.js` — Class Component

**State:**
```js
this.state = {
  todos: [],
  newTodo: '',
  quantity: 1
};
```

**Methods to implement:**

1. **`componentDidMount()`**
   - `axios.get('/api/items')`
   - On success: `this.setState({ todos: response.data })`
   - On error: `console.error(err)`

2. **`handleInputChange = (e) => {...}`**
   - Update `newTodo` with `e.target.value`.

3. **`handleQuantityChange = (e) => {...}`**
   - Update `quantity` with `Number(e.target.value)`.

4. **`handleSubmit = async (e) => {...}`**
   - `e.preventDefault()`
   - If `this.state.newTodo.trim() === ''` → return.
   - POST `{ name: this.state.newTodo, quantity: this.state.quantity }` to `/api/items`.
   - On success: append the returned item to `todos`, reset `newTodo` to `''` and `quantity` to `1`.
   - On error: `console.error(err)`.

5. **`handleToggle = async (id) => {...}`**
   - PUT `/api/items/${id}`.
   - Replace the matching item in `todos` state with the response.

6. **`handleDelete = async (id) => {...}`**
   - DELETE `/api/items/${id}`.
   - Filter the item out of `todos` state.

**Render:**
```jsx
<div className="app-container">
  <h1>🛒 My Shopping List</h1>
  <TaskForm
    newTodo={this.state.newTodo}
    quantity={this.state.quantity}
    handleInputChange={this.handleInputChange}
    handleQuantityChange={this.handleQuantityChange}
    handleSubmit={this.handleSubmit}
  />
  <TaskList
    todos={this.state.todos}
    onToggle={this.handleToggle}
    onDelete={this.handleDelete}
  />
</div>
```

### `frontend/src/components/TaskForm.jsx`
Functional component. Renders a `<form>` containing:
- Text input bound to `newTodo` (placeholder: "Add an item…")
- Number input bound to `quantity` (min 1)
- Submit button "Add Item"

Props: `newTodo`, `quantity`, `handleInputChange`, `handleQuantityChange`, `handleSubmit`.

### `frontend/src/components/TaskList.jsx`
Functional component. Props: `todos`, `onToggle`, `onDelete`.
- If `todos.length === 0`, render `<p className="empty">No items yet. Add one above!</p>`.
- Otherwise, `.map()` over `todos` and render `<TaskItem>` for each, passing `key={item._id}`, `item`, `onToggle`, `onDelete`.

### `frontend/src/components/TaskItem.jsx`
Functional component. Props: `item`, `onToggle`, `onDelete`.
- Render `<li>` with:
  - A checkbox `checked={item.purchased}` calling `onToggle(item._id)` on change.
  - `<span className={item.purchased ? 'purchased' : ''}>{item.name} (x{item.quantity})</span>`
  - A delete button calling `onDelete(item._id)`.

### `frontend/src/App.css`
Include the following:
- `.app-container` centered, max-width 500px, margin auto, padding 2rem, font-family sans-serif.
- `.purchased` → `text-decoration: line-through; color: gray;`
- `.empty` → gray italic text, centered.
- Input and button styling: padding, border-radius, subtle border.
- `li` styling: flex layout, space-between, bottom border.

---

## Part 3 — Documentation

Create `README.md` at the project root with:
1. Project title: **MERN Shopping List App**
2. Prerequisites (Node.js, MongoDB Community Server, MongoDB Compass).
3. Setup instructions for backend and frontend (with exact commands).
4. How to run (three terminals: MongoDB, backend `npm run dev`, frontend `npm start`).
5. API endpoint table.
6. Screenshot placeholders for: running app, MongoDB Compass collection, Postman requests.

---

## Acceptance Criteria

The implementation is complete when:

- [ ] `backend/` contains `.env`, `models/Item.js`, `routes/items.js`, `server.js` — all runnable with `npm run dev`.
- [ ] `backend/server.js` prints `MongoDB connected` and `Server running on port 5000`.
- [ ] `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id` all work (testable in Postman).
- [ ] `frontend/` is a working CRA app with `App.js` as a class component using `componentDidMount`.
- [ ] Four files exist: `App.js`, `TaskList.jsx`, `TaskItem.jsx`, `TaskForm.jsx`.
- [ ] Proxy is set in `frontend/package.json`.
- [ ] Adding an item in the UI persists to MongoDB and appears in Compass.
- [ ] Toggling an item updates its `purchased` state in the DB.
- [ ] Deleting an item removes it from the DB and the UI.
- [ ] `README.md` documents setup and run steps.

---

## Mapping to Assignment Requirements

| Assignment Requirement | Where Implemented |
|------------------------|-------------------|
| Init state: `todos`, `newTodo` | `App.js` `this.state` |
| `componentDidMount` GET fetch | `App.js` |
| Update `todos` from response | `App.js` |
| `handleInputChange` | `App.js` |
| `handleSubmit` | `App.js` |
| Empty input guard | `App.js` `handleSubmit` |
| Create task object | `App.js` `handleSubmit` |
| POST to server | `App.js` `handleSubmit` |
| Update state + reset input | `App.js` `handleSubmit` |
| Render list/input/button | `App.js` + components |
| Map through `todos` | `TaskList.jsx` |
| Component: App | `App.js` |
| Component: Task List | `TaskList.jsx` |
| Component: Task Item | `TaskItem.jsx` |
| Component: Task Form | `TaskForm.jsx` |
| Express API endpoints | `routes/items.js` |
| MongoDB connection | `server.js` |
| Schema + Model | `models/Item.js` |
| CRUD operations | All routes |

---

## Instructions to the Agent

1. Generate **every file listed above** with complete, production-quality code.
2. Do not use placeholders like `// TODO`. Write the full implementation.
3. Use functional components with props for the three child components.
4. Use a class component for `App.js` (mandatory).
5. Include imports in every file.
6. Add comments for clarity where logic is non-obvious.
7. After generating the files, output a final checklist confirming each acceptance criterion is met.
8. Provide the exact terminal commands the user must run to start the app.

Build the entire project now.