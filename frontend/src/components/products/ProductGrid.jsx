import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            {/* Image avec ratio fixe */}
            <div className="w-full aspect-[3/4] mb-4 overflow-hidden rounded-lg">
              <img
                src={product.images?.[0]?.url}
                alt={product.images?.[0]?.alText || product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h3 className="text-sm font-semibold mb-2 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-gray-700 font-medium text-sm tracking-tight">
              {product.price} FCFA
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
