import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserCheckouts, syncOrders } from "../../slice/checkoutSlice";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { checkouts, loading, error } = useSelector((state) => state.checkout);

  useEffect(() => {
    dispatch(fetchUserCheckouts());
    dispatch(syncOrders());
  }, [dispatch]);

  const handleRowClick = (checkoutId) => {
    navigate(`/checkout/${checkoutId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-x-auto">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Order Id</th>
              <th className="py-2 px-4">Owner</th>
              <th className="py-2 px-4">Created</th>
              <th className="py-2 px-4">Shipping Address</th>
              <th className="py-2 px-4">Items</th>
              <th className="py-2 px-4">Payment Method</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Details</th> {/* ✅ nouvelle colonne */}
            </tr>
          </thead>
          <tbody>
            {checkouts && checkouts.length > 0 ? (
              checkouts.map((checkout) => (
                <tr
                  key={checkout._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-2 px-2">
                    <img
                      src={checkout.checkoutItems[0]?.image}
                      alt={checkout.checkoutItems[0]?.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-2 font-medium text-gray-900">
                    #{checkout._id}
                  </td>
                  <td className="py-2 px-2">
                    {checkout.owner
                      ? checkout.owner.type === "user"
                        ? `User: ${checkout.owner.id}`
                        : `Guest: ${checkout.owner.id}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-2">
                    {new Date(checkout.createdAt).toLocaleDateString()}{" "}
                    {new Date(checkout.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-2">
                    {checkout.shippingAddress
                      ? `${checkout.shippingAddress.quarter}, ${checkout.shippingAddress.city}, ${checkout.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-2">
                    {checkout.checkoutItems.length} items
                  </td>
                  <td className="py-2 px-2">{checkout.paymentMethod}</td>
                  <td className="py-2 px-2 font-semibold">
                    {checkout.totalPrice.toLocaleString()} FCFA
                  </td>
                  <td className="py-2 px-2">
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
                  <td className="py-2 px-2">
                    <button
                      onClick={() => handleRowClick(checkout._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="py-4 px-4 text-center text-gray-500"
                >
                  You have no orders
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
