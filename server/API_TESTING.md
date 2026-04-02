# VolteX API — Testing Guide

> Base URL: `http://localhost:8000`
> All protected routes need: `Authorization: Bearer <accessToken>`
> Run `npm run dev` in `/server` before testing.

---

## Test Order (follow this sequence)

```
1. Admin Login          → get accessToken
2. Create Category      → get categoryId
3. Create Product       → get productId
4. Invite Staff         → staff gets OTP email
5. Staff OTP Login      → get staff accessToken
6. Cart operations      → add/update/remove
7. Wishlist operations  → add/remove
8. Place Order          → need addressId first
9. Admin manages order  → update status
```

---

## 0. Health Check

```bash
curl -s http://localhost:8000/health | python3 -m json.tool
```

**Expected:**
```json
{ "success": true, "message": "VolteX API is running", "env": "development" }
```

---

## 1. AUTH

### 1.1 Admin Login
```bash
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tejasviraj8686@gmail.com",
    "password": "Tejasvi@Admin2026!"
  }' | python3 -m json.tool
```
**Save:** `accessToken` and `refreshToken` from response.

---

### 1.2 Get Current User
```bash
curl -s http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 1.3 Refresh Token
```bash
curl -s -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{ "refreshToken": "<refreshToken>" }' | python3 -m json.tool
```

---

### 1.4 Logout
```bash
curl -s -X POST http://localhost:8000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{ "refreshToken": "<refreshToken>" }' | python3 -m json.tool
```

---

## 2. CATEGORIES

### 2.1 Create Top-Level Category (Admin only)
```bash
curl -s -X POST http://localhost:8000/api/categories \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobiles",
    "sortOrder": 1
  }' | python3 -m json.tool
```
**Save:** `id` as `<mobilesId>`

---

### 2.2 Create Subcategory
```bash
curl -s -X POST http://localhost:8000/api/categories \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphones",
    "parentId": "<mobilesId>",
    "sortOrder": 1
  }' | python3 -m json.tool
```
**Save:** `id` as `<smartphonesId>`

---

### 2.3 Get All Categories (Tree)
```bash
curl -s http://localhost:8000/api/categories | python3 -m json.tool
```

---

### 2.4 Get Flat List (for dropdowns)
```bash
curl -s http://localhost:8000/api/categories/flat | python3 -m json.tool
```

---

### 2.5 Get Single Category
```bash
curl -s http://localhost:8000/api/categories/<mobilesId> | python3 -m json.tool
```

---

### 2.6 Update Category
```bash
curl -s -X PUT http://localhost:8000/api/categories/<mobilesId> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "sortOrder": 2 }' | python3 -m json.tool
```

---

## 3. PRODUCTS

### 3.1 Create Product (Admin/Staff)
```bash
curl -s -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple iPhone 16 Pro",
    "description": "Latest iPhone with A18 Pro chip",
    "price": 119900,
    "mrp": 134900,
    "stock": 50,
    "brand": "Apple",
    "categoryId": "<smartphonesId>",
    "images": [
      "https://placehold.co/600x600?text=iPhone16Pro"
    ]
  }' | python3 -m json.tool
```
**Save:** `id` as `<iphone16Id>`

---

### 3.2 Create Another Product
```bash
curl -s -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Galaxy S25",
    "description": "Samsung flagship 2025",
    "price": 79999,
    "mrp": 89999,
    "stock": 30,
    "brand": "Samsung",
    "categoryId": "<smartphonesId>",
    "images": [
      "https://placehold.co/600x600?text=GalaxyS25"
    ]
  }' | python3 -m json.tool
