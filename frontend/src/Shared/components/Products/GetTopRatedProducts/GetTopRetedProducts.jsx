// GetTopRetedProducts.jsx - Asymmetric Editorial Icon Archive
import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../../../Api/Axios';
import ProductDesign from '../ProductDesign';
import styles from './GetTopRetedProducts.module.css';
import { FiAward, FiStar, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LIMIT = 10;
const SCROLL_THROTTLE = 300;
const SCROLL_THRESHOLD = 200;

const GetTopRetedProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const isFetchingRef = useRef(false);
  const throttleRef = useRef(null);
  const staggerTimeouts = useRef([]);
  const fetchedPagesRef = useRef(new Set());
  const currentPageRef = useRef(1);

  const fetchProducts = useCallback(async (pageNum, isInitial = false) => {
    if (fetchedPagesRef.current.has(pageNum)) return;
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    fetchedPagesRef.current.add(pageNum);

    try {
      isInitial ? setInitialLoading(true) : setLoadingMore(true);

      const response = await api.get('/v1/products/top-rated', {
        params: { page: pageNum, limit: LIMIT },
      });

      const raw = response?.data?.products || response?.data?.data || response?.data || [];
      const newProducts = Array.isArray(raw) ? raw : [];

      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...uniqueNewProducts];
      });

      setVisibleProducts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...uniqueNewProducts];
      });

      const backendHasMore = response?.data?.hasMore;
      const computedHasMore =
        typeof backendHasMore === 'boolean' ? backendHasMore : newProducts.length === LIMIT;

      setHasMore(computedHasMore);
      setError(null);
    } catch (err) {
      console.error('Error fetching top rated products:', err);
      setError('Failed to load iconic creations. Please refresh or retry.');
      if (isInitial) setProducts([]);
      fetchedPagesRef.current.delete(pageNum);
    } finally {
      isInitial ? setInitialLoading(false) : setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    currentPageRef.current = 1;
    fetchProducts(1, true);

    return () => {
      staggerTimeouts.current.forEach(clearTimeout);
      fetchedPagesRef.current.clear();
      isFetchingRef.current = false;
    };
  }, [fetchProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;

        const scrollBottom = window.innerHeight + window.scrollY;
        const docHeight = document.documentElement.scrollHeight;

        if (
          docHeight - scrollBottom < SCROLL_THRESHOLD &&
          hasMore &&
          !isFetchingRef.current &&
          !initialLoading
        ) {
          const nextPage = currentPageRef.current + 1;
          currentPageRef.current = nextPage;
          setPage(nextPage);
          fetchProducts(nextPage, false);
        }
      }, SCROLL_THROTTLE);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleRef.current) clearTimeout(throttleRef.current);
    };
  }, [hasMore, initialLoading, fetchProducts]);

  const handleRetry = () => {
    setError(null);
    setProducts([]);
    setVisibleProducts([]);
    setPage(1);
    setHasMore(true);
    currentPageRef.current = 1;
    fetchedPagesRef.current.clear();
    fetchProducts(1, true);
  };

  const SkeletonCard = ({ delay = 0 }) => (
    <div className={styles.skeletonCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonMeta}>
        <div className={styles.skeletonLine} style={{ width: '35%', height: '10px' }} />
        <div className={styles.skeletonLine} style={{ width: '80%', height: '16px' }} />
        <div className={styles.skeletonLine} style={{ width: '50%', height: '18px', marginTop: '6px' }} />
      </div>
    </div>
  );

  const heroItem = visibleProducts.length > 0 ? visibleProducts[0] : null;
  const remainingItems = visibleProducts.length > 1 ? visibleProducts.slice(1) : [];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* EDITORIAL SECTION HEADER */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.kickerRow}>
              <span className={styles.eyebrow}>✦ THE ICON ARCHIVE</span>
              <span className={styles.ratingBadge}>
                <FiAward size={14} />
                <span>TOP RATED BY CONNOISSEURS</span>
              </span>
            </div>
            <h2 className={styles.title}>Bespoke Masterpieces</h2>
            <p className={styles.subtitle}>
              The highest-rated menswear essentials in our maison, celebrated for architectural silhouette and premium fabrication.
            </p>
          </div>

          <div className={styles.headerRight}>
            <button
              className={styles.viewAllBtn}
              onClick={() => navigate('/filtered/all')}
            >
              <span>EXPLORE ALL ARCHIVES</span>
              <FiArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {initialLoading && visibleProducts.length === 0 ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} delay={i * 60} />
            ))}
          </div>
        ) : error && visibleProducts.length === 0 ? (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button onClick={handleRetry} className={styles.retryBtn}>
              Retry Connection
            </button>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className={styles.emptyBox}>
            <p>No creations available at this moment in the archive.</p>
          </div>
        ) : (
          <>
            {/* ASYMMETRIC SPOTLIGHT + STAGGERED GRID */}
            <div className={styles.asymmetricContainer}>
              {/* FEATURED SPOTLIGHT CARD (FIRST ITEM) */}
              {heroItem && (
                <div className={styles.spotlightFeature}>
                  <div className={styles.spotlightTagBanner}>
                    <FiStar size={14} />
                    <span>ARCHIVAL HIGHLIGHT // ICON NO. 01</span>
                  </div>
                  <ProductDesign product={heroItem} />
                </div>
              )}

              {/* STAGGERED EDITORIAL PRODUCTS GRID */}
              <div className={styles.staggeredGrid}>
                {remainingItems.map((product) => (
                  <div
                    key={product?._id || `product-${Math.random()}`}
                    className={styles.productCell}
                  >
                    <ProductDesign product={product} />
                  </div>
                ))}
              </div>
            </div>

            {loadingMore && (
              <div className={styles.loadingMoreGrid}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={`more-${i}`} delay={i * 60} />
                ))}
              </div>
            )}

            {!hasMore && visibleProducts.length > 0 && (
              <div className={styles.endMessage}>
                <div className={styles.endLine} />
                <span className={styles.endText}>
                  ✦ YOU HAVE VIEWED ALL ICONIC ARCHIVES ✦
                </span>
                <div className={styles.endLine} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default GetTopRetedProducts;