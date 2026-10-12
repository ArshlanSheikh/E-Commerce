import React, { useState } from "react";
import styles from "./Footer.module.css";

import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FiArrowUp, FiSend } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire this up to your newsletter API
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.topLine} />

      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandLogoRow}>
            <div className={styles.brandMark}>
              <span>FF</span>
            </div>
            <h2>FancyFashion</h2>
          </div>

          <p>
            Bespoke contemporary menswear designed for the modern gentleman. 
            Impeccable tailoring, luxurious fabrics, and timeless aesthetics.
          </p>

          <div className={styles.socialIcons}>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div className={styles.links}>
          <h3>Collections</h3>
          <a href="#">New Arrivals</a>
          <a href="#">Luxury Shirts</a>
          <a href="#">Tailored Blazers</a>
          <a href="#">Denim & Trousers</a>
        </div>

        {/* Company Links */}
        <div className={styles.links}>
          <h3>Maison</h3>
          <a href="/about">About Us</a>
          <a href="/contact">Client Care</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h3>Private Client Newsletter</h3>

          <p>Receive exclusive early access to runway drops and seasonal promotions.</p>

          <form className={styles.inputBox} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" aria-label="Subscribe">
              <FiSend />
              <span>Join</span>
            </button>
          </form>

          <p className={`${styles.subscribeMsg} ${subscribed ? styles.subscribeMsgShow : ""}`}>
            You&apos;re on the list — welcome to FancyFashion.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} FancyFashion. All rights reserved.</p>

        <div className={styles.bottomLinks}>
          <a href="#">Privacy Policy</a>
          <span className={styles.dot} />
          <a href="#">Terms of Service</a>
        </div>

        <button className={styles.toTop} onClick={scrollToTop} aria-label="Back to top">
          <FiArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;