```
**Save:** `id` as `<samsungId>`

---

### 3.3 List Products (Public — no token)
```bash
curl -s "http://localhost:8000/api/products" | python3 -m json.tool
```

---

### 3.4 Search Products
```bash
curl -s "http://localhost:8000/api/products?search=iphone" | python3 -m json.tool
```

---

### 3.5 Filter by Category
```bash
curl -s "http://localhost:8000/api/products?categoryId=<smartphonesId>" | python3 -m json.tool
```

---

### 3.6 Filter by Price Range
```bash
curl -s "http://localhost:8000/api/products?minPrice=50000&maxPrice=100000&sortBy=price&sortOrder=asc" | python3 -m json.tool
```

---

### 3.7 Get Single Product
```bash
curl -s "http://localhost:8000/api/products/<iphone16Id>" | python3 -m json.tool
```

---

### 3.8 Get Product by Slug
```bash
curl -s "http://localhost:8000/api/products/apple-iphone-16-pro" | python3 -m json.tool
```

---

### 3.9 Update Product
```bash
curl -s -X PUT http://localhost:8000/api/products/<iphone16Id> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "stock": 45, "price": 114900 }' | python3 -m json.tool
```

---

### 3.10 Delete Product (Admin only)
```bash
curl -s -X DELETE http://localhost:8000/api/products/<productId> \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

## 4. INVITATIONS + STAFF OTP LOGIN

### 4.1 Admin Invites Staff
```bash
curl -s -X POST http://localhost:8000/api/invitations \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "name": "Staff Member"
  }' | python3 -m json.tool
```
**What happens:** Staff receives an invite email at `staff@example.com`.

---

### 4.2 List All Invitations (Admin only)
```bash
curl -s http://localhost:8000/api/invitations \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 4.3 Staff Requests OTP
```bash
curl -s -X POST http://localhost:8000/api/invitations/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{ "email": "staff@example.com" }' | python3 -m json.tool
```
**What happens:** Staff receives a 6-digit OTP email. Check the inbox.

---

### 4.4 Staff Verifies OTP → Gets JWT
```bash
curl -s -X POST http://localhost:8000/api/invitations/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@example.com",
    "otp": "123456"
  }' | python3 -m json.tool
```
**Replace** `123456` with the real OTP from the email.
**Save:** `accessToken` as `<staffToken>`

---

### 4.5 Revoke Invitation (Admin only)
```bash
curl -s -X DELETE http://localhost:8000/api/invitations/<invitationId> \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

## 5. CART

> Cart requires authentication (admin, staff, or future customer token).
> Use `<accessToken>` from admin login for testing.

### 5.1 Add Item to Cart
```bash
curl -s -X POST http://localhost:8000/api/cart \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<iphone16Id>",
    "quantity": 2
  }' | python3 -m json.tool
```

---

### 5.2 Add Another Item
```bash
curl -s -X POST http://localhost:8000/api/cart \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<samsungId>",
    "quantity": 1
  }' | python3 -m json.tool
```

---

### 5.3 View Cart (with subtotal)
```bash
curl -s http://localhost:8000/api/cart \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 5.4 Update Item Quantity
```bash
curl -s -X PUT http://localhost:8000/api/cart/<iphone16Id> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "quantity": 3 }' | python3 -m json.tool
```

---

### 5.5 Remove Item
```bash
curl -s -X DELETE http://localhost:8000/api/cart/<samsungId> \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 5.6 Clear Entire Cart
```bash
curl -s -X DELETE http://localhost:8000/api/cart/clear \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

## 6. WISHLIST

### 6.1 Add to Wishlist
```bash
curl -s -X POST http://localhost:8000/api/wishlist \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "productId": "<iphone16Id>" }' | python3 -m json.tool
```

---

### 6.2 View Wishlist
```bash
curl -s http://localhost:8000/api/wishlist \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 6.3 Remove from Wishlist
```bash
curl -s -X DELETE http://localhost:8000/api/wishlist/<iphone16Id> \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

## 7. ORDERS

> To place an order you need an `addressId`. Create one first.

### 7.1 Create Address (needed for orders)
```bash
curl -s -X POST http://localhost:8000/api/addresses \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Home",
    "line1": "123 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "isDefault": true
  }' | python3 -m json.tool
```


---

### 7.2 Place Order
```bash
curl -s -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "addressId": "<addressId>",
    "items": [
      { "productId": "<iphone16Id>", "quantity": 1 },
      { "productId": "<samsungId>", "quantity": 2 }
    ]
  }' | python3 -m json.tool
