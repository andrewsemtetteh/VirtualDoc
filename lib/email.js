import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, fullName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@virtualdoc.com',
      to: email,
      subject: 'Welcome to VirtualDoc - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to VirtualDoc, ${fullName}!</h2>
          <p>Thank you for registering as a doctor on our platform. Your account is currently pending verification.</p>
          <p>Our admin team will review your credentials and approve your account shortly.</p>
          <p>You will receive another email once your account has been verified.</p>
          <br>
          <p>Best regards,<br>The VirtualDoc Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email, resetToken) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@virtualdoc.com',
      to: email,
      subject: 'VirtualDoc - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>You requested a password reset for your VirtualDoc account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <br>
          <p>Best regards,<br>The VirtualDoc Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

export async function sendAdminNotificationEmail(doctorName, status) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@virtualdoc.com',
      to: process.env.ADMIN_EMAIL || 'admin@virtualdoc.com',
      subject: `New Doctor Registration - ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Doctor Registration</h2>
          <p>A new doctor has registered on VirtualDoc:</p>
          <ul>
            <li><strong>Name:</strong> ${doctorName}</li>
            <li><strong>Status:</strong> ${status}</li>
            <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>Please review and verify the doctor's credentials in the admin dashboard.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Go to Admin Dashboard</a>
          <br>
          <p>Best regards,<br>The VirtualDoc System</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
}
