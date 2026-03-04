import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCheckoutDetails } from "../../slice/checkoutSlice"; // ⚠️ vérifie le chemin exact

const CheckoutDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { checkoutDetails, loading, error } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (id) {
      dispatch(fetchCheckoutDetails(id));
    }
  }, [dispatch, id]);

  if (loading) return <p>Loading checkout details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!checkoutDetails) return <p>No checkout found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout #{checkoutDetails._id}</h2>

      {/* Shipping Address */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <p>{checkoutDetails.shippingAddress.firstname}</p>
        <p>{checkoutDetails.shippingAddress.phone}</p>
        <p>
          {checkoutDetails.shippingAddress.quarter}, {checkoutDetails.shippingAddress.city},{" "}
          {checkoutDetails.shippingAddress.country}
        </p>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        <table className="min-w-full text-left text-gray-500">
          <thead>
            <tr>
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {checkoutDetails.checkoutItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.quantity}</td>
                <td className="py-2 px-4">${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment & Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment</h3>
        <p>Method: {checkoutDetails.paymentMethod}</p>
        <p>
          Status:{" "}
          <span
            className={`${
              checkoutDetails.isPaid ? "text-green-600" : "text-red-600"
            } font-bold`}
          >
            {checkoutDetails.isPaid ? "Paid" : "Pending"}
          </span>
        </p>
      </div>

      {/* Total */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Total</h3>
        <p className="text-xl font-bold">${checkoutDetails.totalPrice}</p>
      </div>
    </div>
  );
};

export default CheckoutDetailsPage;
