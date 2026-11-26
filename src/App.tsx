import React, { useState, useMemo } from 'react';

const SUPABASE_URL = 'https://asspfwcgvnveejobxrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9';

const EMBEDDED_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800&display=swap');

:root {
  font-family: 'Alexandria', Arial, sans-serif;
  color: #f8fafc;
  background: #020617;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  --emerald: #10b981;
  --muted: #94a3b8;
  --line: rgba(148, 163, 184, 0.14);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}

body {
  margin: 0;
  background: #020617;
  color: #f8fafc;
}

button,
input,
textarea {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
}

.app-shell {
  overflow: hidden;
  background: radial-gradient(ellipse at 15% 0%, rgba(16, 185, 129, 0.08), transparent 38%), #020617;
  min-height: 100vh;
  color: #f8fafc;
}

.container {
  width: min(1160px, calc(100% - 44px));
  margin-inline: auto;
}

.topbar {
  height: 82px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  background: rgba(2, 6, 23, 0.86);
  backdrop-filter: blur(18px);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-wrap,
.nav-actions,
.brand,
.nav-links,
.hero-buttons,
.hero-proof,
.hero-stats,
.section-heading,
.search-box,
.category-row,
.product-bottom,
.metric-top,
.chart-heading,
.chart-foot,
.contact-details a,
.contact-details > div,
.contact-side-top,
.contact-cta,
.footer-inner,
.cart-button {
  display: flex;
  align-items: center;
}

.nav-wrap {
  height: 100%;
  justify-content: space-between;
}

.brand {
  gap: 11px;
}

.brand-mark {
  width: 43px;
  height: 43px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #052e24;
  background: linear-gradient(145deg, #6ee7b7, #10b981);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.brand b {
  display: block;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #f8fafc;
}

.brand small {
  display: block;
  font-size: 9px;
  letter-spacing: 3px;
  color: #6ee7b7;
  font-weight: 700;
  margin-top: 1px;
}

.nav-links {
  gap: 28px;
  color: #aab7c8;
  font-size: 12px;
  font-weight: 500;
}

.nav-links a {
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #6ee7b7;
}

.nav-actions {
  gap: 10px;
}

.cart-button {
  gap: 9px;
  border: 1px solid rgba(16, 185, 129, 0.35);
  background: rgba(16, 185, 129, 0.12);
  color: #d1fae5;
  border-radius: 13px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}

.cart-button:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(52, 211, 153, 0.55);
}

.cart-button em {
  font-style: normal;
  background: #10b981;
  color: #022c22;
  border-radius: 7px;
  min-width: 21px;
  height: 21px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
}

.mobile-menu {
  display: none;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  color: #f8fafc;
}

.hero {
  position: relative;
  padding: 72px 0 0;
  isolation: isolate;
}

.hero-glow {
  position: absolute;
  z-index: -1;
  filter: blur(85px);
  border-radius: 50%;
  opacity: 0.22;
}

.glow-one {
  width: 310px;
  height: 310px;
  background: #059669;
  top: 80px;
  left: 8%;
}

.glow-two {
  width: 230px;
  height: 230px;
  background: #0e7490;
  bottom: 10px;
  right: 18%;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.04fr 0.96fr;
  align-items: center;
  gap: 44px;
  min-height: 450px;
}

.hero-copy {
  padding-bottom: 20px;
}

.eyebrow,
.section-kicker {
  color: #6ee7b7;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.eyebrow {
  padding: 9px 14px;
  border: 1px solid rgba(16, 185, 129, 0.25);
  background: rgba(16, 185, 129, 0.08);
  border-radius: 99px;
}

.pulse-dot,
.online-label i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 5px rgba(52, 211, 153, 0.14);
}

h1 {
  font-size: clamp(32px, 4.4vw, 54px);
  line-height: 1.32;
  letter-spacing: -1.2px;
  margin: 20px 0 16px;
  font-weight: 800;
  color: #f8fafc;
}

h1 span,
.section-heading h2 span,
.trade-intro h2 span,
.center-heading h2 span,
.contact-copy h2 span {
  color: #34d399;
}

.hero-copy > p,
.trade-intro > p,
.contact-copy > p {
  font-size: 13px;
  line-height: 2.05;
  color: #94a3b8;
  max-width: 510px;
  margin: 0;
}

