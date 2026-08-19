function PageContent({ title, category, description, highlights, icon }) {
  return (
    <div className="page-card">
      <div className="page-header">
        <span className="page-icon">{icon || '🏛️'}</span>
        <div>
          {category && <span className="category-badge">{category}</span>}
          <h2>{title}</h2>
        </div>
      </div>

      <p className="page-description">{description}</p>

      {highlights && highlights.length > 0 && (
        <div className="highlights-section">
          <h3>Key Information & Highlights</h3>
          <ul className="highlights-list">
            {highlights.map((item, index) => (
              <li key={index} className="highlight-item">
                <span className="bullet">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PageContent;
