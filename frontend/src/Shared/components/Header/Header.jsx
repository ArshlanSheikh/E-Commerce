// Header.jsx - Editorial Haute Couture Navigation
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useNavigate, Link, useLocation } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiUser,
  FiChevronRight,
  FiHome,
  FiSearch,
  FiLogOut,
  FiGrid,
  FiCompass,
  FiArrowUpRight,
} from "react-icons/fi";

import { BsCart3, BsBoxSeam } from "react-icons/bs";

import SignupLogin from "../../../Features/Auth/SignupLogin";
import ViewCartProduct from "../CartComponents/ViewCartProduct";
import { fetchCategories } from "../../../Api/categories";
import SearchBar from "./SearchBar";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const onCloseForm = () => setIsFormOpen(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((loadedCategories) => {
        if (active) {
          setCategories(loadedCategories.map(({ name }) => name));
        }
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const announcements = [
    "COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹999",
    "AUTUMN / WINTER '26 RUNWAY COLLECTION NOW AVAILABLE",
    "USE CODE 'FANCY10' FOR 10% OFF YOUR FIRST ATELIER ACQUISITION",
    "BESPOKE CRAFTSMANSHIP & CONTEMPORARY TAILORING",
  ];

  return (
    <>
      {/* MICRO-EDITORIAL TOP TICKER */}
      <div className={styles.editorialTicker}>
        <div className={styles.tickerTrack}>
          {[...announcements, ...announcements].map((text, index) => (
            <span key={index} className={styles.tickerItem}>
              <span className={styles.tickerDot}>✦</span>
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* MAIN ARCHITECTURAL HAUTE COUTURE HEADER */}
      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
      >
        <div className={styles.headerContainer}>
          {/* LEFT: Curated Department Triggers */}
          <div className={styles.navLeft}>
            <button
              className={styles.mobileMenuToggle}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              <span className={styles.menuLabel}>MENU</span>
            </button>

            <nav className={styles.desktopCuratedNav}>
              <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.navLinkActive : ''}`}>
                RUNWAY
              </Link>
              <Link to="/filtered/all" className={styles.navLink}>
                COLLECTIONS
              </Link>
              <Link to="/about" className={styles.navLink}>
                MAISON
              </Link>
              <Link to="/contact" className={styles.navLink}>
                CONCIERGE
              </Link>
            </nav>
          </div>

          {/* CENTER: Grand Bespoke Brand Emblem */}
          <div className={styles.brandEmblem} onClick={() => navigate("/")}>
            <span className={styles.brandKicker}>MAISON DE MENSWEAR</span>
            <div className={styles.brandTitleWrap}>
              <span className={styles.brandTitle}>FANCYFASHION</span>
            </div>
            <span className={styles.brandSubline}>PARIS • MILANO • NEW DELHI</span>
          </div>

          {/* RIGHT: High-Fashion Utility cluster */}
          <div className={styles.navRight}>
            <button
              className={styles.actionIconBtn}
              onClick={() => setShowSearch(true)}
              aria-label="Search Collection"
              title="Search Archive"
            >
              <FiSearch size={19} />
              <span className={styles.actionText}>SEARCH</span>
            </button>

            {/* Account / VIP Client */}
            {isLoggedIn ? (
              <div className={styles.clientGroup}>
                <div
                  className={styles.clientChip}
                  title={`Logged in as ${user?.firstName || "Client"}`}
                >
                  <span className={styles.clientAvatar}>
                    {(user?.firstName?.[0] || "V").toUpperCase()}
                  </span>
                  <span className={styles.clientName}>
                    {user?.firstName || "Client"}
                  </span>
                </div>
                <button
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                className={styles.actionIconBtn}
                onClick={() => setIsFormOpen(true)}
                aria-label="Account Access"
                title="Sign In / Register"
              >
                <FiUser size={19} />
                <span className={styles.actionText}>SIGN IN</span>
              </button>
            )}

            {/* Orders Archive */}
            <button
              className={styles.actionIconBtn}
              onClick={() => navigate("/order")}
              aria-label="Order Archives"
              title="Orders Archive"
            >
              <BsBoxSeam size={18} />
              <span className={styles.actionText}>ORDERS</span>
            </button>

            {/* Atelier Bag / Cart */}
            <button
              className={styles.cartPillBtn}
              onClick={() => setIsCartOpen(true)}
              aria-label="Atelier Bag"
              title="Atelier Bag"
            >
              <BsCart3 size={18} />
              <span className={styles.cartLabel}>BAG</span>
            </button>
          </div>
        </div>

        {/* SECONDARY EDITORIAL CATEGORY RIBBON */}
        <div className={styles.categoryRibbon}>
          <div className={styles.ribbonTrack}>
            <Link to="/filtered/all" className={styles.ribbonItem}>
              <span>ALL ARCHIVE</span>
            </Link>
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat}
                to={`/filtered/${cat}`}
                className={`${styles.ribbonItem} ${
                  location.pathname === `/filtered/${cat}` ? styles.ribbonItemActive : ""
                }`}
              >
                <span>{cat.toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* FULLSCREEN EDITORIAL MOBILE CURTAIN OVERLAY */}
      <div
        className={`${styles.mobileCurtain} ${menuOpen ? styles.curtainOpen : ""}`}
      >
        <div className={styles.curtainHeader}>
          <div className={styles.curtainBrand} onClick={() => { setMenuOpen(false); navigate("/"); }}>
            <span className={styles.curtainLogo}>FANCYFASHION</span>
            <span className={styles.curtainSub}>HAUTE MENSWEAR</span>
          </div>
          <button
            className={styles.curtainClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX size={26} />
          </button>
        </div>

        <div className={styles.curtainContent}>
          <div className={styles.curtainPrimaryNav}>
            <Link to="/" className={styles.curtainNavLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.curtainNavNum}>01</span>
              <span className={styles.curtainNavText}>RUNWAY HOME</span>
              <FiArrowUpRight className={styles.curtainNavArrow} />
            </Link>
            <Link to="/filtered/all" className={styles.curtainNavLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.curtainNavNum}>02</span>
              <span className={styles.curtainNavText}>ALL COLLECTIONS</span>
              <FiArrowUpRight className={styles.curtainNavArrow} />
            </Link>
            <Link to="/about" className={styles.curtainNavLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.curtainNavNum}>03</span>
              <span className={styles.curtainNavText}>THE MAISON STORY</span>
              <FiArrowUpRight className={styles.curtainNavArrow} />
            </Link>
            <Link to="/contact" className={styles.curtainNavLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.curtainNavNum}>04</span>
              <span className={styles.curtainNavText}>CLIENT CONCIERGE</span>
              <FiArrowUpRight className={styles.curtainNavArrow} />
            </Link>
          </div>

          <div className={styles.curtainCategorySection}>
            <span className={styles.curtainSectionTitle}>CURATED DEPARTMENTS</span>
            <div className={styles.curtainCategoryGrid}>
              {categories.map((cat, idx) => (
                <Link
                  key={cat}
                  to={`/filtered/${cat}`}
                  className={styles.curtainCatItem}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.curtainCatIndex}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.curtainCatName}>{cat}</span>
                  <FiChevronRight size={14} className={styles.curtainCatChevron} />
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.curtainFooter}>
            {isLoggedIn ? (
              <div className={styles.curtainUserBox}>
                <div className={styles.curtainUserGreeting}>
                  <span className={styles.curtainAvatar}>
                    {(user?.firstName?.[0] || "C").toUpperCase()}
                  </span>
                  <div>
                    <p className={styles.curtainUserName}>{user?.firstName} {user?.lastName}</p>
                    <span className={styles.curtainVipTag}>VIP Client</span>
                  </div>
                </div>
                <button className={styles.curtainLogoutBtn} onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className={styles.curtainAuthBtn}
                onClick={() => {
                  setMenuOpen(false);
                  setIsFormOpen(true);
                }}
              >
                <FiUser size={18} />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DEDICATED STICKY MOBILE NAVIGATION DOCK */}
      <nav className={styles.mobileBottomDock}>
        <button
          className={`${styles.dockItem} ${location.pathname === '/' ? styles.dockItemActive : ''}`}
          onClick={() => navigate('/')}
          aria-label="Home"
        >
          <FiHome size={20} />
          <span>Runway</span>
        </button>

        <button
          className={`${styles.dockItem} ${location.pathname.startsWith('/filtered') ? styles.dockItemActive : ''}`}
          onClick={() => navigate('/filtered/all')}
          aria-label="Shop"
        >
          <FiGrid size={20} />
          <span>Catalog</span>
        </button>

        <button
          className={styles.dockItem}
          onClick={() => setShowSearch(true)}
          aria-label="Search"
        >
          <FiSearch size={20} />
          <span>Search</span>
        </button>

        <button
          className={`${styles.dockItem} ${location.pathname === '/order' ? styles.dockItemActive : ''}`}
          onClick={() => navigate('/order')}
          aria-label="Orders"
        >
          <BsBoxSeam size={19} />
          <span>Orders</span>
        </button>

        <button
          className={styles.dockItem}
          onClick={() => setIsCartOpen(true)}
          aria-label="Cart"
        >
          <BsCart3 size={20} />
          <span>Bag</span>
        </button>
      </nav>

      {/* MODALS */}
      {isFormOpen && <SignupLogin close={onCloseForm} />}
      {isCartOpen && <ViewCartProduct onClose={() => setIsCartOpen(false)} />}
      {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
    </>
  );
};

export default Header;