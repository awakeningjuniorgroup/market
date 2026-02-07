import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  const { id } = useParams();
  const { checkout } = useSelector((state) => state.checkout);

  // Récupérer la date et l'heure actuelles
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  // if (!checkout || checkout._id !== id) {
  //   return <p>Facture introuvable</p>;
  // }

  const handleDownload = async () => {
    const invoiceElement = document.getElementById("invoice-content");
    const canvas = await html2canvas(invoiceElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`facture-${checkout._id}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded">
      <div id="invoice-content">
        <h2 className="text-2xl font-bold mb-4">Facture</h2>
        <p><strong>Commande ID :</strong> {checkout._id}</p>
        <p><strong>Date :</strong> {date}</p>
        <p><strong>Heure :</strong> {time}</p>

        <h3 className="text-lg mt-6 mb-2">Coordonnées client</h3>
        <p>{checkout.shippingAddress.firstName}</p>
        <p>{checkout.shippingAddress.phone}</p>
        <p>{checkout.shippingAddress.quarter} - {checkout.shippingAddress.city} </p>
        <p>{checkout.shippingAddress.country}</p>

        <h3 className="text-lg mt-6 mb-2">Produits</h3>
        <div className="border-t py-4">
          {checkout.checkoutItems.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>{item.price?.toLocaleString()} FCFA</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>{checkout.totalPrice?.toLocaleString()} FCFA</p>
        </div>

        <p className="mt-6 text-center text-green-600 font-semibold">
          ✅ Paiement à la livraison — Merci pour votre commande !
        </p>
      </div>

      {/* Bouton de téléchargement */}
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