.hero-buttons {
  gap: 20px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.primary-button {
  border: 0;
  border-radius: 13px;
  padding: 13px 20px;
  background: linear-gradient(135deg, #34d399, #059669);
  color: #022c22;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.18);
  transition: transform 0.2s, filter 0.2s;
}

.primary-button:hover {
  transform: translateY(-2px);
  filter: brightness(1.07);
}

.text-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #cbd5e1;
  font-weight: 500;
  transition: color 0.2s;
}

.text-button:hover {
  color: #6ee7b7;
}

.hero-proof {
  gap: 12px;
  margin-top: 34px;
}

.proof-avatars {
  display: flex;
  direction: ltr;
}

.proof-avatars span {
  width: 30px;
  height: 30px;
  margin-left: -7px;
  border: 2px solid #020617;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
  background: #14532d;
  color: #a7f3d0;
}

.proof-avatars span:nth-child(2) {
  background: #164e63;
  color: #a5f3fc;
}

.proof-avatars span:nth-child(3) {
  background: #365314;
  color: #d9f99d;
}

.hero-proof strong,
.hero-proof small {
  display: block;
}

.hero-proof strong {
  font-size: 12px;
  color: #f1f5f9;
}

.hero-proof small {
  font-size: 10px;
  color: #64748b;
  margin-top: 3px;
}

.hero-visual {
  height: 430px;
  position: relative;
  display: grid;
  place-items: center;
}

.visual-ring {
  position: absolute;
  border: 1px solid rgba(52, 211, 153, 0.14);
  border-radius: 50%;
  aspect-ratio: 1;
}

.ring-a {
  width: 370px;
}

.ring-b {
  width: 280px;
  border-style: dashed;
  animation: rotate 45s linear infinite;
}

.visual-center {
  width: 260px;
  height: 260px;
  border-radius: 42%;
  background: radial-gradient(circle at 40% 25%, #164e3d, #064e3b 48%, #052e2b 82%);
  border: 1px solid rgba(110, 231, 183, 0.25);
  box-shadow: 0 30px 90px rgba(5, 150, 105, 0.2), inset 0 0 60px rgba(16, 185, 129, 0.15);
  position: relative;
  display: grid;
  place-items: center;
  transform: rotate(-6deg);
}

.crate {
  position: absolute;
  display: grid;
  place-items: center;
  border-radius: 24px;
}

.crate-back {
  width: 116px;
  height: 118px;
  top: 32px;
  left: 46px;
  color: #d9f99d;
  background: linear-gradient(140deg, #10b981, #047857);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  transform: rotate(12deg);
}

.crate-front {
  width: 132px;
  height: 118px;
  bottom: 26px;
  right: 38px;
  color: #a7f3d0;
  background: linear-gradient(145deg, #059669, #064e3b);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.35);
  transform: rotate(-8deg);
}

.leaf {
  position: absolute;
  color: #6ee7b7;
  filter: drop-shadow(0 8px 10px #022c22);
}

.leaf-one {
  top: 26px;
  right: 26px;
  transform: rotate(30deg);
}

.leaf-two {
  bottom: 28px;
  left: 26px;
  transform: rotate(-30deg);
  color: #34d399;
}

.floating-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 15px;
  padding: 12px 14px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
}

.floating-card b,
.floating-card small {
  display: block;
  white-space: nowrap;
}

.floating-card b {
  font-size: 11px;
  color: #f8fafc;
}

.floating-card small {
  font-size: 9px;
  color: #94a3b8;
  margin-top: 4px;
}

.mini-icon,
.quality-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  font-weight: 700;
}

.card-delivery {
  top: 58px;
  right: 0;
}

.card-quality {
  bottom: 58px;
  left: 0;
}

.visual-label {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  letter-spacing: 2px;
  color: #64748b;
  white-space: nowrap;
  direction: ltr;
}

.visual-label span {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 8px;
}

.hero-stats {
  margin-top: 48px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 22px 0;
  justify-content: space-around;
}

.hero-stats div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hero-stats strong {
  font-size: 22px;
  color: #34d399;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.hero-stats span {
  font-size: 11px;
  color: #94a3b8;
}

.section {
  padding: 90px 0;
}

.section-heading {
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.section-heading h2,
.trade-intro h2,
.center-heading h2,
.contact-copy h2 {
  font-size: clamp(24px, 3vw, 36px);
  line-height: 1.5;
  letter-spacing: -0.8px;
  margin: 8px 0;
  font-weight: 750;
  color: #f8fafc;
}

.section-heading p {
  font-size: 12px;
  color: #94a3b8;
  margin: 4px 0 0;
}

.customer-type-switch {
  display: inline-flex;
  align-items: center;
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
}

.modal-type-switch {
  width: 100%;
  margin-bottom: 14px;
}

.modal-type-switch .type-pill {
  flex: 1;
  text-align: center;
}

.type-pill {
  border: 0;
  background: transparent;
  color: #94a3b8;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  transition: 0.2s;
}

.type-pill.active {
  background: #059669;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
}

.search-box {
  gap: 10px;
  border: 1px solid #1e293b;
  background: #0f172a;
  border-radius: 13px;
  padding: 0 14px;
  width: 260px;
  height: 44px;
  color: #64748b;
}

.search-box input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #e2e8f0;
  font-size: 11px;
}

.search-box kbd {
  font-size: 10px;
  color: #64748b;
}

.category-row {
  gap: 9px;
  overflow: auto;
  padding: 3px 0 18px;
  scrollbar-width: none;
}

.category-row::-webkit-scrollbar {
  display: none;
}

.category-chip {
  white-space: nowrap;
  border: 1px solid #1e293b;
  background: #0b1222;
  color: #94a3b8;
  border-radius: 11px;
  padding: 9px 15px;
  font-size: 11px;
  font-weight: 500;
  transition: 0.2s;
}

.category-chip.active,
.category-chip:hover {
  background: #064e3b;
  border-color: #059669;
  color: #a7f3d0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
}

.product-card {
  border: 1px solid #1e293b;
  background: linear-gradient(150deg, rgba(15, 23, 42, 0.96), rgba(7, 14, 27, 0.98));
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: rgba(16, 185, 129, 0.4);
}

.product-image {
  height: 200px;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.14), transparent 62%), #0b1222;
}

.product-image img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
}

