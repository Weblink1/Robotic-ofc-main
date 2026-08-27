import type { Metadata } from "next"
import { Header } from "./components/common/header"
import { PreLoader } from "./components/common/pre-loader"
import "./globals.css"
import { Footer } from "./components/common/footer"

export const metadata: Metadata = {
  title: "Robotic ofc | Afro Tech DJ",
  description: "Official profile website for Botswana Afro Tech DJ Robotic ofc."
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <PreLoader />
        {children}
        <Footer />
      </body>
    </html>
  )
}
