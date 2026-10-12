// ProductDetailes.jsx - Bespoke Atelier Luxury Studio
import React, { useState, useMemo, useEffect } from "react";
import style from "./ProductDetailes.module.css";
import api from "../../../Api/Axios";
import { useParams, useNavigate } from "react-router-dom";
import AddToCart from "../CartComponents/AddToCart";
import CreateOrder from "../Order/CreateOrder";
import { 
  FiShoppingBag, 
  FiCreditCard, 
  FiShield, 
  FiTruck, 
  FiRefreshCw, 
  FiScissors, 
  FiChevronDown, 
  FiShare2,
  FiMinus,
  FiPlus,
  FiCheck
} from "react-icons/fi";

const ProductDetailes = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    let mounted = true;

    const fetchProductDetailes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/v1/products/details/${slug}`);

        if (mounted) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.log("failed to fetch product details", error.message);
        if (mounted) {
          setError("Failed to load bespoke product. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchProductDetailes();
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    const imageList = [product.coverImage, ...(product.images || [])].filter(Boolean);

    setActiveImage(imageList[0] || "");

    if (product.variants?.length > 0) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
    }

    setQuantity(1);
  }, [product]);

  const {
    _id,
    productName,
    shortDescription,
    description,
    brand,
    category,
    subCategory,
    price,
    salePrice,
    coverImage,
    images = [],
    variants = [],
    tags = [],
  } = product || {};

  const allImages = [coverImage, ...images].filter(Boolean);

  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color))],
    [variants]
  );

  const sizesForColor = useMemo(
    () => variants.filter((v) => v.color === selectedColor),
    [variants, selectedColor]
  );

  const selectedVariant = useMemo(
    () =>
      variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      ),
    [variants, selectedColor, selectedSize]
  );

  const inStock = selectedVariant?.stock > 0;
  const maxStock = selectedVariant?.stock || 0;
  const discountPercent =
    price && salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const firstVariant = variants.find((v) => v.color === color);
    setSelectedSize(firstVariant?.size || "");
    setQuantity(1);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxStock) return maxStock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const CartPayload = {
        productId: product._id,
        variantId: selectedVariant?._id,
        quantity: quantity,
      };

      const response = await api.post("/v1/cart/add", CartPayload);

      if (response.data.success) {
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 3000);
      }
    } catch (error) {
      console.log("failed to add to cart ", error.response);
      alert(`${error?.response?.data?.message || "Failed to add to bag"}`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    setCreateOrderOpen(true);
  };

  // SKELETON LOADING
  if (loading) {
    return (
      <div className={style.loadingContainer}>
        <div className={style.skeletonGallery}>
          <div className={style.skeletonMainImage} />
          <div className={style.skeletonThumbRow}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={style.skeletonThumb} />
            ))}
          </div>
        </div>

        <div className={style.skeletonPane}>
          <div className={style.skeletonLine} style={{ width: "30%", height: "14px" }} />
          <div className={style.skeletonLine} style={{ width: "75%", height: "36px", marginTop: "16px" }} />
          <div className={style.skeletonLine} style={{ width: "40%", height: "24px", marginTop: "12px" }} />
          <div className={style.skeletonLine} style={{ width: "90%", height: "14px", marginTop: "24px" }} />
          <div className={style.skeletonLine} style={{ width: "60%", height: "14px", marginTop: "8px" }} />
          <div className={style.skeletonLine} style={{ width: "100%", height: "54px", marginTop: "36px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.errorContainer}>
        <p>{error}</p>
        <button className={style.retryBtn} onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className={style.errorContainer}>Product not found</div>;
  }

  return (
    <div className={style.studioWrapper}>
      <div className={style.studioGrid}>
        {/* 1. LEFT: EDITORIAL LOOKBOOK GALLERY */}
        <div className={style.gallerySection}>
          <div className={style.mainVisualFrame}>
            <img
              src={activeImage?.url || coverImage?.url || "https://via.placeholder.com/600x800?text=FancyFashion"}
              alt={productName}
              className={style.mainVisual}
            />

            <div className={style.visualTopBadge}>
              <span>✦ ATELIER ARCHIVE NO. {String(slug).slice(-4).toUpperCase()}</span>
            </div>

            {discountPercent > 0 && (
              <div className={style.discountPill}>
                <span>-{discountPercent}% ACQUISITION PRIVILEGE</span>
              </div>
            )}
          </div>

          {/* FILMSTRIP THUMBNAILS */}
          {allImages.length > 1 && (
            <div className={style.filmstripRow}>
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`${style.filmstripThumb} ${
                    activeImage?.url === img?.url ? style.filmstripActive : ""
                  }`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img?.url} alt={`${productName} angle ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. RIGHT: ATELIER SPECIFICATION & ACQUISITION PANE */}
        <div className={style.atelierPane}>
          {/* Breadcrumb / Class */}
          <div className={style.categoryBreadcrumb}>
            <span>MAISON DE MENSWEAR</span>
            <span className={style.crumbSep}>/</span>
            <span>{category?.toUpperCase()}</span>
            {subCategory && (
              <>
                <span className={style.crumbSep}>/</span>
                <span>{subCategory?.toUpperCase()}</span>
              </>
            )}
          </div>

          {/* Brand & Title */}
          <div className={style.titleBlock}>
            <span className={style.brandKicker}>
              {brand ? brand.toUpperCase() : "FANCYFASHION ATELIER"}
            </span>
            <h1 className={style.garmentTitle}>{productName}</h1>
          </div>

          {/* Price Box */}
          <div className={style.priceBlock}>
            <div className={style.priceRow}>
              <span className={style.salePrice}>₹{salePrice || price}</span>
              {price && salePrice && price > salePrice && (
                <span className={style.mrpPrice}>₹{price}</span>
              )}
              {discountPercent > 0 && (
                <span className={style.savingsTag}>
                  Save ₹{price - salePrice} ({discountPercent}% Off)
                </span>
              )}
            </div>
            <span className={style.taxIncludedText}>
              Complimentary standard express shipping & taxes included
            </span>
          </div>

          {/* Short Description */}
          {shortDescription && (
            <p className={style.shortDesc}>{shortDescription}</p>
          )}

          {/* COLOR SWATCH SELECTOR */}
          {colors.length > 0 && (
            <div className={style.selectorGroup}>
              <div className={style.selectorHeader}>
                <span className={style.selectorLabel}>COLOR PALETTE:</span>
                <span className={style.selectedVal}>{selectedColor}</span>
              </div>
              <div className={style.colorRow}>
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`${style.colorBtn} ${
                      selectedColor === color ? style.colorBtnActive : ""
                    }`}
                    onClick={() => handleColorChange(color)}
                  >
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE TAILORING SELECTOR */}
          {sizesForColor.length > 0 && (
            <div className={style.selectorGroup}>
              <div className={style.selectorHeader}>
                <span className={style.selectorLabel}>TAILORED SIZING:</span>
                <span className={style.fitGuideLink}>
                  <FiScissors size={13} />
                  <span>True to Bespoke Fit</span>
                </span>
              </div>
              <div className={style.sizeRow}>
                {sizesForColor.map((variant) => (
                  <button
                    key={variant._id}
                    type="button"
                    disabled={variant.stock === 0}
                    className={`${style.sizeBtn} ${
                      selectedSize === variant.size ? style.sizeBtnActive : ""
                    } ${variant.stock === 0 ? style.sizeBtnDisabled : ""}`}
                    onClick={() => {
                      setSelectedSize(variant.size);
                      setQuantity(1);
                    }}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INVENTORY / STOCK STATUS */}
          <div className={style.stockBanner}>
            <span
              className={inStock ? style.stockDotGreen : style.stockDotRed}
            />
            <span className={style.stockText}>
              {selectedVariant
                ? inStock
                  ? `In Atelier Inventory (${maxStock} pieces remaining)`
                  : "Currently Reserved & Sold Out"
                : "Select Variant to Check Inventory"}
            </span>
          </div>

          {/* QUANTITY STEPPER */}
          {inStock && (
            <div className={style.quantityBlock}>
              <span className={style.quantityLabel}>PIECES:</span>
              <div className={style.stepper}>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className={style.stepBtn}
                >
                  <FiMinus size={14} />
                </button>
                <span className={style.qtyValue}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxStock}
                  className={style.stepBtn}
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* DUAL HIGH-FASHION ACTIONS */}
          <div className={style.actionButtons}>
            <button
              type="button"
              className={style.addToBagBtn}
              disabled={!inStock || addingToCart}
              onClick={handleAddToCart}
            >
              {addedSuccess ? (
                <>
                  <FiCheck size={18} />
                  <span>ADDED TO ATELIER BAG</span>
                </>
              ) : (
                <>
                  <FiShoppingBag size={18} />
                  <span>{addingToCart ? "RESERVING..." : "ADD TO ATELIER BAG"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={style.buyNowBtn}
              disabled={!inStock}
              onClick={handleBuyNow}
            >
              <FiCreditCard size={18} />
              <span>ACQUIRE NOW</span>
            </button>
          </div>

          {/* LUXURY TRUST ACCORDION */}
          <div className={style.tabContainer}>
            <div className={style.tabButtons}>
              <button
                type="button"
                className={`${style.tabBtn} ${activeTab === "details" ? style.tabActive : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Silhouette & Details
              </button>
              <button
                type="button"
                className={`${style.tabBtn} ${activeTab === "care" ? style.tabActive : ""}`}
                onClick={() => setActiveTab("care")}
              >
                Atelier Care
              </button>
              <button
                type="button"
                className={`${style.tabBtn} ${activeTab === "delivery" ? style.tabActive : ""}`}
                onClick={() => setActiveTab("delivery")}
              >
                Complimentary Delivery
              </button>
            </div>

            <div className={style.tabBody}>
              {activeTab === "details" && (
                <div className={style.tabContent}>
                  <p>{description || "Crafted to exacting haute menswear standards. Every seam, cut, and panel is calibrated for contemporary elegance and structured posture."}</p>
                  {tags?.length > 0 && (
                    <div className={style.tagsRow}>
                      {tags.map((t) => (
                        <span key={t} className={style.specTag}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "care" && (
                <div className={style.tabContent}>
                  <p>Dry clean only by certified luxury garment specialists. Store on contoured wooden hangers in breathable cotton suit bags to preserve the architectural canvas.</p>
                </div>
              )}

              {activeTab === "delivery" && (
                <div className={style.tabContent}>
                  <p>Delivered in signature FancyFashion garment boxes with bespoke protective dust bags. Complimentary express courier on all orders over ₹999.</p>
                </div>
              )}
            </div>
          </div>

          {/* BOUTIQUE GUARANTEE BADGES */}
          <div className={style.guaranteeRow}>
            <div className={style.guaranteeItem}>
              <FiShield size={18} />
              <span>100% Authentic Luxury</span>
            </div>
            <div className={style.guaranteeItem}>
              <FiTruck size={18} />
              <span>Discreet Express Courier</span>
            </div>
            <div className={style.guaranteeItem}>
              <FiRefreshCw size={18} />
              <span>7-Day Boutique Exchange</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <div className={style.mobileStickyBar}>
        <div className={style.stickyPriceInfo}>
          <span className={style.stickyPrice}>₹{salePrice || price}</span>
          <span className={style.stickyVariant}>
            {selectedColor} • {selectedSize}
          </span>
        </div>

        <div className={style.stickyActionGroup}>
          <button
            className={style.stickyBagBtn}
            disabled={!inStock || addingToCart}
            onClick={handleAddToCart}
          >
            {addedSuccess ? "Added" : "Add to Bag"}
          </button>
          <button
            className={style.stickyBuyBtn}
            disabled={!inStock}
            onClick={handleBuyNow}
          >
            Acquire Now
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {createOrderOpen && (
        <CreateOrder
          products={[
            {
              product,
              quantity: quantity,
              selectedVariant: {
                color: selectedColor,
                size: selectedSize,
              },
            },
          ]}
          onClose={() => setCreateOrderOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetailes;