# VolteX API — Testing Guide

> Base URL (local): `http://localhost:8000`
> Base URL (prod): `https://volex-ecommerce-4xsz.vercel.app`
> All protected routes need: `Authorization: Bearer <accessToken>`
> Run `npm run dev` in `/server` before testing locally.

---

## Test Order (follow this sequence)

```
1.  Admin Login           → get accessToken
2.  Customer Register     → get customer accessToken
3.  Forgot/Reset password → OTP flow via email
4.  Profile update        → update name/phone
5.  Create Category       → get categoryId
6.  Upload image          → get image URL for product
7.  Create Product        → get productId
8.  Invite Staff          → staff gets OTP email
9.  Staff OTP Login       → get staff accessToken
10. Cart operations       → add/update/remove
11. Wishlist operations   → add/remove
12. Create Address        → get addressId
13. Apply Coupon          → validate at checkout
14. Place Order           → with optional coupon
15. Razorpay payment      → create order + verify signature
16. Submit Review         → for purchased product
17. Admin moderates       → orders, reviews, coupons
18. Dashboard summary     → admin/staff analytics
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

### 1.5 Customer Register
```bash
curl -s -X POST http://localhost:8000/api/auth/customer/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Customer@123!",
    "name": "Test Customer"
  }' | python3 -m json.tool
```
**Save:** `accessToken` as `<customerToken>` (auto-logged in on register).

---

### 1.6 Customer Login
```bash
curl -s -X POST http://localhost:8000/api/auth/customer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Customer@123!"
  }' | python3 -m json.tool
```

---

### 1.7 Forgot Password — Request OTP
```bash
curl -s -X POST http://localhost:8000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{ "email": "customer@example.com" }' | python3 -m json.tool
```
**What happens:** Customer receives a 6-digit OTP email (15-min expiry).

---

### 1.8 Reset Password (with OTP)
```bash
curl -s -X POST http://localhost:8000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "otp": "123456",
    "newPassword": "NewPass@123!"
  }' | python3 -m json.tool
```
**Replace** `123456` with the real OTP from the email.

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
**What happens:** Customer receives an order status update email (fire-and-forget).

**Valid status flow:**
```
PENDING → CONFIRMED → SHIPPED → DELIVERED
PENDING → CANCELLED  (any stage before DELIVERED)
```

---

## 8. ADDRESSES

### 8.1 List My Addresses
```bash
curl -s http://localhost:8000/api/addresses \
  -H "Authorization: Bearer <customerToken>" | python3 -m json.tool
```

### 8.2 Update Address
```bash
curl -s -X PUT http://localhost:8000/api/addresses/<addressId> \
  -H "Authorization: Bearer <customerToken>" \
  -H "Content-Type: application/json" \
  -d '{ "label": "Office", "isDefault": false }' | python3 -m json.tool
```

### 8.3 Delete Address
```bash
curl -s -X DELETE http://localhost:8000/api/addresses/<addressId> \
  -H "Authorization: Bearer <customerToken>" | python3 -m json.tool
```

---

## 9. USERS (Profile + Password)

### 9.1 Update Profile
```bash
curl -s -X PUT http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer <customerToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "+919876543210",
    "avatar": "https://example.com/avatar.jpg"
  }' | python3 -m json.tool
```

### 9.2 Change Password
```bash
curl -s -X PUT http://localhost:8000/api/users/change-password \
  -H "Authorization: Bearer <customerToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Customer@123!",
    "newPassword": "NewPass@456!"
  }' | python3 -m json.tool
```

### 9.3 Admin: List Customers
```bash
curl -s "http://localhost:8000/api/users?search=customer&page=1&limit=20" \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

## 10. COUPONS

### 10.1 Admin: Create Coupon
```bash
curl -s -X POST http://localhost:8000/api/coupons \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "minOrderAmount": 1000,
    "maxUses": 100,
    "expiresAt": "2026-12-31T23:59:59.000Z",
    "isActive": true
  }' | python3 -m json.tool
```
**Save:** `id` as `<couponId>`

