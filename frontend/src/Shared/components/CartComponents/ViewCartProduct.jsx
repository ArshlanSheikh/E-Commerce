// ViewCartProduct.jsx - Editorial Haute Couture Atelier Bag Drawer
import React, { useEffect, useState } from "react";
import api from "../../../Api/Axios";
import styles from "./ViewCartProduct.module.css";
import CreateOrder from "../Order/CreateOrder";
import { 
  FiX, 
  FiShoppingBag, 
  FiTrash2, 
  FiCreditCard, 
  FiMinus, 
  FiPlus, 
  FiAlertTriangle, 
  FiShield, 
  FiTruck,
  FiArrowRight
} from "react-icons/fi";

const FREE_SHIPPING_THRESHOLD = 999;

const ViewCartProduct = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removeItem, setRemoveItem] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState(null);

  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    GetCartProducts();
  }, []);

  const GetCartProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/v1/cart");

      if (data.success) {
        setCartItems(data.data?.items || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch bag items");
    } finally {
      setLoading(false);
    }
  };

  const validItems = cartItems.filter(
    (item) => item?.productId && typeof item.productId === "object"
  );
  const unavailableCount = cartItems.length - validItems.length;

  const getSelectedVariant = (item) => {
    const variants = item?.productId?.variants || [];
    return variants.find(
      (variant) => variant?._id?.toString() === item?.variantId?.toString()
    );
  };

  const HandleRemove = async (variantId) => {
    try {
      setRemoving(true);
      const { data } = await api.delete(`/v1/cart/remove/${variantId}`);

      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
        setRemoveItem(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item");
    } finally {
      setRemoving(false);
    }
  };

  const HandleUpdateQuantity = async (variantId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      setUpdatingQuantity(variantId);
      const { data } = await api.put(`/v1/cart/update/${variantId}`, {
        quantity: newQuantity,
      });

      if (data.success) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.variantId === variantId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingQuantity(null);
    }
  };

  const HandleBuyNow = (item) => {
    if (!item?.productId) return;

    const selectedVariant = getSelectedVariant(item);

    setOrderProducts([
      {
        product: item.productId,
        quantity: item.quantity,
        selectedVariant,
      },
    ]);

    setCreateOrderOpen(true);
  };

  const HandleBuyAll = () => {
    const products = validItems.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      selectedVariant: getSelectedVariant(item),
    }));

    setOrderProducts(products);
    setCreateOrderOpen(true);
  };

  const totalProducts = validItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const totalAmount = validItems.reduce((total, item) => {
    const price = item.productId?.salePrice ?? item.productId?.price ?? 0;
    return total + price * (item.quantity || 0);
  }, 0);

  const totalSavings = validItems.reduce((total, item) => {
    const original = item.productId?.price ?? 0;
    const sale = item.productId?.salePrice ?? original;
    return total + (original - sale) * (item.quantity || 0);
  }, 0);

  const progressToFreeShipping = Math.min(100, (totalAmount / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerPane} onClick={(e) => e.stopPropagation()}>
        {/* 1. DRAWER TOP HEADER */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitleWrap}>
            <span className={styles.headerKicker}>HAUTE MENSWEAR</span>
            <div className={styles.mainTitleRow}>
              <h2 className={styles.heading}>Atelier Bag</h2>
              {!loading && validItems.length > 0 && (
                <span className={styles.countBadge}>{totalProducts} pieces</span>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close Bag">
            <FiX size={22} />
          </button>
        </div>

        {/* 2. COMPLIMENTARY SHIPPING GAUGE */}
        {!loading && validItems.length > 0 && (
          <div className={styles.shippingGauge}>
            <div className={styles.gaugeText}>
              <FiTruck size={15} />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong>₹{remainingForFreeShipping}</strong> more for Complimentary VIP Courier
                </span>
              ) : (
                <span className={styles.qualifiedText}>
                  ✦ You qualify for Complimentary VIP Courier Delivery
                </span>
              )}
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* 3. CONTENT AREA */}
        <div className={styles.drawerBody}>
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Opening your atelier bag...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorState}>
              <FiAlertTriangle size={20} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && unavailableCount > 0 && (
            <div className={styles.warningState}>
              <FiAlertTriangle size={18} />
              <p>
                {unavailableCount} item(s) in your bag are no longer in stock and have been archived.
              </p>
            </div>
          )}

          {!loading && !error && validItems.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✦</div>
              <h3>Your Atelier Bag is Empty</h3>
              <p>Discover our bespoke runway collections to reserve signature silhouettes.</p>
              <button className={styles.discoverBtn} onClick={onClose}>
                Explore Runway
              </button>
            </div>
          )}

          {!loading && !error && validItems.length > 0 && (
            <div className={styles.itemList}>
              {validItems.map((item) => {
                const product = item.productId;
                const selectedVariant = getSelectedVariant(item);
                const isUpdating = updatingQuantity === item.variantId;

                const price = product.salePrice ?? product.price ?? 0;
                const originalPrice = product.price ?? price;
                const hasDiscount = originalPrice > price;

                return (
                  <div key={item._id} className={styles.bagCard}>
                    <div className={styles.cardImageFrame}>
                      <img
                        src={product.coverImage?.url || product.coverImage || ""}
                        alt={product.productName || "Garment"}
                        className={styles.cardImage}
                      />
                    </div>

                    <div className={styles.cardInfo}>
                      <div className={styles.cardTop}>
                        <span className={styles.cardBrand}>
                          {product.brand ? product.brand.toUpperCase() : "ATELIER"}
                        </span>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => setRemoveItem(item)}
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>

                      <h4 className={styles.cardName}>{product.productName}</h4>

                      <div className={styles.variantChips}>
                        <span className={styles.chip}>
                          Tone: {selectedVariant?.color || "Standard"}
                        </span>
                        <span className={styles.chip}>
                          Fit: {selectedVariant?.size || "Standard"}
                        </span>
                      </div>

                      <div className={styles.priceRow}>
                        <span className={styles.currentPrice}>₹{price}</span>
                        {hasDiscount && (
                          <span className={styles.oldPrice}>₹{originalPrice}</span>
                        )}
                        <span className={styles.itemSubtotal}>
                          Total: ₹{price * item.quantity}
                        </span>
                      </div>

                      <div className={styles.actionsRow}>
                        <div className={styles.stepper}>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() =>
                              HandleUpdateQuantity(item.variantId, item.quantity, -1)
                            }
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <FiMinus size={13} />
                          </button>
                          <span className={styles.qty}>
                            {isUpdating ? "…" : item.quantity}
                          </span>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() =>
                              HandleUpdateQuantity(item.variantId, item.quantity, 1)
                            }
                            disabled={isUpdating}
                          >
                            <FiPlus size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className={styles.buySingleBtn}
                          onClick={() => HandleBuyNow(item)}
                        >
                          Checkout Piece
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. SUMMARY & CHECKOUT DOCK */}
        {!loading && !error && validItems.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.summaryBreakdown}>
              <div className={styles.summaryRow}>
                <span>Pieces Reserved</span>
                <strong>{totalProducts}</strong>
              </div>
              {totalSavings > 0 && (
                <div className={styles.summaryRow}>
                  <span>Archival Privilege Savings</span>
                  <strong className={styles.savingsAmount}>-₹{totalSavings}</strong>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>VIP Courier Delivery</span>
                <strong className={styles.freeCourier}>COMPLIMENTARY</strong>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total Acquisition</span>
                <strong className={styles.grandTotal}>₹{totalAmount}</strong>
              </div>
            </div>

            <button
              type="button"
              className={styles.checkoutAllBtn}
              onClick={HandleBuyAll}
            >
              <span>PROCEED TO SECURE CHECKOUT</span>
              <FiArrowRight size={17} />
            </button>

            <div className={styles.trustFooter}>
              <FiShield size={13} />
              <span>Encrypted Haute Checkout • 100% Authentic Luxury</span>
            </div>
          </div>
        )}

        {/* REMOVE CONFIRMATION MODAL */}
        {removeItem && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmCard}>
              <div className={styles.confirmIcon}>✦</div>
              <h3>Release Item from Bag?</h3>
              <p>Are you sure you wish to unreserve this tailored garment?</p>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setRemoveItem(null)}
                  disabled={removing}
                >
                  Keep in Bag
                </button>
                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={() => HandleRemove(removeItem.variantId)}
                  disabled={removing}
                >
                  {removing ? "Releasing..." : "Release"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE ORDER POPUP */}
        {createOrderOpen && (
          <CreateOrder
            products={orderProducts}
            onClose={() => setCreateOrderOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ViewCartProduct;