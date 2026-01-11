import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'


const OrderDetailsPage = () => {
    const { id } = useParams();
    const [OrderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const mockOrderDetails = {
            _id: id,
            createdAt: new Date(),
            isPaid: true,
            isDelivered: false,
            paymentMethod: "PayPal",
            shippingMethod: "standard",
            shippingcity:  "New York", 
             shippingcountry:  "USA", 
            orderItems: [
                {
                    productId: "1",
                    name: "Jacket",
                    price: 120,
                    quantity: 1,
                    image: "https://picsum.photos/150?random=1",
                },
                 {
                    productId: "2",
                    name: "sweater",
                    price: 120,
                    quantity: 10,
                    image: "https://picsum.photos/150?random=2",
                },
                 {
                    productId: "3",
                    name: "jacket",
                    price: 120,
                    quantity: 5,
                    image: "https://picsum.photos/150?random=4",
                },
            ]
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrderDetails(mockOrderDetails);
    }, [id])
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
        {!OrderDetails ? (
            <p>No Order details found</p>
        ) : (
            <div className="p-4 sm:p-6 rounded-lg border">
                <div className="flex flex-col sm:flex-row justify-between mb-8">
                    <div>
                        <h3 className="text-lg md:text-xl font-semibold">
                            Order ID: #{OrderDetails._id}
                        </h3>
                        <p className="text-gray-600">
                            {new Date(OrderDetails.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                        <span 
                        className={`${
                            OrderDetails.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            } px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                                {OrderDetails.isPaid ? "Approved" : "Pending"}
                            </span>
                    </div>
                </div>
                {/* customer, payment, shipping info  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
                        <p>Payment Method: {OrderDetails.paymentMethod}</p>
                        <p>Status: {OrderDetails.isPaid ? "paid" : "Unpaid"}</p>
                    </div>
                     <div>
                        <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
                        <p>Shipping Method: {OrderDetails.shippingMethod}</p>
                        <p>Address:{" "}
                             {OrderDetails.shippingcity} {OrderDetails.shippingcountry}</p>
                    </div>
                </div>
                {/* producr list  */}
                <div className="overflow-x-auto">
                    <h4 className="text-lg font-semibold mb-4">Products</h4>
                    <table className="min-w-full text-gray-600 mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Unit Price</th>
                                <th className="py-2 px-4">Quantity</th>
                                <th className="py-2 px-4">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {OrderDetails.orderItems.map((item) => (
                                <tr className="border-b" key={item.productId}>
                                    <td className="py-2 px-4 flex items-center">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg mr-4" />
                                        <Link to={`/product/${item.productId}`} className="text-blue-500 hover:underline">
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td className="py-2 py-4">${item.price}</td>
                                    <td className="py-2 py-4">${item.quantity}</td>
                                    <td className="py-2 py-4">${item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Back to orders Link  */}

                <Link to="my-orders" className="text-blue-500 hover:underline">
                            Back to my orders
                </Link>
            </div>
        )}
    </div>
  )
}

export default OrderDetailsPage
