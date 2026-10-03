import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [form, setForm] = useState({ title: "", author: "", content: "" });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetch(`${API}/posts/${id}`);
        if (!response.ok) throw new Error("Post not found");
        const data = await response.json();
        setPost(data);
        setForm({ title: data.title, author: data.author, content: data.content });
      } catch (e) {
        setError(e.message);
      }
    }
    getPost();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to update post");
      setPost({ ...post, ...form });
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post?")) return;
    try {
      const response = await fetch(`${API}/posts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete post");
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  }

  if (error && !post) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  if (editing) {
    return (
      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2>Edit Post</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input name="title" value={form.title} onChange={handleChange} required />
        <input name="author" value={form.author} onChange={handleChange} required />
        <textarea name="content" rows={8} value={form.content} onChange={handleChange} required />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <small>
        by {post.author} on {new Date(post.createdAt).toLocaleDateString()}
      </small>
      <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setEditing(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
