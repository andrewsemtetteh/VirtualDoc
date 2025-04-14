import type React from "react"
import Link from "next/link"
import { Heart, User, Bell, LogOut } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="container">
          <Link href="/dashboard" className="logo">
            <Heart className="logo-icon" />
            <span>Virtual Doc</span>
          </Link>
          <div className="header-icons">
            <Link href="/dashboard/profile" className="header-icon">
              <User />
            </Link>
            <Link href="/dashboard/notifications" className="header-icon">
              <Bell />
            </Link>
            <Link href="/api/auth/signout" className="header-icon">
              <LogOut />
            </Link>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <DashboardNav />
        </aside>

        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  )
}