.image-orb {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  filter: blur(2px);
}

.product-emoji {
  font-size: 70px;
  filter: drop-shadow(0 15px 12px rgba(0, 0, 0, 0.3));
  position: relative;
  z-index: 1;
}

.availability {
  position: absolute;
  top: 13px;
  right: 13px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(2, 6, 23, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 8px;
  padding: 6px 9px;
  font-size: 9px;
  color: #a7f3d0;
}

.availability i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #34d399;
}

.product-info {
  padding: 17px;
}

.product-category {
  font-size: 10px;
  color: #34d399;
  font-weight: 600;
}

.product-info h3 {
  font-size: 15px;
  margin: 7px 0;
  font-weight: 650;
  color: #f8fafc;
}

.product-info > p {
  font-size: 10.5px;
  color: #94a3b8;
  line-height: 1.75;
  min-height: 36px;
  margin: 0 0 16px;
}

.product-bottom {
  justify-content: space-between;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  padding-top: 14px;
  gap: 8px;
}

.product-bottom strong {
  font-size: 18px;
  display: block;
  color: #f8fafc;
}

.product-bottom strong small {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 400;
}

.product-bottom > div > span {
  display: block;
  font-size: 9.5px;
  color: #64748b;
  margin-top: 4px;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.28);
  color: #6ee7b7;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 10.5px;
  font-weight: 600;
  transition: 0.2s;
}

.add-button:hover {
  background: #059669;
  color: #022c22;
}

.market-note {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-top: 22px;
  color: #64748b;
  font-size: 10.5px;
  line-height: 1.9;
}

.market-note svg {
  flex-shrink: 0;
  color: #34d399;
}

.empty-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  padding: 46px 20px;
  color: #64748b;
  border: 1px dashed #1e293b;
  border-radius: 20px;
  text-align: center;
}

.empty-state b {
  color: #cbd5e1;
  font-size: 14px;
}

.empty-state span {
  font-size: 11px;
}

.trade-section {
  padding-top: 30px;
}

.trade-panel {
  border: 1px solid rgba(16, 185, 129, 0.18);
  border-radius: 28px;
  padding: 40px;
  background: radial-gradient(ellipse at 10% 15%, rgba(16, 185, 129, 0.1), transparent 36%), linear-gradient(145deg, #0f172a, #080e1b);
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 40px;
  position: relative;
  overflow: hidden;
}

.trade-intro h2 {
  font-size: 31px;
  margin: 12px 0;
}

.trade-intro > p {
  font-size: 11.5px;
  max-width: 350px;
}

.outline-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 11px;
  padding: 11px 15px;
  color: #a7f3d0;
  font-size: 10.5px;
  font-weight: 600;
  margin-top: 18px;
  transition: 0.2s;
}

.outline-button:hover {
  background: rgba(16, 185, 129, 0.12);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(2, 6, 23, 0.5);
  border-radius: 16px;
  padding: 17px;
}

.metric-top {
  justify-content: space-between;
  color: #94a3b8;
  font-size: 10.5px;
}

.metric-card > strong {
  font-size: 25px;
  display: block;
  margin: 16px 0 6px;
  color: #e2e8f0;
}

.metric-card > small {
  font-size: 9.5px;
  color: #64748b;
}

.metric-highlight {
  border-color: rgba(16, 185, 129, 0.35);
  background: rgba(6, 78, 59, 0.24);
}

.metric-highlight > strong {
  color: #6ee7b7;
  font-size: 20px;
}

.trade-chart {
  grid-column: 1 / -1;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(2, 6, 23, 0.42);
  border-radius: 16px;
  padding: 18px 20px 14px;
}

.chart-heading {
  justify-content: space-between;
  font-size: 10.5px;
  color: #cbd5e1;
}

.chart-heading small {
  color: #64748b;
}

.chart-bars {
  height: 92px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  background: repeating-linear-gradient(to bottom, transparent 0, transparent 22px, rgba(148, 163, 184, 0.06) 23px);
}

