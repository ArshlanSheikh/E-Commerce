import styles from "./AdminSidebar.module.css";
import { 
  TrendingUp, 
  Package, 
  CreditCard, 
  Users, 
  Tag, 
  Layers, 
  ShieldCheck 
} from "lucide-react";

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  setActivePage,
}) {
  const handleClick = (page) => {
    setActivePage(page);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.open : ""
        }`}
      >
        <div className={styles.logoBox}>
          <div className={styles.monogram}>FF</div>
          <div>
            <h3 className={styles.logo}>MAISON ATELIER</h3>
            <span className={styles.roleTag}>EXECUTIVE CONSOLE</span>
          </div>
        </div>

        <nav className={styles.navGroup}>
          <button onClick={() => handleClick("sales")} className={styles.navItem}>
            <TrendingUp size={18} />
            <span>Sales Report</span>
          </button>

          <button onClick={() => handleClick("orders")} className={styles.navItem}>
            <Package size={18} />
            <span>Client Orders</span>
          </button>

          <button onClick={() => handleClick("payments")} className={styles.navItem}>
            <CreditCard size={18} />
            <span>Payments & Settlement</span>
          </button>

          <button onClick={() => handleClick("users")} className={styles.navItem}>
            <Users size={18} />
            <span>Client Profiles</span>
          </button>

          <button onClick={() => handleClick("products")} className={styles.navItem}>
            <Tag size={18} />
            <span>Garment Catalog</span>
          </button>

          <button onClick={() => handleClick("categories")} className={styles.navItem}>
            <Layers size={18} />
            <span>Departments</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <ShieldCheck size={16} />
          <span>Atelier Secure Protocol</span>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
