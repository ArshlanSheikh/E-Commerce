// ProductDesign.jsx - High-Fashion Editorial Garment Card
import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./ProductDesign.module.css";
import { FiArrowUpRight, FiEye } from "react-icons/fi";

const ProductDesign = ({ product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  // Safe stock calculation
  const totalStock =
    product?.variants?.reduce(
      (total, variant) => total + (variant?.stock || 0),
      0
    ) || 0;

  // Safe discount calculation
  const discountPercentage =
    product?.price && product?.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const handleClick = () => {
    if (product?.slug) {
      navigate(`/product/${product.slug}`);
    }
  };

  const imageUrl = product?.coverImage?.url || product?.coverImage || "";

  // Extract available sizes for quick preview
  const availableSizes = [
    ...new Set(
      product?.variants?.map((v) => v.size).filter(Boolean) || []
    ),
  ].slice(0, 4);

  return (
    <article className={style.card} onClick={handleClick}>
      {/* 1. EDITORIAL VISUAL FRAME */}
      <div className={style.imageContainer}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product?.productName || "Haute Garment"}
            className={style.productImage}
            loading="lazy"
          />
        ) : (
          <div className={style.imagePlaceholder}>
            <span>FF</span>
          </div>
        )}

        {/* TOP STATUS TAGS */}
        <div className={style.topBadges}>
          {discountPercentage > 0 && (
            <span className={style.discountBadge}>
              -{discountPercentage}%
            </span>
          )}

          <span
            className={
              totalStock > 0
                ? totalStock <= 5
                  ? style.stockLow
                  : style.stockIn
                : style.stockOut
            }
          >
            {totalStock > 0
              ? totalStock <= 5
                ? "Limited"
                : "In Atelier"
              : "Archived"}
          </span>
        </div>

        {/* BOTTOM FROSTED SHELF ON HOVER */}
        <div className={style.hoverShelf}>
          {availableSizes.length > 0 && (
            <div className={style.sizesRow}>
              {availableSizes.map((s) => (
                <span key={s} className={style.sizeChip}>
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className={style.viewAction}>
            <span>View Piece</span>
            <FiArrowUpRight size={15} />
          </div>
        </div>
      </div>

      {/* 2. CARD EDITORIAL META */}
      <div className={style.content}>
        <div className={style.metaHeader}>
          <span className={style.brand}>
            {product?.brand ? product.brand.toUpperCase() : "FANCYFASHION ATELIER"}
          </span>
        </div>

        <h3 className={style.productName} title={product?.productName}>
          {product?.productName || "Tailored Garment"}
        </h3>

        <div className={style.priceBox}>
          <span className={style.salePrice}>
            ₹{product?.salePrice || product?.price || 0}
          </span>
          {product?.price &&
            product?.salePrice &&
            product.price > product.salePrice && (
              <span className={style.originalPrice}>₹{product.price}</span>
            )}
        </div>
      </div>
    </article>
  );
};

export default ProductDesign;