.chart-bars span {
  flex: 1;
  min-width: 4px;
  border-radius: 5px 5px 0 0;
  background: linear-gradient(to top, #047857, #34d399);
  opacity: 0.8;
}

.chart-foot {
  justify-content: space-between;
  color: #64748b;
  font-size: 9.5px;
  padding-top: 9px;
}

.center-heading {
  text-align: center;
  margin-bottom: 40px;
}

.center-heading h2 {
  margin-top: 10px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 17px;
}

.step-card {
  border: 1px solid #1e293b;
  background: linear-gradient(145deg, #0f172a, #080e1b);
  border-radius: 20px;
  padding: 25px;
  position: relative;
  overflow: hidden;
}

.step-number {
  position: absolute;
  top: 18px;
  left: 20px;
  font-size: 28px;
  font-weight: 300;
  color: rgba(52, 211, 153, 0.28);
}

.step-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 14px;
  background: rgba(16, 185, 129, 0.12);
  color: #6ee7b7;
  margin-bottom: 20px;
  font-size: 20px;
}

.step-card h3 {
  font-size: 15px;
  margin: 0 0 10px;
  color: #f8fafc;
}

.step-card p {
  font-size: 11px;
  line-height: 1.95;
  color: #94a3b8;
  margin: 0;
}

.contact-section {
  padding-top: 20px;
  padding-bottom: 90px;
}

.contact-panel {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  border: 1px solid #1e293b;
  border-radius: 27px;
  overflow: hidden;
  background: #0b1222;
}

.contact-copy {
  padding: 40px;
}

.contact-copy h2 {
  font-size: 31px;
  margin: 10px 0;
}

.contact-copy > p {
  font-size: 11.5px;
  max-width: 410px;
}

.contact-details {
  display: grid;
  gap: 15px;
  margin-top: 26px;
}

.contact-details a,
.contact-details > div {
  gap: 12px;
}

.contact-details > a > span,
.contact-details > div > span {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(16, 185, 129, 0.22);
  background: rgba(16, 185, 129, 0.1);
  color: #6ee7b7;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.contact-details small,
.contact-details b {
  display: block;
}

.contact-details small {
  font-size: 9.5px;
  color: #64748b;
  margin-bottom: 4px;
}

.contact-details b {
  font-size: 11.5px;
  color: #e2e8f0;
  font-weight: 500;
}

.contact-side {
  padding: 35px;
  background: linear-gradient(145deg, #064e3b, #052e2b);
  position: relative;
  overflow: hidden;
  min-height: 380px;
}

.contact-side-top {
  justify-content: space-between;
}

.contact-symbol {
  width: 52px;
  height: 52px;
  border-radius: 17px;
  background: rgba(167, 243, 208, 0.14);
  border: 1px solid rgba(167, 243, 208, 0.2);
  display: grid;
  place-items: center;
  color: #a7f3d0;
  font-size: 22px;
}

.online-label {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 9.5px;
  color: #a7f3d0;
  background: rgba(2, 44, 34, 0.45);
  border-radius: 20px;
  padding: 9px 12px;
}

.online-label i {
  width: 6px;
  height: 6px;
  box-shadow: none;
}

.contact-side h3 {
  font-size: 27px;
  line-height: 1.55;
  margin: 32px 0 10px;
  position: relative;
  z-index: 1;
  color: #ffffff;
}

.contact-side p {
  font-size: 11.5px;
  color: #a7f3d0;
  line-height: 1.85;
  margin: 0 0 24px;
  position: relative;
  z-index: 1;
}

.contact-cta {
  position: relative;
  z-index: 2;
  width: max-content;
  gap: 12px;
  background: #d1fae5;
  color: #064e3b;
  padding: 13px 18px;
  border: 0;
  border-radius: 11px;
  font-size: 11.5px;
  font-weight: 700;
  transition: transform 0.2s, background 0.2s;
}

.contact-cta:hover {
  transform: translateY(-2px);
  background: #ecfdf5;
}

.contact-pattern {
  position: absolute;
  bottom: -30px;
  left: -20px;
  color: rgba(167, 243, 208, 0.08);
  transform: rotate(-15deg);
}

.footer {
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  padding: 24px 0;
  background: #020617;
}

.footer-inner {
  justify-content: space-between;
  gap: 20px;
  color: #64748b;
  font-size: 10.5px;
}

.footer-brand .brand-mark {
  width: 35px;
  height: 35px;
  border-radius: 11px;
}

.footer-brand b {
  font-size: 15px;
}

.footer-brand small {
  font-size: 7px;
}

.footer-inner > a:last-child {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #94a3b8;
}

.toast {
  position: fixed;
  bottom: 22px;
  left: 22px;
  z-index: 100;
  max-width: min(440px, calc(100vw - 44px));
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 14px 15px;
  background: #0f172a;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.toast > span {
  color: #34d399;
}

.toast.error > span {
  color: #fbbf24;
}

.toast p {
  font-size: 11px;
  line-height: 1.8;
  color: #e2e8f0;
  margin: 0;
  flex: 1;
}

.toast button {
  border: 0;
  background: none;
  color: #94a3b8;
  padding: 3px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(1, 4, 15, 0.82);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  padding: 20px;
}

.order-modal {
  width: min(490px, 100%);
  max-height: 90vh;
  overflow: auto;
  border: 1px solid #263449;
  border-radius: 24px;
  background: #0b1222;
  color: #f8fafc;
  padding: 25px;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.6);
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-head h2 {
  font-size: 22px;
  margin: 7px 0 16px;
  color: #f8fafc;
}

.modal-close {
  border: 1px solid #263449;
  background: #111c2e;
  color: #94a3b8;
  border-radius: 10px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
}

.order-summary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 11px;
  background: #101b2e;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 18px;
  font-size: 11px;
  color: #94a3b8;
}

.order-summary > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-summary > b {
  color: #e2e8f0;
}

.order-summary > div:last-child {
  grid-column: 1 / -1;
  justify-content: space-between;
  border-top: 1px solid #263449;
  padding-top: 12px;
}

.order-summary > div:last-child b {
  color: #6ee7b7;
  font-size: 14px;
}

.order-summary small {
  font-size: 9px;
  font-weight: 400;
}

.order-form {
  display: grid;
  gap: 14px;
}

.order-form label {
  display: grid;
  gap: 8px;
  color: #cbd5e1;
  font-size: 11px;
}

.order-form input,
.order-form textarea {
  width: 100%;
  border: 1px solid #263449;
  border-radius: 11px;
  background: #060d1b;
  color: #f8fafc;
  padding: 12px 13px;
  outline: none;
  font-size: 11.5px;
  resize: vertical;
}

.order-form input:focus,
.order-form textarea:focus {
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}

.order-form input::placeholder,
.order-form textarea::placeholder {
  color: #475569;
}

.form-hint {
  font-size: 10px;
  color: #64748b;
  line-height: 1.8;
}

.submit-button {
  width: 100%;
  margin-top: 2px;
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(2, 44, 34, 0.3);
  border-top-color: #022c22;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.cart-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 0 16px;
  max-height: 240px;
  overflow: auto;
}

.cart-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line, rgba(148, 163, 184, 0.18));
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.55);
}

