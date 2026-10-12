// FilteredProduct.jsx - Editorial Atelier Catalog Experience
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../../../Api/Axios";
import { fetchCategories } from "../../../../Api/categories";
import ProductDesign from "../ProductDesign";
import styles from "./FilteredProduct.module.css";
import { FiFilter, FiX, FiSearch, FiChevronDown, FiRotateCcw, FiSliders } from "react-icons/fi";

const LIMIT = 10;
const STAGGER_DELAY = 120;

function FilteredProducts() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  return (
    <FilteredProductsPage
      key={`${category || "all"}:${searchQuery}`}
      category={category}
      searchQuery={searchQuery}
    />
  );
}

function FilteredProductsPage({ category, searchQuery }) {
  const [filters, setFilters] = useState({
    category: category === "all" ? "" : category || "",
    search: searchQuery,
    minPrice: "",
    maxPrice: "",
    color: "",
    size: "",
    sort: "newest",
  });

  const appliedFiltersRef = useRef(filters);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const colors = ["Black", "White", "Navy", "Blue", "Charcoal", "Beige", "Olive", "Brown"];
  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  const abortRef = useRef(null);
  const fetchingRef = useRef(false);
  const staggerTimeouts = useRef([]);
  const requestIdRef = useRef(0);
  const sentinelRef = useRef(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((loadedCategories) => {
        if (active) setCategories(loadedCategories);
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const revealStaggered = (batch, requestId) => {
    batch.forEach((product, i) => {
      const timeoutId = setTimeout(() => {
        if (requestIdRef.current !== requestId) return;
        setVisibleProducts((prev) => [...prev, product]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const fetchProducts = useCallback(async (pageToFetch, activeFilters) => {
    const currentRequestId = ++requestIdRef.current;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    fetchingRef.current = true;

    pageToFetch === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const response = await api.get("/v1/products/filtered", {
        params: { page: pageToFetch, limit: LIMIT, ...activeFilters },
        signal: controller.signal,
      });

      if (requestIdRef.current !== currentRequestId) return;

      const fetched = response?.data?.data?.products || [];
      const totalPages = response?.data?.data?.pagination?.totalPages || 1;

      if (pageToFetch === 1) {
        clearStaggerTimeouts();
        setVisibleProducts([]);
      }

      if (fetched.length > 0) {
        revealStaggered(fetched, currentRequestId);
      }

      setHasMore(pageToFetch < totalPages && fetched.length > 0);
    } catch (error) {
      if (error?.name !== "CanceledError" && error?.code !== "ERR_CANCELED") {
        console.error("Fetch error:", error);
      }
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
        setLoadingMore(false);
        fetchingRef.current = false;
        abortRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => fetchProducts(1, appliedFiltersRef.current),
      0
    );

    return () => {
      clearTimeout(timeoutId);
      requestIdRef.current += 1;
      abortRef.current?.abort();
    };
  }, [fetchProducts]);

  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page, appliedFiltersRef.current);
  }, [page]);

  useEffect(() => {
    return () => clearStaggerTimeouts();
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMore &&
          !loading &&
          !loadingMore &&
          !fetchingRef.current
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    appliedFiltersRef.current = { ...filters };
    setPage(1);
    setHasMore(true);
    fetchProducts(1, appliedFiltersRef.current);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: category === "all" ? "" : category || "",
      search: "",
      minPrice: "",
      maxPrice: "",
      color: "",
      size: "",
      sort: "newest",
    };
    setFilters(resetFilters);
    appliedFiltersRef.current = resetFilters;
    setPage(1);
    setHasMore(true);
    fetchProducts(1, resetFilters);
    setShowFilters(false);
  };

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === "sort") return v !== "newest";
    if (k === "category") return category === "all" ? !!v : v !== category;
    return !!v;
  }).length;

  const sidebarContent = (
    <div className={styles.filterConsole}>
      {/* Search Filter */}
      <div className={styles.filterBlock}>
        <span className={styles.blockTitle}>SEARCH ATELIER</span>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.inputIcon} />
          <input
            type="text"
            name="search"
            value={filters.search}
            placeholder="Search silhouettes..."
            onChange={handleChange}
            className={styles.filterInput}
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div className={styles.filterBlock}>
        <span className={styles.blockTitle}>DEPARTMENT</span>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className={styles.filterSelect}
        >
          <option value="">All Departments</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className={styles.filterBlock}>
        <span className={styles.blockTitle}>PRICE SPECTRUM (₹)</span>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min ₹"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            className={styles.priceBox}
          />
          <span className={styles.priceDivider}>—</span>
          <input
            type="number"
            placeholder="Max ₹"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            className={styles.priceBox}
          />
        </div>
      </div>

      {/* Colors */}
      <div className={styles.filterBlock}>
        <span className={styles.blockTitle}>FABRIC TONE</span>
        <div className={styles.colorPills}>
          {colors.map((c) => {
            const isActive = filters.color.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                className={`${styles.colorChip} ${isActive ? styles.chipActive : ""}`}
                onClick={() => updateFilter("color", isActive ? "" : c)}
              >
                <span>{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className={styles.filterBlock}>
        <span className={styles.blockTitle}>TAILORED SIZING</span>
        <div className={styles.sizePills}>
          {sizes.map((s) => {
            const isActive = filters.size === s;
            return (
              <button
                key={s}
                type="button"
                className={`${styles.sizeChip} ${isActive ? styles.chipActive : ""}`}
                onClick={() => updateFilter("size", isActive ? "" : s)}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div className={styles.filterBlock}>
        <span className={styles.blockTitle}>ORDERING</span>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className={styles.filterSelect}
        >
          <option value="newest">Latest Runway Drops</option>
          <option value="oldest">Archive Foundation</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Alphabetical: A → Z</option>
          <option value="nameDesc">Alphabetical: Z → A</option>
        </select>
      </div>

      {/* Buttons */}
      <div className={styles.filterFooterBtns}>
        <button type="button" className={styles.applyBtn} onClick={handleApply}>
          Apply Preferences
        </button>
        <button type="button" className={styles.resetBtn} onClick={clearFilters}>
          <FiRotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );

  const SkeletonCard = ({ delay = 0 }) => (
    <div className={styles.skeletonCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonMeta}>
        <div className={styles.skeletonLine} style={{ width: "40%", height: "10px" }} />
        <div className={styles.skeletonLine} style={{ width: "85%", height: "16px" }} />
        <div className={styles.skeletonLine} style={{ width: "50%", height: "18px" }} />
      </div>
    </div>
  );

  const displayCategoryTitle =
    category === "all" || !category
      ? "Complete Atelier Archive"
      : `${category} Collection`;

  return (
    <section className={styles.catalogPage}>
      {/* 1. TOP EDITORIAL BANNER */}
      <div className={styles.editorialBanner}>
        <div className={styles.bannerContainer}>
          <span className={styles.bannerKicker}>✦ HAUTE MENSWEAR REPERTOIRE</span>
          <h1 className={styles.bannerTitle}>{displayCategoryTitle}</h1>
          <p className={styles.bannerDesc}>
            Curated menswear pieces structured for discerning taste. Explore hand-selected cottons, fine woolens, and modern sartorial cuts.
          </p>

          <div className={styles.bannerBar}>
            <span className={styles.resultsCount}>
              {!loading && `${visibleProducts.length} pieces discovered`}
            </span>

            <button
              type="button"
              className={styles.mobileFilterToggle}
              onClick={() => setShowFilters(true)}
            >
              <FiSliders size={16} />
              <span>Filter Catalog</span>
              {activeFilterCount > 0 && (
                <span className={styles.filterBadgeCount}>{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATALOG BODY */}
      <div className={styles.catalogContainer}>
        <div className={styles.catalogLayout}>
          {/* DESKTOP STICKY FILTER SIDEBAR */}
          <aside className={styles.desktopSidebar}>
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitleWrap}>
                <FiSliders size={16} />
                <h3>Refine Catalog</h3>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className={styles.clearQuickBtn}
                  onClick={clearFilters}
                >
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>
            {sidebarContent}
          </aside>

          {/* MAIN PRODUCT GRID */}
          <main className={styles.mainGridArea}>
            {loading && visibleProducts.length === 0 ? (
              <div className={styles.productGrid}>
                {Array.from({ length: LIMIT }).map((_, i) => (
                  <SkeletonCard key={i} delay={i * 60} />
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className={styles.emptyResults}>
                <span className={styles.emptyIcon}>✦</span>
                <h3>No Pieces Match Your Preferences</h3>
                <p>Try adjusting your search query, size, or price bounds.</p>
                <button
                  type="button"
                  className={styles.resetCatalogBtn}
                  onClick={clearFilters}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={styles.productGrid}>
                  {visibleProducts.map((product) => (
                    <div key={product._id} className={styles.gridCell}>
                      <ProductDesign product={product} />
                    </div>
                  ))}

                  {loadingMore &&
                    Array.from({ length: LIMIT }).map((_, i) => (
                      <SkeletonCard key={`more-${i}`} delay={i * 60} />
                    ))}
                </div>

                <div ref={sentinelRef} className={styles.scrollSentinel} />

                {!hasMore && visibleProducts.length > 0 && (
                  <div className={styles.endArchiveBanner}>
                    <span className={styles.endLine} />
                    <span className={styles.endText}>
                      ✦ YOU HAVE VIEWED ALL ARCHIVAL PIECES ✦
                    </span>
                    <span className={styles.endLine} />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE SLIDE-UP BOTTOM SHEET */}
      {showFilters && (
        <div className={styles.mobileSheetOverlay} onClick={() => setShowFilters(false)}>
          <div className={styles.mobileSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <div className={styles.sheetTitle}>
                <FiSliders size={18} />
                <h3>Refine Collection</h3>
              </div>
              <button
                type="button"
                className={styles.sheetCloseBtn}
                onClick={() => setShowFilters(false)}
              >
                <FiX size={22} />
              </button>
            </div>
            <div className={styles.sheetBody}>{sidebarContent}</div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FilteredProducts;