// CreateOrder.jsx - Bespoke Luxury Checkout Atelier
import React, { useMemo, useState, useEffect } from "react";
import styles from "./CreateOrder.module.css";
import api from "../../../Api/Axios";
import { loadRazorpay } from "../../../Utils/RazorpayUtils";
import { useNavigate } from "react-router-dom";
import { 
  FiX, 
  FiShield, 
  FiLock, 
  FiTruck, 
  FiCreditCard, 
  FiUser, 
  FiMapPin, 
  FiPhone, 
  FiCheckCircle, 
  FiPackage 
} from "react-icons/fi";

const CreateOrder = ({ products = [], onClose }) => {
  const [addressType, setAddressType] = useState("saved");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [user, setUser] = useState({});
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        if (addressType === "saved") {
          setShippingAddress({
            fullName: `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim(),
            phone: storedUser.phone || "",
            addressLine1: storedUser.address?.addressLine1 || "",
            addressLine2: storedUser.address?.addressLine2 || "",
            city: storedUser.address?.city || "",
            state: storedUser.address?.state || "",
            postalCode: storedUser.address?.pinCode || "",
            country: storedUser.address?.country || "India",
          });
        }
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, [addressType]);

  const subtotal = useMemo(() => {
    return products.reduce((total, item) => {
      const price =
        item.product?.salePrice > 0
          ? item.product.salePrice
          : item.product?.price || 0;

      return total + price * item.quantity;
    }, 0);
  }, [products]);

  const shippingCharge = 0;
  const totalAmount = subtotal + shippingCharge;

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleCreateOrder = async (paymentId) => {
    const payload = {
      products: products.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant,
      })),
      paymentId: paymentId,
      addressType,
      shippingAddress: shippingAddress,
      paymentMethod,
    };

    try {
      const response = await api.post("/v1/order/create", payload);
      if (response.status) {
        alert(response.data?.message || "Order placed successfully");
        return true;
      }
    } catch (error) {
      console.log("Failed to create order", error);
      alert(error.response?.data?.message || "Failed to create order");
      return false;
    }
  };

  const CreateOrderInRazorpay = async () => {
    try {
      const payload = { products: products };
      const response = await api.post("/v1/payment/create-order", payload);

      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.log("Failed to handle CreateOrderInRazorpay", error);
      return null;
    }
  };

  const HandlePaymentSuccess = async (paymentData) => {
    try {
      setProcessing(true);
      const response = await api.post("/v1/payment/verify", paymentData);

      if (response.data.success && response.data.data?.isVerified) {
        const result = await HandleCreateOrder(response.data.data.paymentId);
        if (!result) {
          alert("Payment verified. Our team is processing your order.");
          navigate("/contact");
          return;
        }
        alert("Payment verified & bespoke order placed successfully.");
        onClose?.();
        navigate("/order");
      }
    } catch (error) {
      console.log("Failed to verify payment", error);
      alert("Payment verification encountered an issue. Please contact support.");
    } finally {
      setProcessing(false);
    }
  };

  const HandlePlaceOrder = async () => {
    try {
      setProcessing(true);
      const razorpayOrderData = await CreateOrderInRazorpay();
      if (!razorpayOrderData) {
        alert("Failed to initialize transaction with payment gateway.");
        setProcessing(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Failed to load secure Razorpay gateway.");
        setProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        name: "FancyFashion Atelier",
        description: "Bespoke Menswear Order Settlement",
        order_id: razorpayOrderData.razorpayOrderId,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        handler: HandlePaymentSuccess,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#08080a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log("Failed to handle place order", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerBrand}>
            <span className={styles.headerKicker}>HAUTE MENSWEAR</span>
            <div className={styles.headerTitleWrap}>
              <FiLock size={18} className={styles.lockIcon} />
              <h2>Bespoke Atelier Checkout</h2>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close Checkout">
            <FiX size={22} />
          </button>
        </div>

        {/* CONTENT SPLIT */}
        <div className={styles.content}>
          {/* LEFT: ADDRESS & PAYMENT DETAILS */}
          <div className={styles.leftColumn}>
            {/* 1. DELIVERY ADDRESS ATELIER */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div className={styles.stepNum}>01</div>
                <div>
                  <h3>Client Delivery Destination</h3>
                  <p>Choose your registered boutique address or enter bespoke coordinates.</p>
                </div>
              </div>

              <div className={styles.addressTabs}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${addressType === "saved" ? styles.tabActive : ""}`}
                  onClick={() => setAddressType("saved")}
                >
                  <FiUser size={15} />
                  <span>VIP Saved Profile</span>
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${addressType === "custom" ? styles.tabActive : ""}`}
                  onClick={() => setAddressType("custom")}
                >
                  <FiMapPin size={15} />
                  <span>Custom Address</span>
                </button>
              </div>

              {addressType === "saved" ? (
                <div className={styles.savedVipCard}>
                  <div className={styles.vipBadgeRow}>
                    <span className={styles.vipTag}>✦ VERIFIED VIP PROFILE</span>
                    <FiCheckCircle size={16} className={styles.checkIcon} />
                  </div>
                  <h4 className={styles.clientFullName}>
                    {user?.firstName} {user?.lastName}
                  </h4>
                  <p className={styles.clientPhone}>
                    <FiPhone size={13} />
                    <span>{user?.phone || "No phone registered"}</span>
                  </p>
                  <p className={styles.addressLine}>
                    {user?.address?.addressLine1 || "No address line 1"}
                    {user?.address?.addressLine2 ? `, ${user?.address?.addressLine2}` : ""}
                  </p>
                  <p className={styles.addressCity}>
                    {user?.address?.city}, {user?.address?.state} — {user?.address?.pinCode}
                  </p>
                  <p className={styles.addressCountry}>{user?.address?.country || "India"}</p>
                </div>
              ) : (
                <div className={styles.customAddressForm}>
                  <div className={styles.inputRow}>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Recipient Full Name"
                      value={shippingAddress.fullName}
                      onChange={HandleChange}
                      className={styles.inputField}
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number (10 digits)"
                      value={shippingAddress.phone}
                      onChange={HandleChange}
                      className={styles.inputField}
                    />
                  </div>
                  <input
                    type="text"
                    name="addressLine1"
                    placeholder="Street Address / Suite / Apartment"
                    value={shippingAddress.addressLine1}
                    onChange={HandleChange}
                    className={styles.inputField}
                  />
                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Landmark / Locality (Optional)"
                    value={shippingAddress.addressLine2}
                    onChange={HandleChange}
                    className={styles.inputField}
                  />
                  <div className={styles.inputRow}>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={HandleChange}
                      className={styles.inputField}
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={HandleChange}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inputRow}>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="PIN Code"
                      value={shippingAddress.postalCode}
                      onChange={HandleChange}
                      className={styles.inputField}
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={shippingAddress.country}
                      onChange={HandleChange}
                      className={styles.inputField}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. PAYMENT GATEWAY */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div className={styles.stepNum}>02</div>
                <div>
                  <h3>Secure Settlement Method</h3>
                  <p>Encrypted instant payment gateway powered by Razorpay.</p>
                </div>
              </div>

              <div className={styles.paymentMethodCard}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                  />
                  <div className={styles.gatewayInfo}>
                    <span className={styles.gatewayName}>Razorpay VIP Secure Gateway</span>
                    <span className={styles.gatewaySub}>
                      Instant UPI, Credit/Debit Cards, NetBanking, EMI
                    </span>
                  </div>
                  <FiCreditCard size={20} className={styles.payIcon} />
                </label>
              </div>

              <div className={styles.sslBadge}>
                <FiShield size={14} />
                <span>256-Bit SSL Encrypted & Bank-Grade Security</span>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER MANIFEST & SUMMARY */}
          <div className={styles.rightColumn}>
            <div className={styles.manifestCard}>
              <div className={styles.manifestHeader}>
                <h3>Order Manifest ({products.length})</h3>
                <span className={styles.manifestBadge}>ATELIER PIECES</span>
              </div>

              <div className={styles.productsScroll}>
                {products.map((item, index) => {
                  const price =
                    item.product?.salePrice > 0
                      ? item.product.salePrice
                      : item.product?.price || 0;

                  return (
                    <div key={index} className={styles.manifestItem}>
                      <img
                        src={item.product?.coverImage?.url || item.product?.coverImage || ""}
                        alt={item.product?.productName}
                        className={styles.manifestThumb}
                      />
                      <div className={styles.manifestDetails}>
                        <h4>{item.product?.productName}</h4>
                        <div className={styles.manifestSpecs}>
                          <span>Tone: {item.selectedVariant?.color || "N/A"}</span>
                          <span>•</span>
                          <span>Fit: {item.selectedVariant?.size || "N/A"}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <span className={styles.manifestPrice}>
                          ₹{price * item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SUMMARY BREAKDOWN */}
              <div className={styles.summaryBreakdown}>
                <div className={styles.summaryRow}>
                  <span>Subtotal Value</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>VIP Courier & Packaging</span>
                  <span className={styles.complimentaryTag}>COMPLIMENTARY</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total Acquisition</span>
                  <span className={styles.totalValue}>₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="button"
                className={styles.placeOrderBtn}
                onClick={HandlePlaceOrder}
                disabled={processing}
              >
                <FiLock size={16} />
                <span>
                  {processing ? "PREPARING TRANSACTION..." : `CONFIRM & ACQUIRE (₹${totalAmount})`}
                </span>
              </button>

              <div className={styles.guaranteeText}>
                <FiTruck size={14} />
                <span>Delivered in signature protective FancyFashion gift boxing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