.cart-line-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.cart-line-info b {
  font-size: 13px;
  color: #f8fafc;
}

.cart-line-info small {
  font-size: 11px;
  color: var(--muted, #94a3b8);
}

.cart-quantity {
  display: flex;
  align-items: center;
  gap: 9px;
}

.cart-quantity button {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.15);
  color: #f8fafc;
  font-size: 16px;
}

.cart-quantity strong {
  min-width: 16px;
  text-align: center;
  font-size: 13px;
  color: #f8fafc;
}

.cart-line-total {
  font-size: 12.5px;
  white-space: nowrap;
  color: #6ee7b7;
}

.cart-empty {
  margin: 12px 0 16px;
  padding: 20px 14px;
  border: 1px dashed rgba(148, 163, 184, 0.25);
  border-radius: 14px;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .nav-links {
    gap: 18px;
  }
  .hero-grid {
    gap: 15px;
  }
  .hero-visual {
    transform: scale(0.9);
  }
  .trade-panel {
    padding: 30px;
    gap: 25px;
  }
  .contact-copy {
    padding: 32px;
  }
  .contact-side {
    padding: 30px;
  }
  .section {
    padding: 75px 0;
  }
  .trade-section {
    padding-top: 20px;
  }
  .product-grid {
    gap: 13px;
  }
}

