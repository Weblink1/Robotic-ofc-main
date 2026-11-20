import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Studio Access | Robotic OFC",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