```
**What happens:** Stock decrements, cart items cleared, order created.
**Save:** `id` as `<orderId>`

---

### 7.3 My Orders
```bash
curl -s "http://localhost:8000/api/orders/my" \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 7.4 Get Single Order
```bash
curl -s "http://localhost:8000/api/orders/<orderId>" \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 7.5 Admin: List All Orders
```bash
curl -s "http://localhost:8000/api/orders" \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 7.6 Admin: Filter Orders by Status
```bash
curl -s "http://localhost:8000/api/orders?status=PENDING" \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

### 7.7 Admin: Update Order Status
```bash
curl -s -X PUT http://localhost:8000/api/orders/<orderId>/status \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "CONFIRMED" }' | python3 -m json.tool
```

**Valid status flow:**
```
PENDING → CONFIRMED → SHIPPED → DELIVERED
PENDING → CANCELLED  (any stage before DELIVERED)
```

---

## 8. ERROR CASES TO TEST

### Wrong password → 401
```bash
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "tejasviraj8686@gmail.com", "password": "wrongpassword" }' | python3 -m json.tool
```

### No token → 401
```bash
curl -s -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{ "name": "Test" }' | python3 -m json.tool
```

### Staff token tries admin action → 403
```bash
curl -s -X DELETE http://localhost:8000/api/products/<productId> \
  -H "Authorization: Bearer <staffToken>" | python3 -m json.tool
```

### OTP for uninvited email → 403
```bash
curl -s -X POST http://localhost:8000/api/invitations/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{ "email": "notinvited@example.com" }' | python3 -m json.tool
```

### Validation error → 400
```bash
curl -s -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "X" }' | python3 -m json.tool
```

---

## 9. QUICK REFERENCE — All Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | /health | — | — |
| POST | /api/auth/login | — | — |
| POST | /api/auth/refresh | — | — |
| POST | /api/auth/logout | ✓ | any |
| GET | /api/auth/me | ✓ | any |
| POST | /api/invitations | ✓ | ADMIN |
| GET | /api/invitations | ✓ | ADMIN |
| DELETE | /api/invitations/:id | ✓ | ADMIN |
| POST | /api/invitations/auth/request-otp | — | — |
| POST | /api/invitations/auth/verify-otp | — | — |
| GET | /api/categories | — | — |
| GET | /api/categories/flat | — | — |
| GET | /api/categories/:id | — | — |
| POST | /api/categories | ✓ | ADMIN |
| PUT | /api/categories/:id | ✓ | ADMIN |
| DELETE | /api/categories/:id | ✓ | ADMIN |
| GET | /api/products | — | — |
| GET | /api/products/:id | — | — |
| POST | /api/products | ✓ | ADMIN/STAFF |
| PUT | /api/products/:id | ✓ | ADMIN/STAFF |
| DELETE | /api/products/:id | ✓ | ADMIN |
| GET | /api/cart | ✓ | any |
| POST | /api/cart | ✓ | any |
| PUT | /api/cart/:productId | ✓ | any |
| DELETE | /api/cart/clear | ✓ | any |
| DELETE | /api/cart/:productId | ✓ | any |
| GET | /api/wishlist | ✓ | any |
| POST | /api/wishlist | ✓ | any |
| DELETE | /api/wishlist/:productId | ✓ | any |
| POST | /api/orders | ✓ | any |
| GET | /api/orders/my | ✓ | any |
| GET | /api/orders/:id | ✓ | any |
| GET | /api/orders | ✓ | ADMIN/STAFF |
| PUT | /api/orders/:id/status | ✓ | ADMIN/STAFF |

---

## Notes

- **Address API** — `GET/POST/PUT/DELETE /api/addresses` — all built.
- **OTP rate limit** — max 5 requests per 15 minutes per IP.
- **Auth rate limit** — max 10 login attempts per 15 minutes per IP.
- **Tokens** — access token expires in 15 minutes. Use refresh endpoint to get a new one.
- **Slugs** — auto-generated from product/category name. `"Apple iPhone 16 Pro"` → `"apple-iphone-16-pro"`
