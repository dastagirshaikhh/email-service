# 📬 Next.js Contact Form with File Attachments

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![React Hook Form](https://img.shields.io/badge/React--Hook--Form-v7-blue?logo=react)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-Schema%20Validation-purple)](https://zod.dev/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-green)](https://nodemailer.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Framework-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready contact form built with **Next.js**, featuring client-side validation, server-side email delivery, and multi-file attachment support.

---

## 🚀 Features

- **Next.js 14+:** Server Actions for secure backend logic.
- **React Hook Form:** Efficient and flexible form state management.
- **Zod:** Type-safe schema validation.
- **Nodemailer:** Send emails via SMTP.
- **Multi-file Uploads:** Supports images, PDFs, and more.
- **File Validation:** File size check before upload.
- **User Feedback:** Loading, error, and success states.
- **Tailwind CSS + Shadcn/UI:** Customizable and modern UI components.

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Nodemailer](https://nodemailer.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dastagirshaikhh/email-service.git
cd my-contact-form
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Initialize Shadcn/UI (if not already done)

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card form input textarea
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the root:

```env
SMTP_USERNAME=your-gmail-email@gmail.com
SMPT_PASSWORD=your-google-app-password
MAIL_RECIEVER_ADDRESS=your-receiving-email@example.com
```

#### 🔐 How to Get a Google App Password (Gmail)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**.
3. Access **App Passwords** → Choose app "Mail", device "Other", and name it.
4. Generate and copy the **16-character password**.

Use that password as your `SMPT_PASSWORD`.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the contact form.

---

## 📁 Project Structure

```
.
├── app/
│   └── page.tsx              # Main page rendering the contact form
├── components/
│   └── contact-form.tsx      # Client-side form component
├── actions/
│   └── sendEmail.ts          # Server Action to send emails using Nodemailer
├── .env.local                # Environment variables for SMTP and mail config
└── README.md
```

---

## 🙌 Contribution

Feel free to open issues, pull requests, or fork this project to improve it.

---

## 💌 Contact

If you face any issues, feel free to [open an issue](https://github.com/your-username/my-contact-form/issues) or contact me at **[your-gmail-email@gmail.com](mailto:your-gmail-email@gmail.com)**.

---

> Built with 💖 using Next.js, Tailwind, and a lot of caffeine.

```
