import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
let transporter;

try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} catch (error) {
  console.error('Failed to create email transporter:', error);
}

// Helper function to verify email configuration
async function verifyEmailConfig() {
  if (!transporter) {
    console.error('Email transporter not initialized');
    return false;
  }

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
}

// Helper function to safely send email
async function sendEmail(options) {
  if (!await verifyEmailConfig()) {
    console.warn('Skipping email send due to configuration issues');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"VirtualDoc" <${process.env.SMTP_FROM}>`,
      ...options
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw error to prevent registration failure
    return null;
  }
}

export const sendVerificationEmail = async (email, name) => {
  try {
    console.log('Sending verification email to:', email);
    
    if (!email || !name) {
      console.error('Missing required fields for verification email:', { email, name });
      return;
    }

    const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify?email=${encodeURIComponent(email)}`;
    
    await sendEmail({
      to: email,
      subject: 'Verify Your VirtualDoc Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D3748;">Welcome to VirtualDoc!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering as a doctor on VirtualDoc. Please verify your email address to complete your registration.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #48BB78; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Verify Email
          </a>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>The VirtualDoc Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    // Don't throw error to prevent registration failure
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your VirtualDoc Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D3748;">Password Reset Request</h2>
          <p>We received a request to reset your password for your VirtualDoc account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #48BB78; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The VirtualDoc Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export async function sendDoctorApprovalEmail(email, fullName, status, message) {
  try {
    console.log('Sending approval email to:', email, 'with status:', status);
    
    if (!email || !fullName || !status) {
      console.error('Missing required fields for approval email:', { email, fullName, status });
      return;
    }

    const subject = status === 'approved' 
      ? 'Your VirtualDoc Account Has Been Approved!'
      : 'Update on Your VirtualDoc Account Application';

    let htmlContent = '';
    
    if (status === 'approved') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #166534;">Congratulations, ${fullName}!</h2>
          <p>Your VirtualDoc account has been approved. You can now log in and start accepting appointments.</p>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">What's Next?</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;">✅ Log in to your account</li>
              <li style="margin-bottom: 10px;">✅ Complete your profile</li>
              <li style="margin-bottom: 10px;">✅ Set your availability</li>
              <li style="margin-bottom: 10px;">✅ Start accepting appointments</li>
            </ul>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login" 
             style="display: inline-block; background-color: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Login to Your Account
          </a>
        </div>
      `;
    } else if (status === 'rejected') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #991b1b;">Account Application Update</h2>
          <p>Dear ${fullName},</p>
          <p>We regret to inform you that we are unable to approve your VirtualDoc account application at this time.</p>
          ${message ? `<p><strong>Reason:</strong> ${message}</p>` : ''}
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #991b1b; margin-top: 0;">What You Can Do</h3>
            <p>You may submit a new application addressing the concerns mentioned above. If you believe this decision was made in error, please contact our support team.</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" 
             style="display: inline-block; background-color: #991b1b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Contact Support
          </a>
        </div>
      `;
    } else if (status === 'pending') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #854d0e;">Additional Information Required</h2>
          <p>Dear ${fullName},</p>
          <p>We need some additional information to process your VirtualDoc account application:</p>
          <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Required Information:</strong></p>
            <p>${message}</p>
          </div>
          <p>Please log in to your account and provide the requested information.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login" 
             style="display: inline-block; background-color: #854d0e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Update Your Application
          </a>
        </div>
      `;
    }

    await sendEmail({
      to: email,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error in sendDoctorApprovalEmail:', error);
    // Don't throw error to prevent approval process failure
  }
}

export async function sendAdminNotificationEmail(doctorName, status) {
  try {
    console.log('Sending admin notification for doctor:', doctorName);
    
    if (!doctorName || !status || !process.env.ADMIN_EMAIL) {
      console.error('Missing required fields for admin notification:', { doctorName, status, adminEmail: process.env.ADMIN_EMAIL });
      return;
    }

    const subject = `New Doctor ${status.charAt(0).toUpperCase() + status.slice(1)} Request`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #166534;">New Doctor ${status.charAt(0).toUpperCase() + status.slice(1)} Request</h2>
        <p>A new doctor account requires your attention:</p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor Name:</strong> ${doctorName}</p>
          <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/admin" 
           style="display: inline-block; background-color: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Review Request
        </a>
      </div>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error in sendAdminNotificationEmail:', error);
    // Don't throw error to prevent registration failure
  }
} 