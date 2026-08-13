import { useState } from 'react';

const initialProducts = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99, quantity: 12, emoji: '🎧' },
  { id: 2, name: 'Smartphone 12 Pro', category: 'Electronics', price: 799, quantity: 0, emoji: '📱' },
  { id: 3, name: 'Cotton T-Shirt', category: 'Clothing', price: 25, quantity: 45, emoji: '👕' },
  { id: 4, name: 'Denim Jeans', category: 'Clothing', price: 60, quantity: 0, emoji: '👖' },
  { id: 5, name: 'Organic Apples (1kg)', category: 'Grocery', price: 5, quantity: 80, emoji: '🍎' },
  { id: 6, name: 'Fresh Whole Milk', category: 'Grocery', price: 4, quantity: 25, emoji: '🥛' },
  { id: 7, name: 'Gaming Mouse', category: 'Electronics', price: 45, quantity: 8, emoji: '🖱️' },
  { id: 8, name: 'Winter Jacket', category: 'Clothing', price: 120, quantity: 3, emoji: '🧥' },
  { id: 9, name: 'Dark Chocolate', category: 'Grocery', price: 3, quantity: 0, emoji: '🍫' }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMaxPrice(1000);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Online Shopping Catalog</h1>
        <p>Explore products with dynamic search and filtering</p>
      </header>

      <section className="filter-card">
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="search">Search Product</label>
            <input
              id="search"
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Grocery">Grocery</option>
            </select>
          </div>

          <div className="filter-group price-range-wrapper">
            <div className="price-header">
              <label htmlFor="price">Max Price</label>
              <span className="price-value">${maxPrice}</span>
            </div>
            <input
              id="price"
              type="range"
              min="0"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>
      </section>

      <div className="results-bar">
        <p className="product-count">
          Showing <span className="count-number">{filteredProducts.length}</span> of {initialProducts.length} Products
        </p>
        {(searchTerm || selectedCategory !== 'All' || maxPrice < 1000) && (
          <button onClick={handleReset} className="reset-btn">
            Reset Filters
          </button>
        )}
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div>
                <div className="product-emoji">{product.emoji}</div>
                <span className="category-tag">{product.category}</span>
                <h3>{product.name}</h3>
              </div>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                {product.quantity > 0 ? (
                  <span className="badge-in-stock">In Stock ({product.quantity})</span>
                ) : (
                  <span className="badge-out-of-stock">Out of Stock</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try adjusting your search query or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
