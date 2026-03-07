import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '../../../slice/adminOrderSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = async (orderId, status) => {
    await dispatch(updateOrderStatus({ id: orderId, status }));
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await dispatch(deleteOrder(orderId));
    }
  };

  const handleDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`); // ✅ route vers la facture/détails
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-full mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left uppercase text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4">Country</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Quarter</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
              <th className="py-3 px-4">Details</th> {/* ✅ nouvelle colonne */}
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">
                    {order.user
                      ? order.user.name
                      : order.shippingAddress?.firstName || "Guest"}
                  </td>
                  <td className="p-4">{order.shippingAddress?.city || "-"}</td>
                  <td className="p-4">{order.shippingAddress?.country || "-"}</td>
                  <td className="p-4">{order.shippingAddress?.phone || "-"}</td>
                  <td className="p-4">{order.shippingAddress?.quarter || "-"}</td>
                  <td className="p-4 font-semibold">
                    FCFA {order.totalPrice?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status || "Processing"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                      focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Mark as Delivered
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDetails(order._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
