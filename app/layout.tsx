import type { Metadata } from "next"
import { Header } from "./components/common/header"
import { PreLoader } from "./components/common/pre-loader"
import "./globals.css"
import { Footer } from "./components/common/footer"
import { SmoothScroll } from "./components/common/smooth-scroll"

export const metadata: Metadata = {
  title: "Robotic ofc | Afro Tech DJ",
  description: "Official profile website for Botswana Afro Tech DJ Robotic ofc.",
  icons: {
    icon: [
      { url: "/icon.png?v=3", type: "image/png" },
      { url: "/favicon.png?v=3", type: "image/png" },
      { url: "/favicon.ico?v=3" }
    ],
    shortcut: "/icon.png?v=3",
    apple: "/apple-icon.png?v=3"
  }
}

import { BookingModalProvider } from "./components/common/booking-modal"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <BookingModalProvider>
          <SmoothScroll />
          <Header />
          <PreLoader />
          {children}
          <Footer />
        </BookingModalProvider>
      </body>
    </html>
  )
}
