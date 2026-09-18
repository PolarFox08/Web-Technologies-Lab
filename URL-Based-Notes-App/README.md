# 📝 URL-Based Notes App (Node.js Core Modules Demonstration)

> **Web Technologies Lab Assignment**  
> Demonstrating the **File System (`fs`) Module** and **URL (`url`) Module** operations in Node.js.

---

## 📌 Project Overview

This application is a simple, lightweight **URL-driven Notes Manager** built entirely using **built-in Node.js modules** (`http`, `fs`, `url`, `path`). It showcases how incoming web request URLs are parsed and mapped to corresponding File System CRUD operations on local files.

---

## 🛠️ Modules & Methods Demonstrated

### 1. File System (`fs`) Module Operations
| Method | Description & Usage in Project |
| :--- | :--- |
| `fs.existsSync(path)` | Checks if the `notes/` directory or target note file exists before reading/deleting. |
| `fs.mkdirSync(path)` | Dynamically creates the `notes/` storage folder on server startup if missing. |
| `fs.writeFileSync(path, data)` | Creates a new note file or overwrites an existing one (`/add` or `/create`). |
| `fs.readFileSync(path, 'utf8')` | Reads note text content from disk synchronously (`/read`). |
| `fs.appendFileSync(path, data)` | Appends new text to an existing note without overwriting (`/update` or `/append`). |
| `fs.readdirSync(path)` | Lists all note files stored inside the `notes/` directory (`/list`). |
| `fs.unlinkSync(path)` | Permanently deletes a note file from the file system (`/delete`). |
| `fs.statSync(path)` | Extracts metadata such as file size, creation timestamp, and last modified date (`/info`). |

---

### 2. URL (`url`) Module Operations
| Method / API | Description & Usage in Project |
| :--- | :--- |
| `url.parse(req.url, true)` | Legacy URL parsing object to extract `pathname` and `query` parameters (e.g. `query.title`, `query.text`). |
| `new URL(req.url, base)` | WHATWG URL Standard API parsing `searchParams`, `origin`, `protocol`, `pathname`. |
| `url.format(urlObj)` | Reconstructs a full URL string from a parsed URL object. |
| `url.pathToFileURL(path)` | Converts local file system paths into standard `file://` URLs. |
| `url.fileURLToPath(fileUrl)` | Converts a `file://` URL back into a platform-specific absolute file path. |

---

## 🚀 API Endpoints & URL Patterns

| Endpoint Path | Query Parameters | FS Action | Description |
| :--- | :--- | :--- | :--- |
| `GET /` | None | None | Serves the interactive visual web dashboard. |
| `GET /add` | `?title=X&text=Y` | `fs.writeFileSync` | Creates or overwrites note file `X.txt` with content `Y`. |
| `GET /read` | `?title=X` | `fs.readFileSync` | Reads and returns the contents of `X.txt`. |
| `GET /update` | `?title=X&text=Y` | `fs.appendFileSync` | Appends text `Y` to note `X.txt`. |
| `GET /delete` | `?title=X` | `fs.unlinkSync` | Deletes note file `X.txt`. |
| `GET /list` | None | `fs.readdirSync` | Returns list of all notes with file sizes and dates. |
| `GET /info` | `?title=X` | `fs.statSync` | Returns file metadata (size, created/modified times). |
| `GET /parse` | `?targetUrl=...` | None | Analyzes and returns detailed breakdown of URL components. |

---

## 💻 How to Run Locally

1. **Clone the repository** (or navigate to this folder):
   ```bash
   cd URL-Based-Notes-App
   ```

2. **Start the server** (No external `npm install` needed!):
   ```bash
   npm start
   # OR
   node server.js
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to use the interactive dashboard, or test URL queries directly:
   - `http://localhost:3000/add?title=MathNotes&text=Study%20Calculus`
   - `http://localhost:3000/read?title=MathNotes`
   - `http://localhost:3000/list`
   - `http://localhost:3000/parse?targetUrl=http://localhost:3000/add?title=Demo`

---

## 📂 Project Structure

```
URL-Based-Notes-App/
├── server.js          # Core server logic (HTTP + URL parsing + FS CRUD operations)
├── package.json       # Project metadata & start script
├── .gitignore         # Ignores temp/log files
├── README.md          # Lab documentation & usage guide
└── notes/             # Created automatically by fs.mkdirSync to store note .txt files
```