@media (max-width: 700px) {
  .container {
    width: min(100% - 32px, 540px);
  }
  .topbar {
    height: 70px;
  }
  .brand-mark {
    width: 39px;
    height: 39px;
  }
  .brand b {
    font-size: 17px;
  }
  .nav-links {
    display: none;
    position: absolute;
    top: 70px;
    right: 0;
    left: 0;
    padding: 20px 22px;
    background: #050b19;
    border-bottom: 1px solid #1e293b;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .nav-links.open {
    display: flex;
  }
  .nav-links a {
    padding: 13px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  }
  .mobile-menu {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
  }
  .cart-button {
    padding: 9px 10px;
  }
  .cart-button span {
    display: none;
  }
  .hero {
    padding-top: 40px;
  }
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .hero-copy {
    padding-bottom: 0;
  }
  .hero h1 {
    font-size: clamp(32px, 8.5vw, 44px);
    letter-spacing: -1px;
    margin: 18px 0 12px;
  }
  .hero-copy > p {
    font-size: 12px;
  }
  .hero-buttons {
    gap: 16px;
    margin-top: 22px;
  }
  .hero-proof {
    margin-top: 24px;
  }
  .hero-visual {
    height: 330px;
    transform: scale(0.82);
    margin: -5px 0 -25px;
  }
  .ring-a {
    width: 320px;
  }
  .ring-b {
    width: 250px;
  }
  .visual-center {
    width: 235px;
    height: 235px;
  }
  .crate-back {
    width: 105px;
    height: 110px;
    top: 30px;
    left: 42px;
  }
  .crate-front {
    width: 120px;
    height: 110px;
    bottom: 23px;
    right: 34px;
  }
  .card-delivery {
    top: 35px;
    right: -4px;
  }
  .card-quality {
    bottom: 35px;
    left: -5px;
  }
  .hero-stats {
    margin-top: 28px;
    padding: 18px 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .hero-stats div {
    gap: 10px;
  }
  .hero-stats strong {
    font-size: 20px;
  }
  .hero-stats span {
    font-size: 10px;
  }
  .section {
    padding: 60px 0;
  }
  .section-heading {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 22px;
  }
  .section-heading h2,
  .trade-intro h2,
  .center-heading h2,
  .contact-copy h2 {
    font-size: 26px;
  }
  .section-heading p {
    line-height: 1.85;
  }
  .search-box {
    width: 100%;
  }
  .category-row {
    margin-inline: -16px;
    padding-inline: 16px;
  }
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .product-image {
    height: 150px;
  }
  .product-emoji {
    font-size: 56px;
  }
  .product-info {
    padding: 12px;
  }
  .product-info h3 {
    font-size: 13px;
  }
  .product-info > p {
    font-size: 9.5px;
    line-height: 1.75;
    min-height: 32px;
  }
  .product-bottom strong {
    font-size: 16px;
  }
  .add-button {
    padding: 9px;
  }
  .add-button span {
    display: none;
  }
  .trade-section {
    padding-top: 5px;
  }
  .trade-panel {
    grid-template-columns: 1fr;
    padding: 22px;
    gap: 20px;
    border-radius: 21px;
  }
  .trade-intro h2 {
    font-size: 27px;
  }
  .trade-intro > p {
    font-size: 10.5px;
  }
  .metrics-grid {
    gap: 9px;
  }
  .metric-card {
    padding: 13px;
  }
  .metric-top {
    font-size: 9px;
  }
  .metric-card > strong {
    font-size: 22px;
    margin: 14px 0 6px;
  }
  .metric-card > small {
    font-size: 8.5px;
  }
  .trade-chart {
    padding: 15px;
  }
  .chart-bars {
    gap: 5px;
  }
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 11px;
  }
  .step-card {
    padding: 20px;
  }
  .step-icon {
    margin-bottom: 15px;
  }
  .center-heading {
    margin-bottom: 24px;
  }
  .contact-section {
    padding-top: 0;
    padding-bottom: 60px;
  }
  .contact-panel {
    grid-template-columns: 1fr;
    border-radius: 22px;
  }
  .contact-copy {
    padding: 25px;
  }
  .contact-copy h2 {
    font-size: 27px;
  }
  .contact-copy > p {
    font-size: 10.5px;
  }
  .contact-details {
    margin-top: 20px;
  }
  .contact-side {
    min-height: 340px;
    padding: 25px;
  }
  .contact-side h3 {
    font-size: 25px;
    margin-top: 28px;
  }
  .footer-inner {
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }
  .footer-inner > span {
    order: 3;
    width: 100%;
  }
  .footer-inner > a:last-child {
    font-size: 9.5px;
  }
  .toast {
    left: 12px;
    bottom: 12px;
    max-width: calc(100vw - 24px);
  }
  .order-modal {
    padding: 20px;
    border-radius: 20px;
  }
}

@media (max-width: 480px) {
  .cart-line {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }
  .cart-line-total {
    grid-column: 1 / -1;
    text-align: left;
  }
}

