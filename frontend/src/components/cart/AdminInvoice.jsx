import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { fetchOrderById } from "../../../slice/adminOrderSlice"; // ⚠️ thunk à créer

const AdminInvoice = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchOrderById(id)); // ⚠️ appelle /api/orders/:id
  }, [dispatch, id]);

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const handleDownload = async () => {
    if (!orderDetails) return;
    const invoiceElement = document.getElementById("invoice-content");
    const canvas = await html2canvas(invoiceElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`facture-${orderDetails._id}.pdf`);
  };

  if (loading) return <p>Chargement de la facture...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!orderDetails) return <p>Facture introuvable</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded">
      <div id="invoice-content">
        <h2 className="text-2xl font-bold mb-4">Facture Admin</h2>
        <p><strong>Order ID :</strong> {orderDetails._id}</p>
        <p><strong>Date :</strong> {date}</p>
        <p><strong>Time :</strong> {time}</p>

        <h3 className="text-lg mt-6 mb-2">Client</h3>
        <p>Name: {orderDetails.user?.name || orderDetails.shippingAddress?.firstName || "Guest"}</p>
        <p>Phone: {orderDetails.shippingAddress?.phone}</p>
        <p>Location: {orderDetails.shippingAddress?.quarter} - {orderDetails.shippingAddress?.city}</p>
        <p>Country: {orderDetails.shippingAddress?.country}</p>

        <h3 className="text-lg mt-6 mb-2">Produits</h3>
        <div className="border-t py-4">
          {orderDetails.orderItems?.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>{item.price?.toLocaleString()} FCFA</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Shipping fee</p>
          <p>{orderDetails.shippingAddress?.shippingFee?.toLocaleString()} FCFA</p>
        </div>

        <div className="flex justify-between items-center text-lg mt-2 border-t pt-4 font-bold">
          <p>Total</p>
          <p>
            {(orderDetails.totalPrice + (orderDetails.shippingAddress?.shippingFee || 0)).toLocaleString()} FCFA
          </p>
        </div>

        <p className="mt-6 text-center text-green-600 font-semibold">
          ✅ Thanks for your order !
        </p>

        <div className="mt-6 flex justify-center">
          <QRCodeCanvas 
            value="https://kams-market12.onrender.com" 
            size={128} 
            bgColor="#ffffff" 
            fgColor="#000000" 
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  );
};

export default AdminInvoice;
