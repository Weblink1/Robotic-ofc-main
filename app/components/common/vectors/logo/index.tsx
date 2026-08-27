"use client"

import Image from "next/image"

interface LogoProps {
  width: string
  height: string
  fill?: string
}

export const Logo = ({ width, height }: LogoProps) => {
  return (
    <span
      className="robotic-logo-mark"
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
      aria-label="Robotic ofc"
      role="img"
    >
      <Image
        src="/assets/robotic/logo/robotic-logo-black.png"
        alt=""
        aria-hidden="true"
        width={3000}
        height={539}
        className="robotic-logo-layer robotic-logo-layer-black"
        draggable={false}
      />
      <Image
        src="/assets/robotic/logo/robotic-logo-white.png"
        alt=""
        aria-hidden="true"
        width={3000}
        height={539}
        className="robotic-logo-layer robotic-logo-layer-white"
        draggable={false}
      />
    </span>
  )
}
