# Budget Wear Backend

Backend API for **Budget Wear**, a men's fashion e-commerce platform.

This backend provides authentication, product management, Cloudinary image uploads, size-based inventory management, order processing, and admin order management.

---

## Features

* Admin authentication with JWT
* Role-based protected admin routes
* Product CRUD operations
* Product image upload with Cloudinary
* Cloudinary image replacement and cleanup
* Size-based product inventory
* Stock management
* Customer order creation
* Order item management
* Order status management
* Stock restoration for cancelled orders
* Soft delete for products
* PostgreSQL database
* Prisma ORM
* Zod validation
* RESTful API
* Production-ready TypeScript setup
* `tsup` production build

---

## Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime               |
| Express.js | REST API framework    |
| TypeScript | Type safety           |
| PostgreSQL | Database              |
| Prisma     | ORM                   |
| Zod        | Request validation    |
| JWT        | Authentication        |
| bcrypt     | Password hashing      |
| Cloudinary | Image storage         |
| Multer     | Image upload handling |
| tsup       | Production build      |
| Vercel     | Deployment            |

---

## Project Structure

```text
src/
├── config/
│   ├── cloudinary.ts
│   ├── env.ts
│   └── prisma.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   └── upload.middleware.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   ├── auth.service.ts
│   │   └── auth.validation.ts
│   │
│   ├── product/
│   │   ├── product.controller.ts
│   │   ├── product.route.ts
│   │   ├── product.service.ts
│   │   └── product.validation.ts
│   │
│   ├── inventory/
│   │   ├── inventory.controller.ts
│   │   ├── inventory.route.ts
│   │   ├── inventory.service.ts
│   │   └── inventory.validation.ts
│   │
│   └── order/
│       ├── order.controller.ts
│       ├── order.route.ts
│       ├── order.service.ts
│       └── order.validation.ts
│
├── utils/
│   └── cloudinaryUpload.ts
│
└── server.ts

prisma/
└── schema.prisma

tsup.config.ts
package.json
```

---

## Requirements

Before running the project, make sure you have:

* Node.js 24+
* PostgreSQL database
* Cloudinary account
* npm

---

## Installation

Clone the project and install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5001

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Production

For production, set:

```env
PORT=5001

DATABASE_URL=your_production_database_url

JWT_SECRET=your_production_jwt_secret

FRONTEND_URL=https://budget-wear.vercel.app

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Never commit `.env` to Git.

---

## Database Setup

Run Prisma migration:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

For production:

```bash
npx prisma migrate deploy
```

---

## Development

Start the development server:

```bash
npm run dev
```

The server will run at:

```text
http://localhost:5001
```

---

## Production Build

Build the backend with `tsup`:

```bash
npm run build
```

The output will be generated inside:

```text
dist/
└── server.js
```

Run the production server:

```bash
npm start
```

---

## API Base URL

Local:

```text
http://localhost:5001/api
```

Production:

```text
https://budget-wear-backend.vercel.app/api
```

---

# API Endpoints

## Authentication

### Admin Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "your-jwt-token"
  }
}
```

---

# Products

## Get All Products

```http
GET /api/products
```

This endpoint is public.

Products with:

* `isActive = true`
* at least one size with stock greater than `0`

are returned.

---

## Get Product By ID

```http
GET /api/products/:id
```

---

## Create Product

```http
POST /api/products
```

Authentication required.

Use:

```text
Authorization: Bearer <token>
```

Request type:

```text
multipart/form-data
```

Fields:

```text
name
description
price
sizes
image
```

Example `sizes`:

```json
[
  {
    "size": "M",
    "stock": 10
  },
  {
    "size": "L",
    "stock": 8
  },
  {
    "size": "XL",
    "stock": 5
  },
  {
    "size": "XXL",
    "stock": 0
  }
]
```

The image is uploaded to Cloudinary.

The database stores:

```text
imageUrl
publicId
```

---

## Update Product

```http
PATCH /api/products/:id
```

Authentication required.

Request type:

```text
multipart/form-data
```

Possible fields:

```text
name
description
price
image
```

When a new image is uploaded:

```text
New Image
    ↓
Cloudinary Upload
    ↓
Database Update
    ↓
Old Cloudinary Image Removed
```

---

## Delete Product

```http
DELETE /api/products/:id
```

Authentication required.

Products use **soft delete**.

Instead of removing the database row:

```text
isActive = false
```

This protects existing order history and avoids foreign key conflicts with `OrderItem`.

---

# Inventory

## Create Inventory

```http
POST /api/inventory
```

Authentication required.

Example:

