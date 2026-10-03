import { useEffect, useState } from "react";
import PostSummary from "../components/PostSummary.jsx";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch(`${API}/posts`);
        if (!response.ok) throw new Error("Failed to load posts");
        setPosts(await response.json());
      } catch (e) {
        setError(e.message);
      }
    }
    getPosts();
  }, []);

  return (
    <div>
      <h2>All Posts</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <PostSummary key={post._id} post={post} />
      ))}
    </div>
  );
}
