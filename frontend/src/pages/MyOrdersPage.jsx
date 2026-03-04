import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserCheckouts } from "../../slice/checkoutSlice"; // ⚠️ vérifie le chemin exact

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Récupère les données depuis Redux
  const { checkouts, loading, error } = useSelector((state) => state.checkout);

  useEffect(() => {
    dispatch(fetchUserCheckouts());
  }, [dispatch]);

  const handleRowClick = (checkoutId) => {
    navigate(`/checkout/${checkoutId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Checkouts</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-500">
          <thead>
            <tr>
              <th className="py-2 px-4 sm:py-3">Image</th>
              <th className="py-2 px-4 sm:py-3">Checkout Id</th>
              <th className="py-2 px-4 sm:py-3">Created</th>
              <th className="py-2 px-4 sm:py-3">Shipping Address</th>
              <th className="py-2 px-4 sm:py-3">Items</th>
              <th className="py-2 px-4 sm:py-3">Price</th>
              <th className="py-2 px-4 sm:py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {checkouts && checkouts.length > 0 ? (
              checkouts.map((checkout) => (
                <tr
                  key={checkout._id}
                  onClick={() => handleRowClick(checkout._id)}
                  className="border-b hover:border-gray-50 cursor-pointer"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={checkout.checkoutItems[0]?.image}
                      alt={checkout.checkoutItems[0]?.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{checkout._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(checkout.createdAt).toLocaleDateString()}{" "}
                    {new Date(checkout.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {checkout.shippingAddress
                      ? `${checkout.shippingAddress.city}, ${checkout.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {checkout.checkoutItems.length}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    ${checkout.totalPrice}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`${
                        checkout.isPaid
                          ? "bg-green-300 text-green-800"
                          : "bg-red-100 text-red-700"
                      } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                    >
                      {checkout.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 px-4 text-center text-gray-500"
                >
                  You have no checkouts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
