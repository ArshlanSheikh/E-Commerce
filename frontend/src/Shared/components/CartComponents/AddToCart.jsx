import React, { useState } from "react";
import api from "../../../Api/Axios";
import styles from "./AddToCart.module.css";
import { FiX, FiShoppingBag, FiCheck } from "react-icons/fi";

const AddToCart = ({ product, onClose }) => {
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    try {
      setError("");

      if (!variantId) {
        setError("Please select a tailored variant");
        return;
      }

      setLoading(true);

      const { data } = await api.post("/v1/cart/add", {
        productId: product._id,
        variantId,
        quantity,
      });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to reserve garment in bag"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span className={styles.kicker}>HAUTE MENSWEAR</span>
            <h2>Reserve Piece</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        <h3 className={styles.productName}>{product.productName}</h3>

        <div className={styles.section}>
          <label>Select Tailored Variant</label>
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className={styles.select}
          >
            <option value="">Choose Tone & Sizing</option>
            {product.variants?.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.color} • {variant.size} (Stock: {variant.stock})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.input}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.addBtn}
          disabled={loading || success}
          onClick={handleAddToCart}
        >
          {success ? (
            <>
              <FiCheck size={16} />
              <span>Reserved in Bag</span>
            </>
          ) : (
            <>
              <FiShoppingBag size={16} />
              <span>{loading ? "Reserving..." : "Add to Atelier Bag"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
