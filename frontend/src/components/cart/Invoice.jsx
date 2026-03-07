import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { fetchCheckoutById } from "../../slice/checkoutSlice";

const Invoice = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { checkoutDetails, loading, error } = useSelector((state) => state.checkout);

  useEffect(() => {
    dispatch(fetchCheckoutById(id));
  }, [dispatch, id]);

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const handleDownload = async () => {
    if (!checkoutDetails) return;
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

    pdf.save(`facture-${checkoutDetails._id}.pdf`);
  };

  if (loading) return <p>Chargement de la facture...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!checkoutDetails) return <p>Facture introuvable</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded">
      <div id="invoice-content">
        <h2 className="text-2xl font-bold mb-4">Bill</h2>
        <p><strong>Commande ID :</strong> {checkoutDetails._id}</p>
        <p><strong>Date :</strong> {date}</p>
        <p><strong>Time :</strong> {time}</p>

        <h3 className="text-lg mt-6 mb-2">Coordonnate</h3>
        <p>Firstname: {checkoutDetails.shippingAddress?.firstName}</p>
        <p>Phone: {checkoutDetails.shippingAddress?.phone}</p>
        <p>Location: {checkoutDetails.shippingAddress?.quarter} - {checkoutDetails.shippingAddress?.city}</p>
        <p>Country: {checkoutDetails.shippingAddress?.country}</p>

        <h3 className="text-lg mt-6 mb-2">Products</h3>
        <div className="border-t py-4">
          {checkoutDetails.checkoutItems?.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>{item.price?.toLocaleString()} FCFA</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Shipping fee</p>
          <p>{checkoutDetails.shippingAddress?.shippingFee?.toLocaleString()} FCFA</p>
        </div>

        <div className="flex justify-between items-center text-lg mt-2 border-t pt-4 font-bold">
          <p>Total</p>
          <p>
            {(checkoutDetails.totalPrice + (checkoutDetails.shippingAddress?.shippingFee || 0)).toLocaleString()} FCFA
          </p>
        </div>

        <p className="mt-6 text-center text-green-600 font-semibold">
          ✅ Thanks for order!
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
        Télécharger la facture en PDF
      </button>
    </div>
  );
};

export default Invoice;
