// CategoryNavBar.jsx - Editorial Curated Departments
import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./CategoryNavBar.module.css";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchCategories } from "../../../Api/categories";

const CategoryNavbar = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const threshold = 6;
    setAtStart(el.scrollLeft <= threshold);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - threshold);
  }, []);

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

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(el);

    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);

    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
      resizeObserver.disconnect();
    };
  }, [updateEdges]);

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const step = 320;
    el.scrollTo({ left: el.scrollLeft + dir * step, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryValue) => {
    navigate(`/filtered/${encodeURIComponent(categoryValue)}`);
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  const featuredCategory = categories[0];
  const secondaryCategories = categories.slice(1);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* EDITORIAL SECTION HEADER */}
        <div className={styles.headerRow}>
          <div>
            <span className={styles.eyebrow}>✦ ATELIER DEPARTMENTS</span>
            <h2 className={styles.title}>Curated Disciplines</h2>
            <p className={styles.subtitle}>
              Distinct garment architectures tailored for form, occasion, and tactile luxury.
            </p>
          </div>

          <div className={styles.controlsWrap}>
            <button
              className={`${styles.navBtn} ${atStart ? styles.navBtnDisabled : ""}`}
              onClick={() => scrollByAmount(-1)}
              aria-label="Previous departments"
              disabled={atStart}
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              className={`${styles.navBtn} ${atEnd ? styles.navBtnDisabled : ""}`}
              onClick={() => scrollByAmount(1)}
              aria-label="Next departments"
              disabled={atEnd}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ASYMMETRIC BENTO GRID / CAROUSEL DOCK */}
        <div className={styles.scrollWrapper} ref={trackRef}>
          {/* FEATURED DEPARTMENT EXPANDED CARD */}
          {featuredCategory && (
            <div
              className={styles.featuredCard}
              onClick={() => handleCategoryClick(featuredCategory.name)}
            >
              <div className={styles.featuredImageWrapper}>
                {featuredCategory.imageUrl ? (
                  <img
                    src={featuredCategory.imageUrl}
                    alt={featuredCategory.name}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.cardPlaceholder}>
                    <span>{featuredCategory.name.charAt(0)}</span>
                  </div>
                )}
                <div className={styles.featuredOverlay} />
              </div>

              <div className={styles.featuredMeta}>
                <div className={styles.badgeRow}>
                  <span className={styles.deptNumber}>DEPT 01</span>
                  <span className={styles.spotlightTag}>SIGNATURE SILHOUETTE</span>
                </div>
                <h3 className={styles.featuredName}>{featuredCategory.name}</h3>
                <span className={styles.exploreLink}>
                  <span>Explore Department</span>
                  <FiArrowUpRight size={17} />
                </span>
              </div>
            </div>
          )}

          {/* SECONDARY DEPARTMENT CARDS */}
          {secondaryCategories.map((cat, idx) => (
            <div
              key={cat.name}
              className={styles.departmentCard}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className={styles.cardImageWrapper}>
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.cardPlaceholder}>
                    <span>{cat.name.charAt(0)}</span>
                  </div>
                )}
                <div className={styles.cardGradient} />
              </div>

              <div className={styles.cardMeta}>
                <div className={styles.cardTopMeta}>
                  <span className={styles.deptNumberSmall}>
                    DEPT {String(idx + 2).padStart(2, "0")}
                  </span>
                  <FiArrowUpRight size={18} className={styles.cornerArrow} />
                </div>
                <h4 className={styles.cardName}>{cat.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNavbar;