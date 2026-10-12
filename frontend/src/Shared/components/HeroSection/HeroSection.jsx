import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCompass } from "react-icons/fi";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import styles from "./HeroSection.module.css";

const slides = [
  {
    lookNumber: "LOOK 01",
    season: "AUTUMN / WINTER '26",
    title: "Sculpted Elegance & Modern Form",
    italicAccent: "Elegance",
    desc: "Uncompromising Italian wool blazers paired with artisanal silk shirts. Designed for the discerning modern gentleman.",
    image: "https://i.pinimg.com/736x/f9/6a/f0/f96af0d61f141448f81cddfa4d2775dc.jpg",
    spotlightTitle: "Double-Breasted Wool Blazer",
    spotlightPrice: "₹4,999",
    categoryFilter: "Blazer",
  },
  {
    lookNumber: "LOOK 02",
    season: "CAPSULE DROP '26",
    title: "Urban Architecture in Outerwear",
    italicAccent: "Architecture",
    desc: "Heavyweight structured jackets and tailored shearling coats built for refined cold-weather layering.",
    image: "https://i.pinimg.com/736x/8e/7a/aa/8e7aaa281f5c892149fcdd0eae6f9c87.jpg",
    spotlightTitle: "Heavyweight Atelier Jacket",
    spotlightPrice: "₹3,499",
    categoryFilter: "Jackets",
  },
  {
    lookNumber: "LOOK 03",
    season: "BESPOKE ARCHIVE",
    title: "Timeless Drape, Bespoke Precision",
    italicAccent: "Precision",
    desc: "Crisp Egyptian cotton shirts engineered with micro-tailored collars and hand-finished mother-of-pearl buttons.",
    image: "https://i.pinimg.com/736x/26/47/f2/2647f21911b94fd48220cf6c69c91e59.jpg",
    spotlightTitle: "Crisp Spread Collar Shirt",
    spotlightPrice: "₹1,899",
    categoryFilter: "Shirts",
  },
  {
    lookNumber: "LOOK 04",
    season: "SUMMER RESORT '26",
    title: "Lightweight Linens for Riviera Days",
    italicAccent: "Linens",
    desc: "Pure breathable flax linens with fluid drape, designed for relaxed coastal sophistication.",
    image: "https://i.pinimg.com/736x/0a/e6/3c/0ae63cc4d304a80e4dfa1ae75c106187.jpg",
    spotlightTitle: "Relaxed Linen Camp Collar",
    spotlightPrice: "₹1,699",
    categoryFilter: "Shirts",
  },
  {
    lookNumber: "LOOK 05",
    season: "STREETWEAR ATELIER",
    title: "Subversive Cuts & High-Density Cotton",
    italicAccent: "Subversive",
    desc: "Elevated streetwear essentials crafted from 450 GSM French terry and custom drop-shoulder silhouettes.",
    image: "https://i.pinimg.com/736x/3e/ca/4c/3eca4cc358012b5c88bfc849e83485a6.jpg",
    spotlightTitle: "Heavyweight Boxy Hoodie",
    spotlightPrice: "₹2,299",
    categoryFilter: "Hoodies",
  },
  {
    lookNumber: "LOOK 06",
    season: "EVENING BLACK TIE",
    title: "Midnight Velvet & Silk Lapels",
    italicAccent: "Midnight",
    desc: "Impeccable evening suiting featuring hand-padded lapels and precision satin trims.",
    image: "https://i.pinimg.com/736x/1b/0d/a2/1b0da24584e1a5f918ce1b3ffca46dd7.jpg",
    spotlightTitle: "Bespoke Evening Tuxedo",
    spotlightPrice: "₹7,999",
    categoryFilter: "Suits",
  },
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  const handleSlideTo = (index) => {
    setActiveIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  const handleExplore = (category) => {
    if (category) {
      navigate(`/filtered/${category}`);
    } else {
      navigate("/filtered/all");
    }
  };

  return (
    <section className={styles.heroSection}>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className={styles.heroSwiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={styles.asymmetricSlide}>
              {/* LEFT: EDITORIAL COPY PANEL */}
              <div className={styles.editorialPane}>
                <div className={styles.kickerRow}>
                  <span className={styles.lookPill}>{slide.lookNumber}</span>
                  <span className={styles.seasonTag}>{slide.season}</span>
                  <span className={styles.atelierBadge}>✦ ATELIER SELECTION</span>
                </div>

                <h1 className={styles.editorialTitle}>
                  {slide.title}
                </h1>

                <p className={styles.editorialDesc}>{slide.desc}</p>

                <div className={styles.ctaGroup}>
                  <button
                    className={styles.primaryCta}
                    onClick={() => handleExplore(slide.categoryFilter)}
                  >
                    <span>EXPLORE THIS LOOK</span>
                    <FiArrowRight size={17} />
                  </button>

                  <button
                    className={styles.secondaryCta}
                    onClick={() => navigate("/about")}
                  >
                    <span>MAISON STORY</span>
                  </button>
                </div>

                {/* INTERACTIVE LOOK SWITCHER TILES */}
                <div className={styles.lookNavTrack}>
                  <span className={styles.lookNavLabel}>RUNWAY LOOKS:</span>
                  <div className={styles.lookButtons}>
                    {slides.map((s, idx) => (
                      <button
                        key={idx}
                        className={`${styles.lookBtn} ${activeIndex === idx ? styles.lookBtnActive : ""
                          }`}
                        onClick={() => handleSlideTo(idx)}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: HIGH-FASHION PORTRAIT FRAME */}
              <div className={styles.portraitPane}>
                <div className={styles.portraitFrame}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={styles.modelImage}
                  />

                  {/* Top-Right High Fashion Ribbon */}
                  <div className={styles.editionTag}>
                    {/* <FiSparkles size={13} /> */}
                    <span>EDITION LIMITÉE // RUNWAY VOL. XXVI</span>
                  </div>

                  {/* FLOATING OVERLAPPING SPOTLIGHT CARD */}
                  <div
                    className={styles.floatingSpotlightCard}
                    onClick={() => handleExplore(slide.categoryFilter)}
                  >
                    <div className={styles.spotlightHeader}>
                      <span className={styles.spotlightEyebrow}>SPOTLIGHT PIECE</span>
                      <span className={styles.spotlightPrice}>{slide.spotlightPrice}</span>
                    </div>
                    <h4 className={styles.spotlightTitle}>{slide.spotlightTitle}</h4>
                    <span className={styles.spotlightAction}>
                      <span>Acquire Piece</span>
                      <FiArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;