```json
{
  "productId": 4,
  "size": "M",
  "stock": 10
}
```

---

## Get Product Inventory

```http
GET /api/inventory/product/:productId
```

Authentication required.

---

## Update Inventory

```http
PATCH /api/inventory/:id
```

Authentication required.

Example:

```json
{
  "stock": 25
}
```

---

## Delete Inventory

```http
DELETE /api/inventory/:id
```

Authentication required.

---

# Orders

## Create Order

```http
POST /api/orders
```

Public endpoint.

Customer submits:

```json
{
  "customerName": "John Doe",
  "phone": "01XXXXXXXXX",
  "address": "Dhaka, Bangladesh",
  "items": [
    {
      "productId": 4,
      "size": "M",
      "quantity": 1,
      "price": 1299
    }
  ]
}
```

The backend:

1. Validates the order.
2. Checks product availability.
3. Checks size-level stock.
4. Creates the order.
5. Creates order items.
6. Deducts inventory stock.
7. Calculates the order total.

---

## Get Orders

```http
GET /api/orders
```

Authentication required.

Used by the admin dashboard.

---

## Update Order Status

```http
PATCH /api/orders/:id/status
```

Authentication required.

Example:

```json
{
  "status": "CONFIRMED"
}
```

Supported statuses:

```text
PENDING
CONFIRMED
DELIVERED
CANCELLED
```

When an order is cancelled, the corresponding inventory stock can be restored according to the order service logic.

---

# Product Image Management

Product images are stored using Cloudinary.

## Upload Flow

```text
Admin
  ↓
Image File
  ↓
Multer
  ↓
Memory Buffer
  ↓
Cloudinary
  ↓
secure_url + public_id
  ↓
PostgreSQL
```

Cloudinary folder:

```text
ecommerce/products
```

The backend stores:

```text
imageUrl
publicId
```

`publicId` is used to remove old images when a product image is replaced.

---

# Database Models

The main product inventory relationship is:

```text
Product
   │
   └── ProductInventory
          ├── M
          ├── L
          ├── XL
          └── XXL
```

Example:

```text
Product #4
│
├── M   → 10
├── L   → 8
├── XL  → 5
└── XXL → 0
```

The inventory model prevents duplicate size entries for the same product:

```prisma
@@unique([productId, size])
```

When a product is deleted:

```text
Product
   ↓
ProductInventory
```

inventory records are removed through:

```prisma
onDelete: Cascade
```

Product orders are preserved through soft deletion.

---

# CORS

For local development:

```text
http://localhost:3000
```

For production:

```text
https://budget-wear.vercel.app
```

The backend must allow the frontend origin.

Example:

```ts
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
```

---

# Deployment

The backend is deployed on Vercel.

Production URL:

```text
https://budget-wear-backend.vercel.app
```

API:

```text
https://budget-wear-backend.vercel.app/api
```

Build command:

```bash
npm run build
```

Start command:

```bash
npm start
```

---

# Useful Commands

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Production Start

```bash
npm start
```

### Prisma Generate

```bash
npx prisma generate
```

### Prisma Migration

```bash
npx prisma migrate dev
```

### Production Migration

```bash
npx prisma migrate deploy
```

### Prisma Studio

```bash
npx prisma studio
```

---

# Example Product Response

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": 4,
      "name": "Formal Shirt",
      "description": "Premium cotton men's shirt",
      "price": "1299",
      "imageUrl": "https://res.cloudinary.com/...",
      "publicId": "ecommerce/products/...",
      "isActive": true,
      "inventories": [
        {
          "id": 6,
          "productId": 4,
          "size": "M",
          "stock": 7
        },
        {
          "id": 7,
          "productId": 4,
          "size": "L",
          "stock": 7
        },
        {
          "id": 8,
          "productId": 4,
          "size": "XL",
          "stock": 5
        }
      ]
    }
  ]
}
```

---

# Error Handling

The API returns errors in a consistent format:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common errors include:

```text
Product not found
Product image is required
Inventory not found
Invalid product ID
Invalid image
Admin token not found
Insufficient stock
```

---

# Security Notes

* Never expose `JWT_SECRET`.
* Never expose `CLOUDINARY_API_SECRET`.
* Never commit `.env`.
* Protect admin routes with JWT authentication.
* Validate incoming data with Zod.
* Validate image type and file size.
* Keep Cloudinary secrets on the server only.

---

# Author

**Budget Wear**

Backend API for the Budget Wear men's fashion e-commerce platform.

Built with:

```text
Node.js
Express.js
TypeScript
PostgreSQL
Prisma
Cloudinary
JWT
Zod
```
