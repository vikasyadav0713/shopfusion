# 🛍️ ShopFusion

### Where Shopping Meets Innovation

<p align="center">
  <img src="assets/home-page.png" alt="ShopFusion Home Page" width="100%">
</p>

<p align="center">
  <a href="https://shopfusion-alpha.vercel.app/"><strong>🌐 Live Demo</strong></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/vikasyadav1307/shopfusion"><strong>💻 Source Code</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge" alt="Clerk">
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel">
</p>

---

## 📖 About the Project

**ShopFusion** is a modern full-stack e-commerce web application focused on a clean, responsive, and user-friendly shopping experience.

The platform brings together product discovery, search, category browsing, saved products, cart management, user accounts, authentication, checkout, and newsletter functionality in a single storefront.

This project was developed as a **Summer Internship Project** to apply practical concepts in modern full-stack web development.

---

## 🎯 Project Objectives

- Build a modern and intuitive e-commerce storefront.
- Create a responsive interface for different screen sizes.
- Implement product browsing, search, categories, and filtering.
- Provide cart and saved-product functionality.
- Integrate user authentication and account management.
- Connect the application with a relational database.
- Deploy the application for real-world access.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏠 **Modern Home Page** | Hero section, categories, featured products, and shopping highlights |
| 🔎 **Search & Discovery** | Search products and explore the catalogue |
| 🗂️ **Categories & Filters** | Browse products by category and refine results |
| ❤️ **Saved Products** | Save products for later |
| 🛒 **Shopping Cart** | Add, remove, and update product quantities |
| 👤 **User Account** | Profile and account management |
| 🔐 **Authentication** | User authentication powered by Clerk |
| 💳 **Checkout Flow** | Continue from cart to checkout |
| 📧 **Newsletter** | Subscribe to product and shopping updates |
| 📱 **Responsive UI** | Designed for desktop and smaller screens |

---

## 🖼️ Project Preview

### 🏠 Home Page

<p align="center">
  <img src="assets/home-page.png" alt="ShopFusion Home Page" width="100%">
</p>

### 🛍️ Product Catalogue

<p align="center">
  <img src="assets/product-catalogue.png" alt="ShopFusion Product Catalogue" width="100%">
</p>

### 🛒 Shopping Cart

<p align="center">
  <img src="assets/cart.png" alt="ShopFusion Shopping Cart" width="100%">
</p>

> **Note:** The screenshots above are intentionally cropped versions of the full-page captures so they remain readable and compact on GitHub.

---

## 🧭 Shopping Journey

```text
Discover Products
       ↓
Search / Categories / Filters
       ↓
View Product
       ↓
Save Product or Add to Cart
       ↓
Review Cart
       ↓
Checkout
```

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       USER          │
                    │   Web / Browser     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      NEXT.JS        │
                    │     App Router      │
                    │   React Components  │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │      CLERK      │         │     PRISMA      │
        │ Authentication  │         │       ORM       │
        └─────────────────┘         └────────┬────────┘
                                             │
                                             ▼
                                   ┌─────────────────┐
                                   │   PostgreSQL    │
                                   │    Database     │
                                   └─────────────────┘

                           Deployment
                               │
                               ▼
                          ┌──────────┐
                          │  Vercel  │
                          └──────────┘
```

---

## 🛠️ Technology Stack

| Technology | Role |
|---|---|
| **Next.js** | Full-stack React framework and application routing |
| **React** | Component-based user interface |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Responsive styling and UI design |
| **Prisma** | ORM and database access |
| **PostgreSQL** | Relational database |
| **Clerk** | Authentication and account management |
| **Vercel** | Deployment and hosting |
| **Git / GitHub** | Version control and source management |

---

## 📁 Project Structure

```text
shopfusion/
│
├── app/             # Next.js App Router
├── components/      # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility/application logic
├── prisma/           # Database schema and Prisma setup
├── providers/        # Application providers
├── public/           # Static assets
├── scripts/          # Utility/setup scripts
├── store/            # Application state
│
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.*
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vikasyadav1307/shopfusion.git
cd shopfusion
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and add the required database and Clerk credentials according to the project's environment configuration.

### 4. Prepare the database

```bash
npx prisma migrate dev
```

### 5. Seed the database

```bash
npm run seed
```

### 6. Start the development server

```bash
npm run dev
```

Then open the local URL shown by Next.js.

### Production

```bash
npm run build
npm run start
```

---

## 🌐 Project Links

<p align="center">

| Resource | Link |
|---|---|
| 🌐 **Live Website** | [Open ShopFusion](https://shopfusion-alpha.vercel.app/) |
| 💻 **Source Code** | [View on GitHub](https://github.com/vikasyadav1307/shopfusion) |

</p>

---

## 📚 Internship Documentation

| Document | Description |
|---|---|
| 📑 **[Summer Internship Report](./summer-internship-report(vikas).pdf)** | Detailed internship and project report |
| 📊 **[ShopFusion Project Presentation](./ShopFusion%20E-Commerce%20Platform%20(1).pdf)** | Project presentation / PPT exported as PDF |
| 🏆 **[Internship Certificate](./Internship%20certificate.pdf)** | Internship completion certificate |

---

## 🎓 Internship Project

**Project:** ShopFusion — E-Commerce Platform  
**Type:** Summer Internship Project  
**Domain:** Full-Stack Web Development

### Key Learning Areas

- Next.js App Router and modern React development
- TypeScript-based development
- Responsive UI implementation
- Prisma and PostgreSQL database integration
- Clerk authentication
- Git and GitHub workflow
- Production deployment with Vercel

---

## 👨‍💻 Developer

### Vikas Yadav

**B.Tech — Computer Science Engineering**

| Detail | Information |
|---|---|
| 🆔 **Roll No.** | **CS-2341804** |
| 🏫 **Section** | **4CSE3** |
| 🎓 **Course** | **B.Tech — Computer Science Engineering** |

---

## ⭐ Thank You

<p align="center">
  <strong>🛍️ ShopFusion</strong><br>
  <sub>Where Shopping Meets Innovation</sub>
</p>

<p align="center">
  ⭐ If you like this project, consider giving the repository a star!
</p>
