import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to truncate description
  const truncateDescription = (description, maxLength = 50) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    // Apply price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedStatus, priceRange]);

  // Handle delete product
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle status change
  const handleStatusChange = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const response = await fetch(`/api/product/status/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, status: newStatus } : product
        )
      );
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  // Get unique categories from products
  const categories = ["All", ...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#161A1D]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#660708]">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3F4]">
      {/* Header */}
      <header className="bg-[#161A1D] shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#F5F3F4]">Employee Dashboard</h1>
          <button
            onClick={() => {
              dispatch(employeeLogout());
              navigate("/employeeLogin");
            }}
            className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Title and Add Product Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#161A1D]">All Products</h1>
          <button
            onClick={() => navigate("/addproduct")}
            className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            Add Product
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
              >
                <option value="All">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-[#161A1D] mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-1/2 px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-1/2 px-4 py-2 border border-[#660708] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#660708] focus:border-[#660708]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-200 relative">
                {product.image ? (
                  <img
                    src={`/uploads/${product.image}`}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#161A1D] mb-2">
                  {product.productName}
                </h3>
                <p className="text-sm text-gray-600 mb-2" title={product.description}>
                  {truncateDescription(product.description)}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-[#660708]">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-600">
                    Qty: {product.quantity}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => navigate(`/editproduct/${product._id}`)}
                    className="flex-1 bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStatusChange(product._id, product.status)}
                    className="flex-1 bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                  >
                    {product.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}