/**
 * Web Technologies Lab Assignment: URL & FS Modules Demonstration
 * Project: URL-Based Notes Manager Application
 * 
 * Features Demonstrated:
 * - URL Module: url.parse(), WHATWG URL API, searchParams, url.format(), pathToFileURL(), fileURLToPath()
 * - FS Module: fs.mkdirSync(), fs.existsSync(), fs.writeFileSync(), fs.readFileSync(), 
 *              fs.appendFileSync(), fs.unlinkSync(), fs.readdirSync(), fs.statSync()
 */

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const PORT = 3000;
const NOTES_DIR = path.join(__dirname, 'notes');

// --- FS Module Usage: Ensure Storage Directory Exists ---
if (!fs.existsSync(NOTES_DIR)) {
  fs.mkdirSync(NOTES_DIR, { recursive: true });
  console.log(`[FS Module] Created storage directory: ${NOTES_DIR}`);
}

// Helper: Sanitize title to safe filename
function getNotePath(title) {
  const safeTitle = (title || 'untitled').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');
  return path.join(NOTES_DIR, `${safeTitle}.txt`);
}

// HTTP Server handling URL routing & FS operations
const server = http.createServer((req, res) => {
  // --- URL Module Usage 1: Legacy url.parse() ---
  const parsedUrlLegacy = url.parse(req.url, true);
  const pathname = parsedUrlLegacy.pathname;
  const query = parsedUrlLegacy.query; // Key-value object from query parameters

  // --- URL Module Usage 2: WHATWG URL API Standard ---
  const baseUrl = `http://${req.headers.host || 'localhost:3000'}`;
  const parsedUrlWHATWG = new URL(req.url, baseUrl);

  // Set CORS & JSON headers helper
  const sendJSON = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data, null, 2));
  };

  const sendHTML = (statusCode, htmlContent) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlContent);
  };

  // Route Handling
  try {
    // -------------------------------------------------------------
    // 1. HOME ROUTE - Visual Web Dashboard
    // -------------------------------------------------------------
    if (pathname === '/') {
      const html = getDashboardHTML();
      return sendHTML(200, html);
    }

    // -------------------------------------------------------------
    // 2. URL PARSER ROUTE - Demonstrates URL module capabilities
    // -------------------------------------------------------------
    if (pathname === '/parse') {
      const targetUrl = query.targetUrl || `http://localhost:3000/add?title=Math&text=Homework%20due%20Monday`;
      const legacyParsed = url.parse(targetUrl, true);
      const whatwgParsed = new URL(targetUrl.startsWith('http') ? targetUrl : `http://${targetUrl}`);

      // Demonstration of url.format()
      const formattedUrl = url.format(legacyParsed);

      // Demonstration of pathToFileURL and fileURLToPath
      const samplePath = path.join(NOTES_DIR, 'sample.txt');
      const fileUrlObj = url.pathToFileURL(samplePath);
      const reconstructedPath = url.fileURLToPath(fileUrlObj.href);

      return sendJSON(200, {
        status: 'success',
        message: 'URL parsing analysis completed successfully',
        demo: {
          inputUrl: targetUrl,
          legacyUrlParse: {
            protocol: legacyParsed.protocol,
            host: legacyParsed.host,
            pathname: legacyParsed.pathname,
            search: legacyParsed.search,
            query: legacyParsed.query
          },
          whatwgUrlApi: {
            origin: whatwgParsed.origin,
            pathname: whatwgParsed.pathname,
            searchParams: Object.fromEntries(whatwgParsed.searchParams.entries())
          },
          urlFormat: formattedUrl,
          fileUrlConversion: {
            originalPath: samplePath,
            pathToFileURL: fileUrlObj.href,
            fileURLToPath: reconstructedPath
          }
        }
      });
    }

    // -------------------------------------------------------------
    // 3. CREATE / WRITE ROUTE - FS: writeFileSync
    // -------------------------------------------------------------
    if (pathname === '/add' || pathname === '/create') {
      const title = query.title;
      const text = query.text || '';

      if (!title) {
        return sendJSON(400, { status: 'error', message: 'Missing required query parameter: "title"' });
      }

      const filePath = getNotePath(title);
      // FS Operation: Write file (creates new file or overwrites)
      fs.writeFileSync(filePath, text, 'utf8');

      return sendJSON(200, {
        status: 'success',
        operation: 'fs.writeFileSync',
        message: `Note '${title}' created successfully`,
        file: path.basename(filePath),
        textLength: text.length
      });
    }

    // -------------------------------------------------------------
    // 4. READ ROUTE - FS: readFileSync
    // -------------------------------------------------------------
    if (pathname === '/read') {
      const title = query.title;

      if (!title) {
        return sendJSON(400, { status: 'error', message: 'Missing required query parameter: "title"' });
      }

      const filePath = getNotePath(title);

      // FS Operation: Check if file exists
      if (!fs.existsSync(filePath)) {
        return sendJSON(444, { status: 'error', message: `Note '${title}' does not exist.` });
      }

      // FS Operation: Read file content synchronously
      const content = fs.readFileSync(filePath, 'utf8');

      return sendJSON(200, {
        status: 'success',
        operation: 'fs.readFileSync',
        title: title,
        content: content,
        file: path.basename(filePath)
      });
    }

    // -------------------------------------------------------------
    // 5. UPDATE / APPEND ROUTE - FS: appendFileSync
    // -------------------------------------------------------------
    if (pathname === '/update' || pathname === '/append') {
      const title = query.title;
      const text = query.text || '';

      if (!title) {
        return sendJSON(400, { status: 'error', message: 'Missing required query parameter: "title"' });
      }

      const filePath = getNotePath(title);
      const isNew = !fs.existsSync(filePath);

      // FS Operation: Append text to existing file or create if missing
      const appendText = isNew ? text : `\n${text}`;
      fs.appendFileSync(filePath, appendText, 'utf8');

      return sendJSON(200, {
        status: 'success',
        operation: 'fs.appendFileSync',
        message: `Note '${title}' updated (appended content)`,
        file: path.basename(filePath),
        appendedText: text
      });
    }

    // -------------------------------------------------------------
    // 6. DELETE ROUTE - FS: unlinkSync
    // -------------------------------------------------------------
    if (pathname === '/delete' || pathname === '/remove') {
      const title = query.title;

      if (!title) {
        return sendJSON(400, { status: 'error', message: 'Missing required query parameter: "title"' });
      }

      const filePath = getNotePath(title);

      if (!fs.existsSync(filePath)) {
        return sendJSON(404, { status: 'error', message: `Note '${title}' does not exist.` });
      }

      // FS Operation: Unlink (Delete) file
      fs.unlinkSync(filePath);

      return sendJSON(200, {
        status: 'success',
        operation: 'fs.unlinkSync',
        message: `Note '${title}' deleted successfully`
      });
    }

    // -------------------------------------------------------------
    // 7. LIST ROUTE - FS: readdirSync & statSync
    // -------------------------------------------------------------
    if (pathname === '/list') {
      // FS Operation: Read directory contents
      const files = fs.readdirSync(NOTES_DIR);

      const notesList = files.map((fileName) => {
        const fullPath = path.join(NOTES_DIR, fileName);
        // FS Operation: Get file metadata/stats
        const stats = fs.statSync(fullPath);

        return {
          filename: fileName,
          title: fileName.replace(/\.txt$/, ''),
          sizeBytes: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });

      return sendJSON(200, {
        status: 'success',
        operation: 'fs.readdirSync & fs.statSync',
        count: notesList.length,
        notes: notesList
      });
    }

    // -------------------------------------------------------------
    // 8. INFO / METADATA ROUTE - FS: statSync
    // -------------------------------------------------------------
    if (pathname === '/info') {
      const title = query.title;

      if (!title) {
        return sendJSON(400, { status: 'error', message: 'Missing required query parameter: "title"' });
      }

      const filePath = getNotePath(title);

      if (!fs.existsSync(filePath)) {
        return sendJSON(404, { status: 'error', message: `Note '${title}' does not exist.` });
      }

      // FS Operation: Detailed stats
      const stats = fs.statSync(filePath);

      return sendJSON(200, {
        status: 'success',
        operation: 'fs.statSync',
        title: title,
        fileDetails: {
          filename: path.basename(filePath),
          sizeBytes: stats.size,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory(),
          created: stats.birthtime,
          lastModified: stats.mtime,
          lastAccessed: stats.atime
        }
      });
    }

    // 404 Handler for unrecognized paths
    sendJSON(404, {
      status: 'error',
      message: `Route '${pathname}' not found. Available endpoints: /, /add, /read, /update, /delete, /list, /info, /parse`
    });

  } catch (err) {
    console.error(`[Server Error] ${err.message}`);
    sendJSON(500, { status: 'error', message: err.message });
  }
});

