import React from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import GetTopRetedProducts from "../../components/Products/GetTopRatedProducts/GetTopRetedProducts";
import AllCategoryProduct from "../../components/Products/CategoryWiseProducts/AllCategoryProduct";
import HomePageBanner1 from "../../components/Banner/HomePageBanner1";
import CategoryNavbar from "../../components/CategoryNavBar/CategoryNavBar";
import styles from "./Home.module.css";
import { FiShield, FiScissors, FiCompass, FiAward } from "react-icons/fi";

const Home = () => {
  return (

    
    <div className={styles.homeContainer}>
      {/* 1. RUNWAY HERO SECTION */}
      <HeroSection />

      {/* 2. CURATED DEPARTMENTS / BENTO CAROUSEL */}
      <CategoryNavbar />

      {/* 3. EDITORIAL BRAND MANIFESTO & CRAFTSMANSHIP RIBBON */}
      {/* <section className={styles.manifestoSection}>
        <div className={styles.manifestoContainer}>
          <span className={styles.manifestoKicker}>✦ THE ATELIER PHILOSOPHY ✦</span>
          <h2 className={styles.manifestoTitle}>
            &ldquo;We do not follow trends. We sculpt timeless silhouettes for the contemporary gentleman.&rdquo;
          </h2>
          <p className={styles.manifestoSub}>
            Founded on the pillars of bespoke craftsmanship, ethical luxury sourcing, and immaculate architectural tailoring.
          </p>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <FiScissors size={20} />
              </div>
              <h4>Artisanal Tailoring</h4>
              <p>Hand-finished collars, taped seams, and contoured cuts engineered for effortless presence.</p>
            </div>

            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <FiAward size={20} />
              </div>
              <h4>Noble Sourced Yarns</h4>
              <p>Extra-long staple cottons, fine Australian merino, and pure Irish flax linens.</p>
            </div>

            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <FiCompass size={20} />
              </div>
              <h4>Modern Silhouette</h4>
              <p>Balanced drape calibrated to accentuate modern posture without sacrificing daylong comfort.</p>
            </div>

            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <FiShield size={20} />
              </div>
              <h4>Unrivaled Longevity</h4>
              <p>Reinforced gussets and luxury wash resistance designed to outlast fast-fashion cycles.</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 4. ASYMMETRIC ICON ARCHIVES (TOP RATED) */}
      <GetTopRetedProducts />

      {/* 5. EDITORIAL CAMPAIGN SPREAD & CAPSULE DROP */}
      <HomePageBanner1 />

      {/* 6. ALL DEPARTMENT ARCHIVES */}
      <AllCategoryProduct />
    </div>
  );
};

export default Home;
