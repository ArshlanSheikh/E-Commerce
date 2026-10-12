// CategoryWiseProducts.jsx - Editorial Department Showcase
import React, { useEffect, useState, useRef } from "react";
import api from "../../../../Api/Axios";
import ProductDesign from "../ProductDesign";
import styles from "./CategoryWiseProducts.module.css";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const STAGGER_DELAY = 100;

const CategoryWiseProducts = ({ category, limit = 10 }) => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasProducts, setHasProducts] = useState(true);

  const staggerTimeouts = useRef([]);
  const requestIdRef = useRef(0);

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const revealStaggered = (batch, requestId) => {
    batch.forEach((product, i) => {
      const timeoutId = setTimeout(() => {
        if (requestIdRef.current !== requestId) return;
        setVisibleProducts((prev) => [...prev, product]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  const fetchProducts = async () => {
    const currentRequestId = ++requestIdRef.current;

    try {
      setLoading(true);
      clearStaggerTimeouts();
      setVisibleProducts([]);

      const response = await api.get(
        `/v1/products/category/${category}?limit=${limit}&page=1`
      );

      if (requestIdRef.current !== currentRequestId) return;

      const fetched = response.data.data.products || [];
      setHasProducts(fetched.length > 0);

      if (fetched.length > 0) {
        revealStaggered(fetched, currentRequestId);
      }
    } catch (error) {
      if (requestIdRef.current !== currentRequestId) return;
      console.log("Failed to fetch products", error);
      setHasProducts(false);
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    return () => {
      requestIdRef.current += 1;
      clearStaggerTimeouts();
    };
  }, [category]);

  const scrollTrack = (direction) => {
    if (!trackRef.current) return;
    const distance = 360;
    trackRef.current.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  };

  const SkeletonCard = ({ delay = 0 }) => (
    <div className={styles.skeletonItem} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonLine} style={{ width: "70%", height: "12px", marginTop: "12px" }} />
      <div className={styles.skeletonLine} style={{ width: "45%", height: "14px", marginTop: "6px" }} />
    </div>
  );

  if (loading && visibleProducts.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.skeletonLine} style={{ width: "160px", height: "16px" }} />
            <div className={styles.skeletonLine} style={{ width: "240px", height: "32px", marginTop: "8px" }} />
          </div>
          <div className={styles.productRow}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!loading && !hasProducts) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* EDITORIAL DEPARTMENT HEADER */}
        <div className={styles.header}>
          <div>
            <span className={styles.kicker}>✦ DEPARTMENT ARCHIVE</span>
            <h2 className={styles.heading}>{category}</h2>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.viewAllBtn}
              onClick={() => navigate(`/filtered/${category}`)}
            >
              <span>Explore Collection</span>
              <FiArrowRight size={15} />
            </button>

            <div className={styles.arrowControls}>
              <button
                className={styles.arrowBtn}
                onClick={() => scrollTrack(-1)}
                aria-label="Scroll left"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                className={styles.arrowBtn}
                onClick={() => scrollTrack(1)}
                aria-label="Scroll right"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* HORIZONTAL TOUCH ROW */}
        <div className={styles.productRow} ref={trackRef}>
          {visibleProducts.map((product) => (
            <div key={product._id} className={styles.productItem}>
              <ProductDesign product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryWiseProducts;