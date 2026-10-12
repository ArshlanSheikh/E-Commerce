// HomePageBanner1.jsx - Editorial Campaign Spread & Capsule Drops
import React, { useEffect, useState } from "react";
import styles from "./HomePageBanner1.module.css";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiTrendingUp,
  FiStar,
  FiClock,
  FiZap,
  FiArrowRight,
  FiTag
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const banners = [
  {
    kicker: "CAPSULE DROP // VOL. XXIV",
    title: "The Autumn Cashmere & Wool Study",
    accent: "Cashmere & Wool",
    subtitle: "Heavyweight double-faced wool overcoats and superfine Italian cashmere knitwear.",
    code: "FANCY10",
    tag: "Trending Runway",
    tagIcon: <FiTrendingUp />,
    image: "https://i.pinimg.com/736x/fa/25/89/fa258975e3448fff42c0cc019eedc6d7.jpg",
    filterLink: "Jackets",
  },
  {
    kicker: "EXCLUSIVE ATELIER RELEASE",
    title: "Signature Egyptian Cotton Shirting",
    accent: "Egyptian Cotton",
    subtitle: "140s two-ply yarn woven in Como, Italy. Finished with hand-sewn crow's foot buttons.",
    code: "BESPOKE",
    tag: "Artisanal Craft",
    tagIcon: <FiStar />,
    image: "https://i.pinimg.com/736x/a2/0d/1e/a20d1e7f23c02239f27c58fdf36d33f2.jpg",
    filterLink: "Shirts",
  },
  {
    kicker: "SEASONAL ARCHIVE SALE",
    title: "Up To 70% Off Runway Icons",
    accent: "70% Off",
    subtitle: "Limited acquisition window for signature suits, leather boots, and outerwear.",
    code: "ARCHIVE70",
    tag: "Private Sale",
    tagIcon: <FiZap />,
    image: "https://i.pinimg.com/736x/5e/24/e7/5e24e7a9a3232b64a5dcc4d829dd85a7.jpg",
    filterLink: "all",
  },
  {
    kicker: "COLD-WEATHER EDIT",
    title: "Layered Outerwear & Shearling Form",
    accent: "Shearling Form",
    subtitle: "Architectural proportions designed for harsh weather without sacrificing clean poise.",
    code: "WINTER26",
    tag: "New Season",
    tagIcon: <FiClock />,
    image: "https://i.pinimg.com/736x/c0/00/26/c0002617c300be374c742c30d54304c5.jpg",
    filterLink: "Jackets",
  },
];

const HomePageBanner1 = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setActive(index);
  const goToPrev = () => setActive((prev) => (prev - 1 + banners.length) % banners.length);
  const goToNext = () => setActive((prev) => (prev + 1) % banners.length);

  const current = banners[active];

  return (
    <section className={styles.campaignSection}>
      <div className={styles.container}>
        <div className={styles.spreadCard}>
          {/* BACKGROUND CINEMATIC VISUAL */}
          <div
            className={styles.bgCover}
            style={{ backgroundImage: `url(${current.image})` }}
          >
            <div className={styles.coverGradient} />
          </div>

          {/* EDITORIAL CONTENT SPREAD */}
          <div className={styles.spreadContent}>
            <div className={styles.topMeta}>
              <span className={styles.kickerBadge}>
                {current.tagIcon}
                <span>{current.kicker}</span>
              </span>
              <span className={styles.editionNumber}>
                CAMPAIGN NO. {String(active + 1).padStart(2, "0")} / 04
              </span>
            </div>

            <div className={styles.headlineBlock}>
              <h2 className={styles.headline}>{current.title}</h2>
              <p className={styles.subtext}>{current.subtitle}</p>
            </div>

            <div className={styles.actionRow}>
              <button
                className={styles.shopBtn}
                onClick={() => navigate(`/filtered/${current.filterLink}`)}
              >
                <span>EXPLORE THIS CAPSULE</span>
                <FiArrowRight size={16} />
              </button>

              <div className={styles.voucherChip}>
                <FiTag size={13} />
                <span>CODE: <strong>{current.code}</strong></span>
              </div>
            </div>

            {/* CONTROLS */}
            <div className={styles.bottomBar}>
              <div className={styles.pagers}>
                {banners.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.pageDot} ${active === i ? styles.pageDotActive : ""}`}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className={styles.arrows}>
                <button
                  className={styles.arrowBtn}
                  onClick={goToPrev}
                  aria-label="Previous slide"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  className={styles.arrowBtn}
                  onClick={goToNext}
                  aria-label="Next slide"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageBanner1;