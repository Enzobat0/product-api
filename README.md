# Product Catalog API

This is a RESTful API for managing a product catalog system built with **Node.js**, **Express**, and **MongoDB**, specifically designed for an e-commerce store that sells **electronics**. It supports product listings with variants, categories, inventory tracking, discount logic, and basic reporting.

---

## Features

- Full CRUD operations for products and categories
- Product variants (e.g., RAM, storage, color)
- Inventory tracking (stock calculated from variants)
- Discount system with automatic discounted price calculation
- Category assignment using category name
- Basic reports:
  - Low stock products
- Timestamps for product and category creation/update

---

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <https://github.com/Enzobat0/product-api>
   cd product-api
   ```

2. ## Install dependencies
```bash
npm install
```
3. ## Create .env file
```ini
MONGODB_URI=mongodb://localhost:27017/product-catalog
PORT=5000
```
4. ## Start server
```bash
npm run dev
```

## API Documentation
All responses are in JSON. All routes are prefixed with ```/api```

### Categories
```GET /api/categories```
Get all categories.

```GET /api/categories/:id```
Get a single category by ID.

```GET /api/categories/name/:name```
Get a category by its unique name.

```POST /api/categories```
Create a new category.
```json
{
  "name": "Smartphones",
  "description": "All kinds of phones"
}
```
```PUT /api/categories/:id```
Update a category.

```DELETE /api/categories/:id```
Delete a category.

### Products
```GET /api/products```
Get all products.

```GET /api/products/:id```
Get a product by ID.

```POST /api/products```
Create a new product.
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple flagship",
  "brand": "Apple",
  "price": 1299,
  "discountPercent": 15,
  "discountStartDate": "2025-07-10",
  "discountEndDate": "2025-07-31",
  "categoryName": "Smartphones",
  "images": ["https://..."],
  "variants": [
    {
      "color": "Blue",
      "ram": "8GB",
      "storage": "256GB",
      "stock": 10,
      "price": 1299.99
    }
  ]
}
```
- stock is automatically calculated from all variants.

- discountedPrice is auto-generated if discountPercent is set and dates are valid.

- The first variant is treated as the default by UI convention.

```PUT /api/products/:id```
Update a product. You can also update the category by providing ```categoryName```:
```json
{
  "price": 1099.99,
  "categoryName": "Laptops",
  "variants": [
    {
      "color": "Silver",
      "ram": "16GB",
      "storage": "512GB",
      "stock": 5,
      "price": 1099.99
    }
  ]
}
```
```DELETE /api/products/:id```
Delete a product.


### Reporting
```GET /api/products/low-stock?threshold=5```
Get all products where total stock is less than the specified threshold.

- Default threshold is 5 if not specified.


## Assumptions & Limitations
- Products must have at least one image.

- Variants must each define their own stock and price.

- Stock is auto-calculated — do not include it manually in product creation.

- First variant in the array is considered the default (UI should use this convention).

- Discounts are applied only if the current date is between discountStartDate and discountEndDate.

- Product category is passed as categoryName (not ObjectId).

- There is no authentication or authorization (for simplicity in this assignment).

- No pagination or advanced search/filtering yet (can be added in a future iteration).

## Demo Walkthrough
See the video in this repo (/demo.mp4) for a full walkthrough using Postman showing:

- Product and category creation

- Variant structure

- Discount application

- Low stock report

- Error handling for invalid category, missing fields, etc.

## Project Structure
```pgsql
product-api/
│
├── controllers/
│   └── categorycontroller.js
│   └── productcontroller.js
│
├── models/
│   └── categorymodel.js
│   └── productmodel.js
│
├── routes/
│   └── categoryroutes.js
│   └── productroutes.js
│
├── app.js
├── server.js
├── .env
├── package.json
└── README.md  <-- You are here
```
## Tech Stack
- Node.js

- Express.js

- MongoDB & Mongoose

- Insomnia (for testing)

- Nodemon (for development)

## Contact
Maintained by: **Enzo Batungwanayo**

