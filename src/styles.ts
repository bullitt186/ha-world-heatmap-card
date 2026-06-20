import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
    background: var(--ha-card-background, var(--card-background-color));
  }

  .title {
    padding: 12px 16px 0;
    font-size: 16px;
    font-weight: 600;
  }

  .map {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #111820;
    aspect-ratio: var(--map-aspect, 2);
  }

  .map::before,
  .map::after {
    position: absolute;
    inset: 0;
    content: "";
  }

  .map::before {
    width: var(--world-w, 100%);
    height: var(--world-h, 100%);
    left: var(--world-left, 0%);
    top: var(--world-top, 0%);
    right: auto;
    bottom: auto;
    background-image: var(--map-image);
    background-position: center;
    background-size: 100% 100%;
  }

  .map::after {
    z-index: 1;
    pointer-events: none;
  }

  .map-style-dark::before {
    filter: invert(1) hue-rotate(180deg) saturate(0.8) brightness(0.5)
      contrast(1.2);
    opacity: 0.88;
  }

  .map-style-dark::after {
    background: rgba(4, 11, 18, 0.28);
  }

  .map-style-muted::before {
    filter: grayscale(1) brightness(0.58) contrast(1.05);
    opacity: 0.72;
  }

  .map-style-muted::after {
    background: rgba(10, 16, 21, 0.38);
  }

  .map-style-contrast::before {
    filter: grayscale(1) brightness(0.28) contrast(2.2);
    opacity: 0.95;
  }

  .map-style-contrast::after {
    background:
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 8.333333% 16.666667%;
  }

  .map-style-light::before {
    filter: saturate(0.85) brightness(0.9) contrast(0.95);
    opacity: 0.8;
  }

  .map-style-light::after {
    background: rgba(9, 14, 18, 0.12);
  }

  .map-style-grid::before {
    opacity: 0;
  }

  .map-style-grid::after {
    background:
      linear-gradient(rgba(255, 255, 255, 0.13) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.13) 1px, transparent 1px),
      radial-gradient(circle at center, rgba(95, 211, 255, 0.1), transparent 65%);
    background-size: 8.333333% 16.666667%, 8.333333% 16.666667%, 100% 100%;
  }

  canvas {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
  }

  .bounds,
  .message {
    padding: 8px 12px;
    color: var(--secondary-text-color);
    font-size: 12px;
  }

  .editor {
    display: grid;
    gap: 12px;
    padding: 16px;
  }

  .switch-row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--secondary-text-color);
    font-size: 14px;
  }
`;
