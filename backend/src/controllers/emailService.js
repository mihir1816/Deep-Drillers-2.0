require('dotenv').config();
const nodemailer = require('nodemailer');

const GMAIL_USER = "mihirjan1816@gmail.com";
const GMAIL_APP_PASSWORD = "fnugvsuyfppdqbys";

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
    }
});

// In-memory store for verification codes (Use Redis or DB in production)
const verificationCodes = new Map();

// Clean expired codes every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [email, data] of verificationCodes.entries()) {
        if (now > data.expires) {
            verificationCodes.delete(email);
        }
    }
}, 10 * 60 * 1000);

// Helper to generate 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email) => {
    try {
        const code = generateVerificationCode();

        verificationCodes.set(email, {
            code,
            expires: Date.now() + 5 * 60 * 1000,
            attempts: 0
        });

        const mailOptions = {
            from: {
                name: 'EV Rental Service',
                address: process.env.GMAIL_USER
            },
            to: email,
            subject: 'Email Verification Code - EV Rental',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Welcome to EV Rental</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #2563eb;">${code}</h1>
                    <p>This code will expire in 5 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);

        return { success: true, message: 'Verification code sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send verification email. Please try again.');
    }
};

// Verify code
const verifyEmailCode = (email, code) => {
    const stored = verificationCodes.get(email);

    if (!stored) {
        return { success: false, message: 'No verification code found. Please request a new code.' };
    }

    if (Date.now() > stored.expires) {
        verificationCodes.delete(email);
        return { success: false, message: 'Verification code has expired. Please request a new code.' };
    }

    stored.attempts += 1;

    if (stored.attempts > 3) {
        verificationCodes.delete(email);
        return { success: false, message: 'Too many failed attempts. Please request a new code.' };
    }

    if (stored.code !== code) {
        return {
            success: false,
            message: `Invalid verification code. ${4 - stored.attempts} attempts remaining.`
        };
    }

    verificationCodes.delete(email);
    console.log(`Email verified: ${email}`);
    return { success: true, message: 'Email verified successfully' };
};

module.exports = {
    sendVerificationEmail,
    verifyEmailCode
};