### 10.2 Admin: List Coupons
```bash
curl -s http://localhost:8000/api/coupons \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

### 10.3 Customer: Validate Coupon at Checkout
```bash
curl -s -X POST http://localhost:8000/api/coupons/validate \
  -H "Authorization: Bearer <customerToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "subtotal": 5000
  }' | python3 -m json.tool
```
**Returns:** `discountAmount` to apply at checkout.

### 10.4 Admin: Update Coupon
```bash
curl -s -X PUT http://localhost:8000/api/coupons/<couponId> \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "isActive": false }' | python3 -m json.tool
```

### 10.5 Admin: Delete Coupon
```bash
curl -s -X DELETE http://localhost:8000/api/coupons/<couponId> \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

## 11. REVIEWS

### 11.1 Public: List Product Reviews
```bash
curl -s http://localhost:8000/api/reviews/products/<iphone16Id> | python3 -m json.tool
```

### 11.2 Customer: Submit Review
```bash
curl -s -X POST http://localhost:8000/api/reviews/products/<iphone16Id> \
  -H "Authorization: Bearer <customerToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Excellent product, fast delivery!"
  }' | python3 -m json.tool
```
**Save:** `id` as `<reviewId>`

### 11.3 Admin: List All Reviews (for moderation)
```bash
curl -s "http://localhost:8000/api/reviews?status=PENDING" \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

### 11.4 Admin: Approve/Reject Review
```bash
curl -s -X PUT http://localhost:8000/api/reviews/<reviewId>/status \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "APPROVED" }' | python3 -m json.tool
```
**Valid values:** `APPROVED`, `REJECTED`, `PENDING`

### 11.5 Admin: Delete Review
```bash
curl -s -X DELETE http://localhost:8000/api/reviews/<reviewId> \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```

---

## 12. PAYMENTS (Razorpay)

### 12.1 Create Razorpay Order
```bash
curl -s -X POST http://localhost:8000/api/payments/razorpay/order \
  -H "Authorization: Bearer <customerToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "addressId": "<addressId>",
    "items": [
      { "productId": "<iphone16Id>", "quantity": 1 }
    ],
    "couponCode": "WELCOME10"
  }' | python3 -m json.tool
```
**Returns:** `keyId`, `razorpayOrderId`, `amount` (paise), `currency` (INR).
**Save:** `razorpayOrderId` for the verify step.

### 12.2 Verify Payment Signature (places order on success)
```bash
curl -s -X POST http://localhost:8000/api/payments/razorpay/verify \
  -H "Authorization: Bearer <customerToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpayOrderId": "<razorpayOrderId>",
    "razorpayPaymentId": "<paymentId-from-checkout>",
    "razorpaySignature": "<signature-from-checkout>",
    "addressId": "<addressId>",
    "items": [
      { "productId": "<iphone16Id>", "quantity": 1 }
    ],
    "couponCode": "WELCOME10"
  }' | python3 -m json.tool
```
**What happens:** HMAC-SHA256 signature verified → order created with `PaymentStatus = PAID`. Unique constraint on `paymentId` prevents reuse.

---

## 13. UPLOADS

### 13.1 Upload Product Image (Admin/Staff)
```bash
# Read image as base64 first
IMG_B64=$(base64 -i ./my-product.jpg)

curl -s -X POST http://localhost:8000/api/uploads/image \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d "{
    \"file\": \"data:image/jpeg;base64,${IMG_B64}\",
    \"filename\": \"my-product.jpg\",
    \"folder\": \"products\"
  }" | python3 -m json.tool
```
**Returns:** `url` (public Supabase URL), `path`, `bucket`.
**Limits:** Max 5MB. Allowed: JPEG, PNG, WebP, GIF.

---

## 14. DASHBOARD

