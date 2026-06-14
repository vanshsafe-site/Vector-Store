# 🏥 Vector Store
### B2B Pharmacy Wholesale E-Commerce Platform

> A client-facing wholesale ordering platform designed for pharmacies, medical stores, clinics, and distributors. Customers can browse pharmaceutical products, place bulk orders, and administrators can manage inventory and process orders end-to-end.

> **Note:** This is a functional demonstration application and is not intended for production deployment without further security hardening.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Order Workflow](#order-workflow)
- [Security](#security)
- [Deployment](#deployment)
- [Project Status](#project-status)
- [Future Improvements](#future-improvements)

---

## ✨ Features

### 🛒 Customer Side

| Feature | Details |
|---|---|
| **Product Catalog** | Live loading from Supabase, search, stock display, and product details |
| **Shopping Cart** | Add/remove items, quantity controls, auto price calculation, LocalStorage persistence |
| **Checkout** | Business name, contact, phone, email, address, GST — with dynamic order summary |
| **Order Placement** | Full workflow from browse → cart → checkout → database → confirmation |

---

### 🔧 Admin Panel

| Feature | Details |
|---|---|
| **Authentication** | Admin login via Supabase Auth with session-based access |
| **Dashboard** | Live stats: Total Orders, Pending Orders, Total Products, Revenue |
| **Product Management** | Add, edit, delete products and update inventory — syncs instantly to storefront |
| **Order Management** | View orders with customer details, ordered products, totals, and status updates |

**Supported Order Statuses:**

```
Pending  →  Accepted  →  Dispatched  →  Delivered
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML |
| Styling | CSS |
| Logic | Vanilla JavaScript |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Storage | Supabase |
| Hosting | Netlify / Vercel |

---

## 📁 Project Structure

```
VECTOR-STORE/
│
├── index.html                  # Product catalog / storefront
├── cart.html                   # Shopping cart
├── checkout.html               # Checkout form
├── order-success.html          # Order confirmation
│
├── admin-login.html            # Admin authentication
├── admin-dashboard.html        # Dashboard with stats
├── admin-products.html         # Product management
├── admin-orders.html           # Order management
│
├── css/
│   └── style.css
│
└── js/
    ├── app.js
    └── supabase.js
```

---

## 🗄️ Database Schema

### `products`

| Column | Type |
|---|---|
| `id` | Primary Key |
| `name` | Text |
| `description` | Text |
| `price` | Numeric |
| `stock` | Integer |
| `category` | Text |
| `image_url` | Text |
| `created_at` | Timestamp |

### `orders`

| Column | Type |
|---|---|
| `id` | Primary Key |
| `business_name` | Text |
| `contact_person` | Text |
| `phone` | Text |
| `email` | Text |
| `address` | Text |
| `gst` | Text |
| `items` | JSON |
| `total` | Numeric |
| `status` | Text |
| `created_at` | Timestamp |

---

## 🔄 Order Workflow

```
Customer Browses Products
        ↓
    Adds to Cart
        ↓
  Fills Checkout Form
        ↓
  Order Saved to Supabase
        ↓
   Confirmation Shown
        ↓
  Admin Reviews Order
        ↓
  Admin Updates Status
```

---

## 🔐 Security

### Current Demo Configuration
- Supabase Row Level Security (RLS) enabled
- Public product viewing allowed
- Authenticated admin operations
- Order creation enabled for customers

### For Production
- [ ] Restrict anonymous access
- [ ] Enable strict RLS policies
- [ ] Protect admin routes server-side
- [ ] Add server-side input validation
- [ ] Implement payment security measures

---

## 🚀 Deployment

### Netlify (Recommended)

1. Upload the project folder to Netlify
2. Deploy as a static website
3. Add the deployed URL to **Supabase → Authentication → URL Configuration**

---

## 📊 Project Status

**Overall Completion: `█████████░ 90%`**

### ✅ Completed
- [x] Supabase integration
- [x] Product catalog
- [x] Cart system
- [x] Checkout flow
- [x] Order processing
- [x] Admin product management
- [x] Admin order management
- [x] Dashboard with live stats

### 🔲 Remaining
- [ ] Advanced authentication (multi-admin, roles)
- [ ] Production security hardening
- [ ] Deployment configuration

---

## 🔮 Future Improvements (Phase 2)

- 📧 Email notifications for order updates
- 🧾 Invoice and GST invoice generation / export
- 👤 Customer accounts and login
- 👥 Multiple admin roles with permissions
- 💳 Payment gateway integration
- 📊 Sales analytics and reports dashboard
- 📦 Inventory forecasting
- 🖼️ Product image uploads
- 📈 Advanced reporting

---

## 📌 Demo Purpose

This project demonstrates a complete wholesale pharmacy ordering workflow — from customer-facing browsing to admin-side order fulfillment. Built as a client demonstration project.

---

*Built with ❤️ using Vanilla JS + Supabase*
