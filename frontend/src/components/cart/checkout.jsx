import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from "react-redux";
import {
  createCheckout,
  createGuestCheckout, // ✅ import du thunk invité
  finalizeCheckout,
  initiateOrangeMoneyPayment,
} from "../../../slice/checkoutSlice";

const OrangeMoneyButton = ({ amount }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.checkout);

  const handlePayment = async () => {
    const res = await dispatch(initiateOrangeMoneyPayment(amount));
    if (res.payload?.payment_url) {
      window.location.href = res.payload.payment_url;
    } else {
      alert(error || "Erreur: pas d'URL de paiement reçue");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600"
    >
      Payer avec Orange Money
    </button>
  );
};

// ✅ Paiement à la livraison
const CashOnDeliveryButton = ({ checkoutId }) => {
  const navigate = useNavigate();

  const handleCOD = () => {
    // Redirection vers la page facture
    navigate(`/invoice/${checkoutId}`);
  };

  return (
    <button
      onClick={handleCOD}
      className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
    >
      Paiement à la livraison
    </button>
  );
};

const Checkout = () => {
  const [checkoutId, setCheckoutId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth); // ✅ récupère l’utilisateur connecté

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    quarter: "",
    city: "",
    region: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    const payload = {
      checkoutItems: cart.products,
      shippingAddress,
      paymentMethod: "pending",
      totalPrice: cart.totalPrice,
    };

    // ✅ Choix entre checkout connecté ou invité
    const res = user
      ? await dispatch(createCheckout(payload))
      : await dispatch(createGuestCheckout(payload));

    if (res.payload?._id) {
      setCheckoutId(res.payload._id);
    }
  };

  const handlePaymentSuccess = async () => {
    await dispatch(finalizeCheckout(checkoutId));
    navigate("/order-confirmation");
  };

  if (loading) return <p>Loading cart…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Section gauche */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          {/* Formulaire coordonnées */}
          {Object.entries(shippingAddress).map(([key, value]) => (
            <div className="mb-4" key={key}>
              <label className="block text-gray-700 capitalize">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, [key]: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}

          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded hover:bg-red-600"
              >
                Vérifier mes informations
              </button>
            ) : (
              <div>
                <div className="text-lg mb-4">Choisissez votre mode de paiement</div>
                <div className="flex flex-col gap-4">
                  <PayPalButton
                    amount={cart.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onError={() => alert("Paiement échoué. Réessayez.")}
                  />
                  <OrangeMoneyButton amount={cart.totalPrice} />
                  <CashOnDeliveryButton checkoutId={checkoutId} />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Section droite */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-start justify-between py-2 border-b">
              <img src={product.image} alt={product.name} className="w-20 h-24 object-cover" />
              <div>
                <h3 className="text-md">{product.name}</h3>
                <p className="text-gray-500">Size {product.size}</p>
                <p className="text-gray-500">Color {product.color}</p>
                <p className="text-gray-500">Quantity {product.quantity}</p>
              </div>
              <p className="text-xl">{product.price?.toLocaleString()} FCFA</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>{cart.totalPrice?.toLocaleString()} FCFA</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