@media (max-width: 380px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  .product-image {
    height: 190px;
  }
  .product-info > p {
    min-height: 0;
  }
  .hero-buttons {
    align-items: flex-start;
    flex-direction: column;
  }
  .hero-visual {
    transform: scale(0.72);
    margin: -20px 0 -45px;
  }
}
`;

interface Product {
  id: number;
  name: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  unit: string;
  description: string;
  image: string;
  emoji: string;
  available: boolean;
}

type CustomerType = 'wholesale' | 'retail';

interface CartItem {
  product: Product;
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'أرز أبيض مصري فاخر (شكارة / عبوة)',
    category: 'بقالة وسلع أساسية',
    wholesalePrice: 26,
    retailPrice: 32,
    unit: 'كجم',
    description: 'أرز مصري نقي عريض الحبة مناسب للبيت والسوبر ماركت والتجار.',
    image: '1000250092.jpg',
    emoji: '🌾',
    available: true,
  },
  {
    id: 2,
    name: 'زيوت طعام نقية ومعلبات غذائية',
    category: 'زيوت ومعلبات',
    wholesalePrice: 68,
    retailPrice: 80,
    unit: 'عبوة',
    description: 'تشكيلة زيوت قلي وطهي ومعلبات غذائية بجودة عالية وتوريد منتظم.',
    image: '1000250093.jpg',
    emoji: '🫙',
    available: true,
  },
  {
    id: 3,
    name: 'خضروات وفواكه طازجة يومياً',
    category: 'طعام وطازج',
    wholesalePrice: 18,
    retailPrice: 24,
    unit: 'كجم',
    description: 'أصناف طازجة ومفرزة يومياً للمنازل والمطاعم ومحلات السوبر ماركت.',
    image: '1000250094.jpg',
    emoji: '🛒',
    available: true,
  },
  {
    id: 4,
    name: 'منظفات وعناية بالمنزل',
    category: 'مستلزمات البيت والمنظفات',
    wholesalePrice: 45,
    retailPrice: 58,
    unit: 'عبوة',
    description: 'مساحيق غسيل ومطهرات ومنظفات أسطح ومستلزمات نظافة يومية للمنزل.',
    image: '1000250095.jpg',
    emoji: '🧴',
    available: true,
  },
  {
    id: 5,
    name: 'ألبان وأجبان ومخبوزات',
    category: 'ألبان ومخبوزات',
    wholesalePrice: 34,
    retailPrice: 42,
    unit: 'عبوة',
    description: 'منتجات ألبان وأجبان ومخبوزات طازجة لاحتياجات الأسرة والسوبر ماركت.',
    image: '1000250096.jpg',
    emoji: '🧀',
    available: true,
  },
  {
    id: 6,
    name: 'مستلزمات ورقية وأدوات مطبخ',
    category: 'مستلزمات البيت والمنظفات',
    wholesalePrice: 29,
    retailPrice: 38,
    unit: 'عبوة',
    description: 'مناديل ورقية، أكياس حفظ وتغليف، وأدوات منزلية عملية للاستخدام اليومي.',
    image: '1000250097.jpg',
    emoji: '🧺',
    available: true,
  },
];

const WEEKLY_CHART_BARS = [45, 62, 56, 78, 72, 88, 95];
const WEEK_DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [customerType, setCustomerType] = useState<CustomerType>('retail');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(PRODUCTS.map((p) => p.category)));
    return ['الكل', ...unique];
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'الكل' || product.category === selectedCategory;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery && product.available;
    });
  }, [selectedCategory, searchQuery]);

  const getUnitPrice = (product: Product) =>
    customerType === 'wholesale' ? product.wholesalePrice : product.retailPrice;

  const customerTypeLabel = customerType === 'wholesale' ? 'تاجر (جملة)' : 'عميل قطاعي';

  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalCartPrice = useMemo(
    () => cart.reduce((sum, item) => sum + getUnitPrice(item.product) * item.quantity, 0),
    [cart, customerType]
  );

  function showToast(message: string, isError = false) {
    setToast({ message, isError });
  }

  function handleAddToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`تمت إضافة "${product.name}" إلى سلة الطلبات`);
  }

  function updateCartQuantity(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  async function handleOrderSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      showToast('يرجى إدخال اسم العميل ورقم الهاتف لإتمام الطلب', true);
      return;
    }

    const itemsSummary =
      cart.length > 0
        ? cart
            .map((item) => {
              const unitPrice = getUnitPrice(item.product);
              return `${item.product.name} (${item.quantity} ${item.product.unit} × ${unitPrice} ج.م)`;
            })
            .join(' | ')
        : 'طلب مباشر من السوبر ماركت / مستلزمات البيت';

    const combinedNotes = [
      `نوع الحساب: ${customerTypeLabel}`,
      `الأصناف: ${itemsSummary}`,
      totalCartPrice > 0 ? `الإجمالي التقديري: ${totalCartPrice} ج.م` : null,
      notes.trim() ? `ملاحظات العميل: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' — ');

    setLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          notes: combinedNotes,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'تعذر تسجيل الطلب في قاعدة البيانات');
      }

      setCustomerName('');
      setPhone('');
      setNotes('');
      setCart([]);
      setIsOrderModalOpen(false);
      showToast('تم إرسال طلبك بنجاح! سيتواصل معك فريق زاد لينك قريباً.');
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء الإرسال';
      const friendlyMessage =
        rawMessage === 'Failed to fetch'
          ? 'تعذر الاتصال بخادم قاعدة البيانات حالياً. تأكد من تفعيل مشروع Supabase أو تواصل معنا مباشرة على 01224966506.'
          : rawMessage;
      showToast(`تنبيه: ${friendlyMessage}`, true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="app-shell">
      <style>{EMBEDDED_STYLES}</style>

      <header className="topbar">
        <div className="container nav-wrap">
          <a href="#top" className="brand">
            <div className="brand-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <b>زاد لينك</b>
              <small>ZADLINK</small>
            </div>
          </a>

          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#products" onClick={() => setMobileMenuOpen(false)}>المنتجات والأسعار</a>
            <a href="#trade" onClick={() => setMobileMenuOpen(false)}>مؤشر التداول</a>
            <a href="#steps" onClick={() => setMobileMenuOpen(false)}>آلية الطلب</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>تواصل معنا</a>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="cart-button"
              onClick={() => setIsOrderModalOpen(true)}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>سلة الطلبات</span>
              <em>{totalCartItems}</em>
            </button>

            <button
              type="button"
              className="mobile-menu"
              aria-label="القائمة"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="pulse-dot" />
              زاد لينك • سوق متكامل للطعام ومستلزمات البيت والسوبر ماركت
            </div>

            <h1>
              كل احتياجات الطعام <span>ومستلزمات البيت</span> للتاجر والقطاعي
            </h1>

            <p>
              منصة زاد لينك تجمع كل ما تحتاجه الأسرة والسوبر ماركت والتجار من مواد غذائية، بقالة، منظفات، ومستلزمات منزلية بتسعير واضح وتوصيل سريع.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="primary-button"
                onClick={() => setIsOrderModalOpen(true)}
              >
                <span>سجّل طلبك الآن</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>

              <a href="#products" className="text-button">
                <span>تصفح المنتجات والأسعار</span>
              </a>
            </div>

            <div className="hero-proof">
              <div className="proof-avatars">
                <span>ز</span>
                <span>ل</span>
                <span>ك</span>
              </div>
              <div>
                <strong>خدمة التاجر والعميل القطاعي</strong>
                <small>طعام • مستلزمات بيت • سوبر ماركت</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-ring ring-a" />
            <div className="visual-ring ring-b" />

            <div className="visual-center">
              <div className="crate crate-back">
                <span style={{ fontSize: '36px' }}>🛒</span>
              </div>
              <div className="crate crate-front">
                <span style={{ fontSize: '40px' }}>🧺</span>
              </div>
              <span className="leaf leaf-one">✨</span>
              <span className="leaf leaf-two">🌿</span>
            </div>

            <div className="floating-card card-delivery">
              <div className="mini-icon">🚚</div>
              <div>
                <b>توصيل سريع للمنزل والمتجر</b>
                <small>طلب سهل ومباشر للبيت والتاجر</small>
              </div>
            </div>

            <div className="floating-card card-quality">
              <div className="quality-icon">✓</div>
              <div>
                <b>تنوع شامل وسوبر ماركت</b>
                <small>غذاء، بقالة، ومستلزمات منزلية</small>
              </div>
            </div>

            <div className="visual-label">
              <span />
              ZADLINK MARKET • WHOLESALE &amp; RETAIL
            </div>
          </div>
        </div>

        <div className="container">
          <div className="hero-stats">
            <div>
              <strong>+120</strong>
              <span>صنف غذائي ومنزلي</span>
            </div>
            <div>
              <strong>جملة + قطاعي</strong>
              <span>تسعير مرن لكل فئة</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>استقبال الطلبات يومياً</span>
            </div>
            <div>
              <strong>سريع</strong>
              <span>تجهيز وتوصيل منظم</span>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">قائمة المنتجات — تاجر وعميل قطاعي</span>
              <h2>
                منتجات الطعام <span>ومستلزمات البيت</span>
              </h2>
              <p>اختر نوع حسابك لعرض أسعار الجملة للتجار أو الأسعار القطاعية للعملاء.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div className="customer-type-switch" role="group" aria-label="نوع العميل">
                <button
                  type="button"
                  className={`type-pill ${customerType === 'wholesale' ? 'active' : ''}`}
                  onClick={() => setCustomerType('wholesale')}
                >
                  تاجر (جملة)
                </button>
                <button
                  type="button"
                  className={`type-pill ${customerType === 'retail' ? 'active' : ''}`}
                  onClick={() => setCustomerType('retail')}
                >
                  عميل قطاعي
                </button>
              </div>

              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن أرز، زيوت، منظفات..."
                />
                <kbd>بحث</kbd>
              </div>
            </div>
          </div>

          <div className="category-row" role="tablist" aria-label="تصنيفات المنتجات">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const unitPrice = getUnitPrice(product);
                return (
                  <article key={product.id} className="product-card">
                    <div className="product-image">
                      <span className="availability">
                        <i />
                        متوفر بالمنصة
                      </span>
                      <div className="image-orb" />
                      <span className="product-emoji" aria-hidden="true">
                        {product.emoji}
                      </span>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>

                      <div className="product-bottom">
                        <div>
                          <strong>
                            {unitPrice} <small>ج.م / {product.unit}</small>
                          </strong>
                          <span>
                            {customerType === 'wholesale'
                              ? `سعر التاجر (قطاعي: ${product.retailPrice} ج.م)`
                              : `سعر العميل القطاعي (تاجر: ${product.wholesalePrice} ج.م)`}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="add-button"
                          onClick={() => handleAddToCart(product)}
                        >
                          <span>أضف للطلب</span>
                          <strong>+</strong>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <b>لا توجد منتجات مطابقة لبحثك حالياً</b>
              <span>جرّب كلمة بحث أخرى أو اختر تصنيف «الكل».</span>
            </div>
          )}

          <div className="market-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              تتوفر خيارات الشراء للتاجر بسعر الجملة وللعميل القطاعي بسعر التجزئة، مع إمكانية إضافة أي أصناف أو طلبات منزلية إضافية في نموذج الطلب.
            </span>
          </div>
        </div>
      </section>

      <section id="trade" className="section trade-section">
        <div className="container">
          <div className="trade-panel">
            <div className="trade-intro">
              <span className="section-kicker">مؤشر حركة التداول والطلبات</span>
              <h2>
                بيانات حية لحركة <span>البيع والتوريد</span>
              </h2>
              <p>
                متابعة مستمرة لحركة الطلبات اليومية بين التاجر والعميل القطاعي عبر أقسام الطعام ومستلزمات البيت والسوبر ماركت.
              </p>
              <a href="#contact" className="outline-button">
                <span>تواصل لترتيب طلباتك</span>
                <span>←</span>
              </a>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <s
