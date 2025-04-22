import Link from "next/link"
import { Heart, Calendar, Video, ClipboardList } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="header">
        <div className="container">
          <Link href="/" className="logo">
            <Heart className="logo-icon" />
            <span>Virtual Doc</span>
          </Link>
          <div className="nav-buttons">
            <Link href="/login" className="btn btn-outline">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="hero">
          <div className="container">
            <h2>Doctor Portal</h2>
            <p>
              A secure platform for healthcare professionals to manage appointments, conduct virtual consultations, and
              provide quality care remotely.
            </p>
            <div className="hero-buttons">
              <Link href="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link href="/about" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2>Key Features</h2>
            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">
                  <Calendar />
                </div>
                <h3>Appointment Management</h3>
                <p>Easily manage your schedule and patient appointments in one place.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Video />
                </div>
                <h3>Secure Video Consultations</h3>
                <p>Conduct HIPAA-compliant virtual consultations with your patients.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <ClipboardList />
                </div>
                <h3>Digital Prescriptions</h3>
                <p>Issue and manage digital prescriptions securely and efficiently.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Heart />
              <h3>Virtual Doc</h3>
            </div>
            <p>Connecting healthcare professionals with patients through secure, convenient virtual consultations.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/security">Security</Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/hipaa">HIPAA Compliance</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Virtual Doc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
