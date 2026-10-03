import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Post from "./pages/Post.jsx";
import Archive from "./pages/Archive.jsx";

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <Link to="/">Home</Link>
        <Link to="/archive">Archive</Link>
        <Link to="/create">New post</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/create" element={<Create />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
    </div>
  );
}
