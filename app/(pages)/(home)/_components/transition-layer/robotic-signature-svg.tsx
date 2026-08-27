"use client"
import { forwardRef } from "react"

/**
 * Hand-crafted SVG outline paths for "ROBOTIC OFC".
 * Each letter is a single continuous stroke path designed for
 * stroke-dasharray / stroke-dashoffset drawing animation.
 *
 * Style: geometric, monoline, futuristic — matches the Robotic brand.
 * ViewBox: 0 0 700 100 (letters ~85px tall, 48-58px wide, 17px gaps)
 */
const LETTER_PATHS = [
  // R — vertical stem + bowl + diagonal leg
  {
    d: "M 8,95 L 8,5 L 38,5 C 48,5 56,10 56,24 C 56,38 48,46 38,46 L 8,46 M 36,46 L 58,95",
    label: "R",
  },
  // O — ellipse
  {
    d: "M 98,5 C 78,5 73,22 73,50 C 73,78 78,95 98,95 C 118,95 123,78 123,50 C 123,22 118,5 98,5",
    label: "O",
  },
  // B — stem + upper bowl + lower bowl
  {
    d: "M 148,95 L 148,5 L 175,5 C 188,5 196,12 196,24 C 196,36 189,43 178,46 L 148,46 L 180,46 C 193,46 201,54 201,68 C 201,82 193,95 178,95 Z",
    label: "B",
  },
  // O — ellipse
  {
    d: "M 241,5 C 221,5 216,22 216,50 C 216,78 221,95 241,95 C 261,95 266,78 266,50 C 266,22 261,5 241,5",
    label: "O",
  },
  // T — crossbar + stem
  {
    d: "M 288,5 L 342,5 M 315,5 L 315,95",
    label: "T",
  },
  // I — top serif + stem + bottom serif
  {
    d: "M 362,5 L 382,5 M 372,5 L 372,95 M 362,95 L 382,95",
    label: "I",
  },
  // C — open arc
  {
    d: "M 448,18 C 440,8 432,5 420,5 C 404,5 396,18 396,50 C 396,82 404,95 420,95 C 432,95 440,92 448,82",
    label: "C",
  },
  // O — ellipse (second word)
  {
    d: "M 510,5 C 490,5 485,22 485,50 C 485,78 490,95 510,95 C 530,95 535,78 535,50 C 535,22 530,5 510,5",
    label: "O",
  },
  // F — stem + top crossbar + mid crossbar
  {
    d: "M 562,95 L 562,5 L 604,5 M 562,46 L 596,46",
    label: "F",
  },
  // C — open arc
  {
    d: "M 672,18 C 664,8 656,5 644,5 C 628,5 620,18 620,50 C 620,82 628,95 644,95 C 656,95 664,92 672,82",
    label: "C",
  },
]

export const RoboticSignatureSVG = forwardRef<SVGSVGElement>((_, ref) => {
  return (
    <svg
      ref={ref}
      viewBox="0 0 690 100"
      className="robotic-signature-svg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Robotic OFC signature"
      role="img"
    >
      {LETTER_PATHS.map((letter, i) => (
        <path
          key={i}
          d={letter.d}
          className="signature-letter"
          data-letter={letter.label}
          data-index={i}
          stroke="#d8b4fe"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </svg>
  )
})

RoboticSignatureSVG.displayName = "RoboticSignatureSVG"
