import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Archive() {
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
      <h2>Archive</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            {new Date(post.createdAt).toLocaleDateString()} –{" "}
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
