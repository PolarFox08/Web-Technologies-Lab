import { Link } from "react-router-dom";

export default function PostSummary({ post }) {
  const preview =
    post.content.length > 150 ? post.content.slice(0, 150) + "..." : post.content;

  return (
    <div style={{ borderBottom: "1px solid #ddd", padding: "12px 0" }}>
      <h3 style={{ margin: 0 }}>
        <Link to={`/post/${post._id}`}>{post.title}</Link>
      </h3>
      <small>
        by {post.author} on {new Date(post.createdAt).toLocaleDateString()}
      </small>
      <p>{preview}</p>
    </div>
  );
}
