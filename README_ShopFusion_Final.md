# 🛍️ ShopFusion

### Where Shopping Meets Innovation

<p align="center">
  <strong>A Modern Full-Stack E-Commerce Platform</strong><br>
  Built with Next.js, React, TypeScript, Prisma, PostgreSQL and Clerk
</p>

<p align="center">
  <a href="https://shopfusion-alpha.vercel.app/">
    <img src="https://img.shields.io/badge/🌐_LIVE_DEMO-ShopFusion-7C3AED?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/vikasyadav1307/shopfusion">
    <img src="https://img.shields.io/badge/💻_SOURCE_CODE-GitHub-111827?style=for-the-badge&logo=github" alt="Source Code">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square" alt="Clerk">
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel" alt="Vercel">
</p>

---

## 📖 About the Project

**ShopFusion** is a modern full-stack e-commerce web application designed around a clean, responsive and user-friendly shopping experience.

The application brings together:

- 🛍️ Product discovery and browsing
- 🔎 Product search
- 🗂️ Categories and filtering
- ❤️ Saved products
- 🛒 Shopping cart and quantity management
- 👤 User account and profile management
- 🔐 Clerk authentication
- 💳 Checkout flow
- 📧 Newsletter subscription
- 📱 Responsive interface

ShopFusion was developed as a **Summer Internship Project** to apply practical full-stack development concepts in a complete, deployable web application.

---

## 🎯 Project Objectives

| Objective | Implementation |
|---|---|
| 🛒 Modern Shopping | Clean storefront focused on product discovery |
| 📱 Responsive Design | Interface designed for different screen sizes |
| 🔎 Product Discovery | Search, categories and product filtering |
| ❤️ User Interaction | Saved products and shopping cart |
| 🔐 Authentication | Account functionality powered by Clerk |
| 🗄️ Data Management | Prisma ORM with PostgreSQL |
| 🌐 Deployment | Production deployment through Vercel |

---

## ✨ Key Features

### 🏠 Modern Home Page

The home page introduces ShopFusion through a hero section, product highlights, shopping categories and a guided shopping journey.

### 🔎 Search & Discovery

Users can search the product catalogue and discover products through the storefront.

### 🗂️ Categories & Filters

The catalogue provides category navigation and filtering options to help users find relevant products.

### ❤️ Saved Products

Products can be saved for later access from the shopping interface.

### 🛒 Shopping Cart

The cart allows users to:

- Add products
- Increase or decrease quantities
- Remove products
- Review the cart total
- Continue to checkout

### 🔐 Account & Authentication

ShopFusion uses **Clerk** for authentication and account management.

### 💳 Checkout

The shopping journey continues from the cart into the checkout flow.

### 📧 Newsletter

A newsletter subscription section is included in the storefront.

### 📱 Responsive Interface

The interface is designed to provide a consistent shopping experience across desktop and smaller screens.

---

## 🖥️ Project Screenshots

> **GitHub image note:** The README should not point to local files that have not been committed to the repository.  
> If you want screenshots displayed here, upload them into an `assets/` folder using the filenames shown below, then these images will render correctly.

### 🏠 Home Page

<p align="center">
  <img src="./assets/home-page.png" alt="ShopFusion Home Page" width="100%">
</p>

### 🛍️ Product Catalogue

<p align="center">
  <img src="./assets/product-catalogue.png" alt="ShopFusion Product Catalogue" width="100%">
</p>

### 🛒 Shopping Cart

<p align="center">
  <img src="./assets/cart.png" alt="ShopFusion Shopping Cart" width="100%">
</p>

---

## 🧭 Shopping Journey

```text
┌───────────────────┐
│ Discover Products │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Search / Category │
│     / Filters     │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│   View Product    │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Save / Add to Cart│
└─────────┬─────────┘
          ↓
┌───────────────────┐
│   Review Cart     │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│     Checkout      │
└───────────────────┘
```

---

## 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │       USER       │
                         │  Web / Browser   │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │         NEXT.JS          │
                    │       App Router         │
                    │    React Components      │
                    └───────────┬──────────────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
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
                                             │
                                             ▼
                                   ┌─────────────────┐
                                   │     VERCEL      │
                                   │   Deployment    │
                                   └─────────────────┘
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **Next.js** | Application framework and App Router |
| **React** | Component-based UI development |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Responsive interface styling |
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
├── hooks/           # Custom React hooks
├── lib/             # Utilities and application logic
├── prisma/          # Prisma schema/database configuration
├── providers/       # Application providers
├── public/          # Static assets
├── scripts/         # Utility/setup scripts
├── store/           # Application state
│
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.*
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vikasyadav1307/shopfusion.git
cd shopfusion
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and configure the database and Clerk credentials required by the project.

### 4. Prepare the Database

```bash
npx prisma migrate dev
```

### 5. Seed the Database

```bash
npm run seed
```

### 6. Start the Development Server

```bash
npm run dev
```

For a production build:

```bash
npm run build
npm run start
```

---

## 🌐 Project Links

| Resource | Link |
|---|---|
| 🌐 **Live Website** | [Open ShopFusion](https://shopfusion-alpha.vercel.app/) |
| 💻 **Source Code** | [GitHub Repository](https://github.com/vikasyadav1307/shopfusion) |

---

## 📚 Internship Documentation

| Document | Description |
|---|---|
| 📑 **[Summer Internship Report](./summer-internship-report(vikas).pdf)** | Detailed internship and project report |
| 📊 **[ShopFusion E-Commerce Platform — Project Presentation](./ShopFusion%20E-Commerce%20Platform%20(1).pdf)** | Project presentation / PPT exported as PDF |
| 🏆 **[Internship Certificate](./Internship%20certificate.pdf)** | Internship completion certificate |

---

## 🎓 Internship Project

**Project:** ShopFusion — E-Commerce Platform  
**Type:** Summer Internship Project  
**Domain:** Full-Stack Web Development

### Key Learning Areas

- Next.js App Router
- React and TypeScript
- Responsive UI development
- Prisma and PostgreSQL
- Clerk authentication
- Git and GitHub
- Vercel deployment
- Full-stack application development

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

## ⭐ Acknowledgement

ShopFusion was developed as part of my summer internship to gain practical experience in modern full-stack web development and to apply software engineering concepts in a complete project.

---

<p align="center">
  <strong>🛍️ ShopFusion</strong><br>
  <sub>Where Shopping Meets Innovation</sub>
</p>

<p align="center">
  ⭐ If you like this project, consider giving the repository a star!
</p>
