import Link from "next/link"
import { Info, AlertTriangle } from "lucide-react"

export default function VerificationPendingPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="verification-icon">
            <Info />
          </div>
          <h1>Verification Pending</h1>
          <p>Your registration is being reviewed</p>
        </div>
        <div className="auth-content text-center">
          <p>Thank you for registering with Virtual Doc. Our team is currently reviewing your medical credentials.</p>
          <p>
            This process typically takes 1-2 business days. You will receive an email notification once your account has
            been verified.
          </p>
          <div className="alert alert-warning">
            <AlertTriangle />
            <p>If you don't receive a verification email within 2 business days, please contact our support team.</p>
          </div>
        </div>
        <div className="auth-footer">
          <Link href="/" className="btn btn-outline btn-block">
            Return to Home
          </Link>
          <div className="support-link">
            Need help? <a href="mailto:support@virtualdoc.com">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}
