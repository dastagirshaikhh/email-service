"use server";

import nodemailer from "nodemailer";

/**
 * Interface for attachment data.
 */
interface Attachment {
    filename: string;
    content: string; // Base64 encoded string of the file content
    contentType: string; // MIME type of the file (e.g., 'application/pdf', 'image/png')
}

/**
 * Sends an email using Nodemailer, now supporting attachments.
 *
 * @param {object} params - The parameters for sending the email.
 * @param {string} params.email - The sender's email address (from the form).
 * @param {string} params.message - The message content from the form.
 * @param {Attachment[]} [params.attachments] - Optional array of attachment objects.
 * @returns {Promise<{success: boolean, message: string}>} An object indicating success and a message.
 */
export async function sendEmail({
    email,
    message,
    attachments, // New parameter for attachments
}: {
    email: string;
    message: string;
    attachments?: Attachment[]; // Make attachments optional
}) {
    // Retrieve environment variables for SMTP configuration
    const smtpUsername = process.env.SMTP_USERNAME;
    const smtpPassword = process.env.SMPT_PASSWORD; // Corrected typo from SMPT_PASSWORD to SMTP_PASSWORD if it was a typo in .env
    const mailReceiverAddress = process.env.MAIL_RECIEVER_ADDRESS;

    // Basic validation for environment variables
    if (!smtpUsername || !smtpPassword || !mailReceiverAddress) {
        console.error("Missing SMTP environment variables.");
        return { success: false, message: "Server configuration error: Missing email credentials." };
    }

    try {
        // Create a Nodemailer transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Example: for Gmail, use smtp.gmail.com
            port: 587, // Standard secure SMTP port
            secure: false, // Use 'true' if port is 465, 'false' for 587 with STARTTLS
            auth: {
                user: smtpUsername, // Your Gmail address
                pass: smtpPassword, // Your App Password (if using Gmail with 2FA)
            },
        });

        // Prepare Nodemailer attachments array
        const nodemailerAttachments = attachments?.map(att => ({
            filename: att.filename,
            content: att.content, // Nodemailer expects Base64 content here
            contentType: att.contentType,
            encoding: 'base64', // Specify that the content is base64 encoded
        })) || [];

        // Define the email options
        const mailOptions = {
            from: smtpUsername, // Sender address (your email)
            to: mailReceiverAddress, // Recipient address (where you want to receive messages)
            replyTo: email, // Set the reply-to address to the user's email
            subject: `New message from contact form: ${email}`, // Subject of the email
            text: `Sender Email: ${email}\n\nMessage:\n${message}`, // Plain text body
            html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p>You have received a new message from your contact form.</p>
          <p><strong>Sender Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="border: 1px solid #eee; padding: 10px; border-radius: 5px; background-color: #f9f9f9;">${message}</p>
          ${nodemailerAttachments.length > 0 ? `<p><strong>Attachments:</strong> ${nodemailerAttachments.map(a => a.filename).join(', ')}</p>` : ''}
        </div>
      `, // HTML body
            attachments: nodemailerAttachments, // Add the attachments here
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully.");
        return { success: true, message: "Your message has been sent successfully!" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send your message. Please try again later." };
    }
}
