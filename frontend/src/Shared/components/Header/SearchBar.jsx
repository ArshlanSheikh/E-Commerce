import { useState } from "react";
import { FiSearch, FiX, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.css";

const TRENDING_SEARCHES = [
  "Bespoke Shirts",
  "Tailored Blazers",
  "Slim Chinos",
  "Cashmere Sweaters",
  "Leather Footwear",
  "Oversized Outerwear",
];

function SearchBar({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (queryToUse) => {
    const query = (queryToUse || searchQuery).trim();
    if (!query) return;

    navigate(`/filtered/all?search=${encodeURIComponent(query)}`);

    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleQuickChip = (term) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  return (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchTopBar}>
          <span className={styles.editorialKicker}>✦ ATELIER SEARCH ARCHIVE</span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close Search"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className={styles.inputWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by garment, fabric, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className={styles.inputField}
          />
          <button
            type="button"
            onClick={() => handleSearch()}
            className={styles.submitBtn}
            aria-label="Submit Search"
          >
            <span>SEARCH</span>
            <FiArrowRight />
          </button>
        </div>

        <div className={styles.trendingSection}>
          <span className={styles.trendingLabel}>CURATED SEARCHES:</span>
          <div className={styles.chipRow}>
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                className={styles.trendingChip}
                onClick={() => handleQuickChip(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;