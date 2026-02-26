import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../../slice/productsSlice";
import { addToCart } from "../../../slice/cartSlice";
import { createCheckout, createGuestCheckout } from "../../../slice/checkoutSlice";

import tinycolor from "tinycolor2";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [mainImage, setMainImage] = useState("");

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };
  
const navigate = useNavigate();
const handleBuyNow = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsButtonDisabled(true);
   console.log("👉 handleBuyNow déclenché");

  if (!selectedSize || !selectedColor) {
    toast.error("Please select a size and a color before buying.", { duration: 1000 });
    setIsButtonDisabled(false);
    return;
  }

  const payload = {
    checkoutItems: [
      {
        productId: productFetchId,
        name: selectedProduct?.name,
        image: mainImage,
        price: selectedProduct?.discountPrice || selectedProduct?.price,
        quantity,
        size: selectedSize,
        color: selectedColor,
      },
    ],
    shippingAddress: {
      firstName: "*",
      phone: "*",
      quarter: "*",
      city: "*",
      country: "*"
    },
    paymentMethod: user?._id ? "pending" : "COD",
    totalPrice: (selectedProduct?.discountPrice || selectedProduct?.price) * quantity,
  };
  console.log("📦 Payload envoyé:", payload);

  try {
    const action = user?._id ? createCheckout(payload) : createGuestCheckout(payload);
    console.log("🚀 Dispatch action:", action);
    await dispatch(action).unwrap();
      console.log("✅ Checkout créé:", result);
    toast.success("Checkout created!", { duration: 1000 });
    navigate("/Checkout"); // ✅ redirection uniquement après succès
  } catch (err) {
    toast.error(err.message || "Failed to create checkout", { duration: 1000 });
  } finally {
    setIsButtonDisabled(false);
  }
};




const handleAddToCart = (e) => {
  e.preventDefault();
  e?.stopPropagation();

  if (!selectedSize || !selectedColor) {
    toast.error("Please select a size and a color before adding to cart.", { duration: 1000 });
    return;
  }

  setIsButtonDisabled(true);

  dispatch(
    addToCart({
      productId: productFetchId,
      quantity,
      size: selectedSize,
      color: selectedColor,
      guestId,
      userId: user?._id,
    })
  )
    .then(() => {
      toast.success("Product added to cart!", { duration: 1000 });
    })
    .catch(() => {
      toast.error("Failed to add product.", { duration: 1000 });
    })
    .finally(() => {
      setIsButtonDisabled(false);
    });
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const colorsArray = Array.isArray(selectedProduct?.colors)
    ? selectedProduct.colors
    : selectedProduct?.color
    ? [selectedProduct.color]
    : [];

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct?.images?.map((image, index) => (
                <img
                  key={image.url || index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            <div className="md:w-1/2 mb-4">
              {mainImage && (
                <img
                  src={mainImage}
                  alt="Main product"
                  className="w-full h-auto object-cover rounded-lg"
                />
              )}
            </div>

            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct?.name}
              </h1>

              {selectedProduct?.discountPrice ? (
                <>
                  <p className="text-lg text-gray-600 mb-1 line-through">
                    {selectedProduct?.discountPrice}   FCFA
                  </p>
                  <p className="text-xl text-red-600 mb-2">
                    {selectedProduct?.price}   FCFA
                  </p>
                </>
              ) : (
                <p className="text-xl text-gray-500 mb-2">
                  ${selectedProduct?.price}
                </p>
              )}

              <p className="text-gray-700">Description:</p>
              <div>{selectedProduct?.description}</div>

              <div className="mb-4 mt-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct?.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 mt-4">
                <p className="text-gray-700">Colors:</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  {colorsArray.length > 0 ? (
                    colorsArray.map((color, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <button
                          className={`w-8 h-8 rounded-full border ${
                            selectedColor === color
                              ? "border-4 border-red-500"
                              : "border-gray-300"
                          }`}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            backgroundColor: tinycolor(color).isValid()
                              ? tinycolor(color).toHexString()
                              : "#ccc",
                          }}
                        ></button>
                        <span className="text-xs text-gray-600 mt-1">
                          {color}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No colors available</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                type="button"
                id="addToCartButton" 
                name="addToCartButton"
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "Add to Cart"}
              </button>
            <div>
               <button
                   type="button"
                 id="buyNowButton" 
                 name="buyNowButton"
                   onClick={handleBuyNow}
                    className={`bg-red-600 text-white py-2 px-6 rounded w-full mb-4 ${
                      isButtonDisabled ? "cursor-not-allowed opacity-50 pointer-events-none" : "hover:bg-red-700"
                    }`}
                  >
                    Buy Now
               </button>

            </div>


              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct?.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct?.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