// HTML Dashboard Generator for visually demonstrating operations
function getDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>URL & FS Modules Notes App Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #141c2e;
      --card-border: #1e293b;
      --accent: #38bdf8;
      --accent-hover: #0284c7;
      --purple: #a855f7;
      --green: #22c55e;
      --red: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .badge {
      background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(168,85,247,0.1));
      border: 1px solid rgba(56,189,248,0.3);
      color: var(--accent);
      padding: 0.3rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    h1 {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #fff, var(--text-muted));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .card:hover {
      border-color: rgba(56, 189, 248, 0.4);
    }

    .card h2 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--accent);
    }

    label {
      display: block;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.3rem;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 0.65rem 0.8rem;
      background: #0f172a;
      border: 1px solid var(--card-border);
      border-radius: 6px;
      color: #fff;
      font-family: inherit;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      transition: border-color 0.2s;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--accent);
    }

    textarea { resize: vertical; min-height: 80px; }

    .btn-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    button {
      padding: 0.65rem 1.2rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
    }

    button:active { transform: scale(0.98); }

    .btn-primary { background: var(--accent); color: #000; }
    .btn-green { background: var(--green); color: #000; }
    .btn-purple { background: var(--purple); color: #fff; }
    .btn-red { background: var(--red); color: #fff; }
    .btn-secondary { background: #334155; color: #fff; }

    .response-box {
      margin-top: 1.5rem;
      background: #090d16;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 1rem;
    }

    .response-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .response-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #a5f3fc;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 250px;
      overflow-y: auto;
    }

    .url-demo-link {
      color: var(--accent);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      text-decoration: none;
      background: rgba(56,189,248,0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 0.4rem;
    }

    .url-demo-link:hover { text-decoration: underline; }

    .methods-tags {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      margin-bottom: 0.8rem;
    }

    .tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      background: #1e293b;
      color: var(--purple);
      border: 1px solid rgba(168,85,247,0.3);
    }

    .notes-list-container {
      margin-top: 0.8rem;
    }

    .note-item {
      background: #0f172a;
      border: 1px solid var(--card-border);
      padding: 0.8rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .note-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
    .note-meta { font-size: 0.75rem; color: var(--text-muted); }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <div>
        <h1>URL & FS Modules Notes App</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Web Technologies Lab - Node.js Core Modules Demonstration</p>
      </div>
      <div class="badge">Node.js HTTP + FS + URL</div>
    </header>

    <div class="grid">
      
      <!-- CARD 1: Quick URL Query Actions -->
      <div class="card">
        <h2>⚡ Quick URL API Triggers</h2>
        <div class="methods-tags">
          <span class="tag">url.parse()</span>
          <span class="tag">req.url</span>
          <span class="tag">query.title</span>
        </div>
        <p style="font-size:0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          Click direct URL triggers to test query parameter parsing:
        </p>
        
        <div>
          <a class="url-demo-link" href="#" onclick="executeUrl('/add?title=LabTasks&text=Complete%20Web%20Tech%20Assignment')">/add?title=LabTasks&text=...</a><br>
          <a class="url-demo-link" href="#" onclick="executeUrl('/read?title=LabTasks')">/read?title=LabTasks</a><br>
          <a class="url-demo-link" href="#" onclick="executeUrl('/update?title=LabTasks&text=%0ASubmit%20on%20GitHub')">/update?title=LabTasks&text=...</a><br>
          <a class="url-demo-link" href="#" onclick="executeUrl('/info?title=LabTasks')">/info?title=LabTasks</a><br>
          <a class="url-demo-link" href="#" onclick="executeUrl('/list')">/list (fs.readdirSync)</a><br>
          <a class="url-demo-link" href="#" onclick="executeUrl('/delete?title=LabTasks')">/delete?title=LabTasks</a>
        </div>
      </div>

      <!-- CARD 2: Interactive Note Manager Form -->
      <div class="card">
        <h2>📝 Manage Note (FS Ops)</h2>
        <div class="methods-tags">
          <span class="tag">fs.writeFileSync</span>
          <span class="tag">fs.readFileSync</span>
          <span class="tag">fs.appendFileSync</span>
          <span class="tag">fs.unlinkSync</span>
        </div>

        <form id="noteForm" onsubmit="return false;">
          <label>Note Title</label>
          <input type="text" id="noteTitle" placeholder="e.g. Science_Notes" value="Lab_Demo">

          <label>Note Content / Text to Append</label>
          <textarea id="noteText" placeholder="Write content here...">Node.js fs module provides synchronous and asynchronous file interaction methods.</textarea>

          <div class="btn-group">
            <button type="button" class="btn-primary" onclick="actionAdd()">Create (write)</button>
            <button type="button" class="btn-green" onclick="actionRead()">Read</button>
            <button type="button" class="btn-purple" onclick="actionUpdate()">Append</button>
            <button type="button" class="btn-red" onclick="actionDelete()">Delete</button>
          </div>
        </form>
      </div>

      <!-- CARD 3: URL Parser Inspector -->
      <div class="card">
        <h2>🔍 URL Inspector</h2>
        <div class="methods-tags">
          <span class="tag">url.parse()</span>
          <span class="tag">new URL()</span>
          <span class="tag">url.format()</span>
          <span class="tag">pathToFileURL()</span>
        </div>

        <label>URL String to Inspect</label>
        <input type="text" id="targetUrlInput" value="http://localhost:3000/add?title=Math&text=Calculus%20Exam">

        <div class="btn-group">
          <button type="button" class="btn-purple" onclick="inspectUrl()">Analyze URL</button>
          <button type="button" class="btn-secondary" onclick="fetchNotesList()">Refresh Notes List</button>
        </div>
      </div>

    </div>

    <!-- Active Notes List Display -->
    <div class="card" style="margin-top: 1.5rem;">
      <h2>📁 Saved Notes Directory (FS: readdirSync)</h2>
      <div id="notesList" class="notes-list-container">
        <p style="color: var(--text-muted); font-size: 0.85rem;">Click 'Refresh Notes List' or execute an action above...</p>
      </div>
    </div>

    <!-- Output / Response Inspector -->
    <div class="response-box">
      <div class="response-header">
        <span class="response-title">API Response & FS / URL Output Log</span>
        <span id="statusCode" style="font-size: 0.8rem; font-family: monospace; color: var(--accent);">Status: Ready</span>
      </div>
      <pre id="output">{ "message": "Select an action above to see response details..." }</pre>
    </div>

  </div>

  <script>
    async function executeUrl(endpoint) {
      const output = document.getElementById('output');
      const statusEl = document.getElementById('statusCode');
      statusEl.textContent = 'Executing ' + endpoint + ' ...';
      
      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        statusEl.textContent = 'Status: ' + res.status + ' (' + data.status + ')';
        output.textContent = JSON.stringify(data, null, 2);
        fetchNotesList();
      } catch (err) {
        statusEl.textContent = 'Error';
        output.textContent = JSON.stringify({ error: err.message }, null, 2);
      }
    }

    function getFormValues() {
      const title = encodeURIComponent(document.getElementById('noteTitle').value.trim());
      const text = encodeURIComponent(document.getElementById('noteText').value.trim());
      return { title, text };
    }

    function actionAdd() {
      const { title, text } = getFormValues();
      executeUrl('/add?title=' + title + '&text=' + text);
    }

    function actionRead() {
      const { title } = getFormValues();
      executeUrl('/read?title=' + title);
    }

    function actionUpdate() {
      const { title, text } = getFormValues();
      executeUrl('/update?title=' + title + '&text=' + text);
    }

    function actionDelete() {
      const { title } = getFormValues();
      executeUrl('/delete?title=' + title);
    }

    function inspectUrl() {
      const targetUrl = encodeURIComponent(document.getElementById('targetUrlInput').value);
      executeUrl('/parse?targetUrl=' + targetUrl);
    }

    async function fetchNotesList() {
      const notesListEl = document.getElementById('notesList');
      try {
        const res = await fetch('/list');
        const data = await res.json();
        if (data.notes && data.notes.length > 0) {
          notesListEl.innerHTML = data.notes.map(n => \`
            <div class="note-item">
              <div>
                <div class="note-name">\${n.title} (.txt)</div>
                <div class="note-meta">Size: \${n.sizeBytes} bytes | Modified: \${new Date(n.modified).toLocaleString()}</div>
              </div>
              <div style="display:flex; gap:0.4rem;">
                <button class="btn-green" style="padding: 0.3rem 0.6rem; font-size:0.75rem;" onclick="executeUrl('/read?title=\${encodeURIComponent(n.title)}')">Read</button>
                <button class="btn-red" style="padding: 0.3rem 0.6rem; font-size:0.75rem;" onclick="executeUrl('/delete?title=\${encodeURIComponent(n.title)}')">Delete</button>
              </div>
            </div>
          \`).join('');
        } else {
          notesListEl.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No note files found in directory.</p>';
        }
      } catch (err) {
        notesListEl.innerHTML = '<p style="color: var(--red); font-size: 0.85rem;">Failed to list notes.</p>';
      }
    }

    // Initial load
    fetchNotesList();
  </script>
</body>
</html>`;
}

// Start Server
server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 URL & FS Modules Notes Server running at: http://localhost:${PORT}`);
  console.log(`📁 Local Notes Directory: ${NOTES_DIR}`);
  console.log(`================================================================`);
});
