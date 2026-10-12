// MyOrder.jsx - VIP Client Order Archives & Sartorial Passports
import React, { useEffect, useState, useRef } from "react";
import { FiPackage, FiCalendar, FiMapPin, FiTruck, FiCreditCard, FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/Axios";
import styles from "./MyOrder.module.css";

const STAGGER_DELAY = 120;

const MyOrder = () => {
  const navigate = useNavigate();

  const [visibleOrders, setVisibleOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const staggerTimeouts = useRef([]);
  const requestIdRef = useRef(0);

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const revealStaggered = (batch, requestId) => {
    batch.forEach((order, i) => {
      const timeoutId = setTimeout(() => {
        if (requestIdRef.current !== requestId) return;
        setVisibleOrders((prev) => [...prev, order]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  useEffect(() => {
    GetOrders();
    return () => {
      requestIdRef.current += 1;
      clearStaggerTimeouts();
    };
  }, []);

  const GetOrders = async () => {
    const currentRequestId = ++requestIdRef.current;

    try {
      setLoading(true);
      setError("");
      clearStaggerTimeouts();
      setVisibleOrders([]);

      const { data } = await api.get("/v1/order");

      if (requestIdRef.current !== currentRequestId) return;

      if (data.success) {
        const fetched = data.data || [];
        setTotalCount(fetched.length);
        if (fetched.length > 0) {
          revealStaggered(fetched, currentRequestId);
        }
      }
    } catch (error) {
      if (requestIdRef.current !== currentRequestId) return;
      setError(error.response?.data?.message || "Failed to fetch client orders");
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    }
  };

  const SkeletonOrderCard = ({ delay = 0 }) => (
    <div className={styles.skeletonCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonLine} style={{ width: "160px", height: "14px" }} />
        <div className={styles.skeletonLine} style={{ width: "100px", height: "24px", borderRadius: "999px" }} />
      </div>
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonThumb} />
        <div className={styles.skeletonMeta}>
          <div className={styles.skeletonLine} style={{ width: "60%", height: "16px" }} />
          <div className={styles.skeletonLine} style={{ width: "35%", height: "12px", marginTop: "8px" }} />
          <div className={styles.skeletonLine} style={{ width: "25%", height: "18px", marginTop: "12px" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        {/* EDITORIAL PAGE HEADER */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.kicker}>✦ PRIVATE CLIENT PORTAL</span>
            <h1 className={styles.pageTitle}>Sartorial Acquisitions</h1>
            <p className={styles.pageSubtitle}>
              Review bespoke atelier milestones, dispatch logistics, and official acquisition passes.
            </p>
          </div>

          {!loading && totalCount > 0 && (
            <div className={styles.totalBadge}>
              <span>{totalCount} Total Order{totalCount > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className={styles.ordersGrid}>
            {[1, 2, 3].map((i) => (
              <SkeletonOrderCard key={i} delay={i * 100} />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={GetOrders}>
              Retry Connection
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && !totalCount && (
          <div className={styles.emptyBox}>
            <div className={styles.emptyIcon}>✦</div>
            <h3>No Acquisitions in Archive</h3>
            <p>You have not placed any bespoke orders yet. Explore our runway drops to acquire signature garments.</p>
            <button className={styles.exploreBtn} onClick={() => navigate("/filtered/all")}>
              Explore Runway Collections
            </button>
          </div>
        )}

        {/* ORDERS LIST */}
        {!loading && !error && totalCount > 0 && (
          <div className={styles.ordersGrid}>
            {visibleOrders.map((order) => {
              const dateStr = new Date(order.placedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              const statusLower = order.orderStatus?.toLowerCase() || "pending";

              return (
                <div key={order._id} className={styles.orderPassport}>
                  {/* TOP PASSPORT HEADER */}
                  <div className={styles.passportHeader}>
                    <div className={styles.orderIdent}>
                      <span className={styles.orderNumberLabel}>
                        ACQUISITION NO. <strong>{order.orderNumber}</strong>
                      </span>
                      <span className={styles.orderDate}>
                        <FiCalendar size={13} />
                        <span>Placed on {dateStr}</span>
                      </span>
                    </div>

                    <div className={styles.statusPills}>
                      <span className={`${styles.statusBadge} ${styles[statusLower] || ""}`}>
                        {order.orderStatus}
                      </span>
                      <span className={styles.paymentBadge}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* GARMENTS LIST */}
                  <div className={styles.itemsList}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={styles.garmentRow}
                        onClick={() => navigate(`/product/${item.product}`)}
                      >
                        <img
                          src={item.coverImage?.url || item.coverImage || ""}
                          alt={item.productName}
                          className={styles.garmentThumb}
                        />

                        <div className={styles.garmentDetails}>
                          <div className={styles.garmentTitleRow}>
                            <h4>{item.productName}</h4>
                            <FiArrowUpRight size={16} className={styles.openArrow} />
                          </div>

                          <div className={styles.garmentSpecs}>
                            <span>Tone: {item.selectedVariant?.color || "Standard"}</span>
                            <span>•</span>
                            <span>Fit: {item.selectedVariant?.size || "Standard"}</span>
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>

                          <span className={styles.garmentPrice}>
                            ₹{item.priceAtPurchase} each
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PASSPORT SUMMARY FOOTER */}
                  <div className={styles.passportFooter}>
                    <div className={styles.shippingDestination}>
                      <FiMapPin size={15} className={styles.pinIcon} />
                      <div>
                        <span className={styles.destName}>{order.shippingAddress?.fullName}</span>
                        <span className={styles.destLoc}>
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.country || "India"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.financialSummary}>
                      <div className={styles.finCol}>
                        <span className={styles.finLabel}>SETTLEMENT</span>
                        <span className={styles.finVal}>{order.paymentMethod}</span>
                      </div>
                      <div className={styles.finCol}>
                        <span className={styles.finLabel}>TOTAL INVESTMENT</span>
                        <span className={styles.finTotal}>₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;