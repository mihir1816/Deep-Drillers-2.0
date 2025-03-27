const nodemailer = require('nodemailer');

// Create a transporter with Gmail credentials
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || "587",
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL || "your.kavach@gmail.com",
        pass: process.env.SMTP_PASSWORD || "uilumulzhpphyptl"
    }
});

/**
 * Send an email
 * @param {string} email - Recipient email
 * @param {string} subject - Email subject
 * @param {string} content - HTML content of the email
 * @returns {Promise} - Email sending result
 */
const sendMail = async (email, subject, content) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL || "your.kavach@gmail.com",
            to: email,
            subject: subject,
            html: content
        };
        
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
};

/**
 * Send OTP email to a user
 * @param {string} email - User's email 
 * @param {string} otp - Generated OTP
 * @returns {Promise} - Email sending result
 */
const sendOTPEmail = async (email, otp) => {
    const subject = 'Your EV Rental Verification Code';
    const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4CAF50; text-align: center;">EV Rental Verification</h2>
            <p>Hello,</p>
            <p>Your verification code for EV Rental account is:</p>
            <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Thank you,<br>EV Rental Team</p>
        </div>
    `;
    
    return await sendMail(email, subject, content);
};

module.exports = {
    sendMail,
    sendOTPEmail
}; 