### 14.1 Admin/Staff: Summary
```bash
curl -s http://localhost:8000/api/dashboard/summary \
  -H "Authorization: Bearer <accessToken>" | python3 -m json.tool
```
**Returns (admin):** Total revenue, orders, customers, products, low stock items, recent orders.
**Returns (staff):** Total products, low stock count, new products this month.

---

## 15. ERROR CASES TO TEST

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

## 16. QUICK REFERENCE — All Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | /health | — | — |
| POST | /api/auth/login | — | — |
| POST | /api/auth/refresh | — | — |
| POST | /api/auth/logout | ✓ | any |
| GET | /api/auth/me | ✓ | any |
| POST | /api/auth/customer/register | — | — |
| POST | /api/auth/customer/login | — | — |
| POST | /api/auth/forgot-password | — | — |
| POST | /api/auth/reset-password | — | — |
| POST | /api/invitations | ✓ | ADMIN |
| GET | /api/invitations | ✓ | ADMIN |
| DELETE | /api/invitations/:id | ✓ | ADMIN |
| POST | /api/invitations/auth/request-otp | — | — |
| POST | /api/invitations/auth/verify-otp | — | — |
| GET | /api/categories | — | — |
| GET | /api/categories/flat | — | — |
| GET | /api/categories/admin | ✓ | ADMIN/STAFF |
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
| GET | /api/addresses | ✓ | any |
| POST | /api/addresses | ✓ | any |
| PUT | /api/addresses/:id | ✓ | any |
| DELETE | /api/addresses/:id | ✓ | any |
| POST | /api/orders | ✓ | any |
| GET | /api/orders/my | ✓ | any |
| GET | /api/orders/:id | ✓ | any |
| GET | /api/orders | ✓ | ADMIN/STAFF |
| PUT | /api/orders/:id/status | ✓ | ADMIN/STAFF |
| PUT | /api/users/profile | ✓ | any |
| PUT | /api/users/change-password | ✓ | any |
| GET | /api/users | ✓ | ADMIN/STAFF |
| POST | /api/coupons/validate | ✓ | any |
| GET | /api/coupons | ✓ | ADMIN/STAFF |
| POST | /api/coupons | ✓ | ADMIN |
| PUT | /api/coupons/:id | ✓ | ADMIN |
| DELETE | /api/coupons/:id | ✓ | ADMIN |
| GET | /api/reviews/products/:productId | — | — |
| POST | /api/reviews/products/:productId | ✓ | any |
| GET | /api/reviews | ✓ | ADMIN/STAFF |
| PUT | /api/reviews/:id/status | ✓ | ADMIN/STAFF |
| DELETE | /api/reviews/:id | ✓ | ADMIN |
| POST | /api/payments/razorpay/order | ✓ | any |
| POST | /api/payments/razorpay/verify | ✓ | any |
| POST | /api/uploads/image | ✓ | ADMIN/STAFF |
| GET | /api/dashboard/summary | ✓ | ADMIN/STAFF |

---

## Notes

- **OTP rate limit** — max 5 requests per 15 minutes per IP.
- **Auth rate limit** — max 10 login attempts per 15 minutes per IP.
- **Tokens** — access token expires in 15 minutes. Use refresh endpoint to get a new one.
- **Refresh tokens** — 7-day expiry, SHA256-hashed in DB, rotated on each use.
- **Slugs** — auto-generated from product/category name. `"Apple iPhone 16 Pro"` → `"apple-iphone-16-pro"`
- **Order emails** — order confirmation fires on placement; status update fires on admin status change. Both are fire-and-forget (won't block order creation if email fails).
- **Razorpay amounts** — server-side, amounts are computed in paise (₹100 = `10000`). HMAC signature verification prevents tampering.
- **Coupons** — `discountType` is `PERCENTAGE` or `FIXED`. `minOrderAmount` blocks coupons on small carts. `maxUses` is a soft cap (DB unique constraint enforces real limit).
- **Reviews** — server aggregates `rating` and `reviewCount` on the Product when status changes to APPROVED.
