<h1 align="center" style="font-size: 36px;">
  <img src="./client/src/assets/thumbnail.png" width="35"/> BOOK STORE
</h1>

# Welcome to Book Store 

This is a full-stack Book Store web application built using the MERN stack. It supports secure user authentication, Stripe payments, and an intuitive UI for users to browse, purchase, and manage books online.

## 🔗 Hosted Link
[Explore Live](https://bookstore-1-f5z3.onrender.com)

## 🚀 Features

- **Full Stack Integration:** Powered by React.js frontend and Node.js + Express.js backend with MongoDB for robust data storage.
- **Authentication:** JWT-based secure login/signup system with user roles (admin/user).
- **Admin Panel:** Admins can add, edit, or delete books, view all orders, and manage inventory efficiently.
- **Stripe Payments:** Seamless integration with Stripe for secure checkout and payment.
- **Responsive UI:** Tailwind CSS ensures mobile-first, smooth responsive design across all screen sizes.
- **Product Management:** Add books with metadata (author, genre, price, stock), edit details, and manage real-time availability.
- **Cart System:** Users can add books to cart, update quantities, and remove items dynamically.
- **Order Tracking:** After checkout, users can view their past orders with status updates and book details.
- **Redux Toolkit Query:** Efficient and structured data fetching with RTK Query for improved app performance.

## 🛠️ Tech Stack

- React.js  
- Node.js  
- Express.js  
- MongoDB  
- Redux Toolkit & RTK Query  
- Stripe API  
- Tailwind CSS  
- JWT for Authentication

## 📸 Screenshots

#### Home Page
![Home](https://github.com/user-attachments/assets/a5a65abf-15c2-48ce-bcc7-51d0330f0bfb)


#### Shop Page
![Shop](https://github.com/user-attachments/assets/d8d49ae3-78a0-4e50-b694-e3ac91ce674b)

#### Contact Page
![Contact](https://github.com/user-attachments/assets/5c4d08e0-7bee-4cbf-8ba9-751845d9b74d)

#### Cart Page(cart for both guest and user but login requied* to checkout)
![Cart](https://github.com/user-attachments/assets/a0395f2e-f5e6-4c23-99b4-cfa1bca38a8a)

#### Checkout with Stripe
![Checkout](https://github.com/user-attachments/assets/d1bb58f0-cea5-45dd-b06d-f94efbc2c363)

#### Admin Dashboard
![Dashboard](https://github.com/user-attachments/assets/bd02bc30-5efa-44b2-aa51-d3048e084991)


## 🧩 Installation

To run this project locally:

### 🔐 Backend (Node.js + Express)

```bash
git clone https://github.com/Abhithakur7080/bookstore.git
cd bookstore/backend
npm install
npm run dev
```


> update all your env
```env
# Server
PORT=your_running_port

# MongoDB
MONGO_URI=your_db_uri
MONGO_DB_NAME=your_databse_name

# email for nodemailer
MAIL_USER=your_user_mail
MAIL_PASS=your_mail_password
MAIL_HOST=your_smtp_host
MAIL_PORT=your_mail_port

# JWT
JWT_SECRET=your_secret
JWT_EXPIRATION=your_expiration
JWT_REFRESH_SECRET=your_secret
JWT_REFRESH_EXPIRATION=your_expiration

# Frontend
FRONTEND_URL=your_domain

# Stripe
STRIPE_SECRET_KEY=your_key
```
### 💻 Frontend (React.js)
```bash
cd bookstore/frontend
npm install
npm run dev
```

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project:

1. **Fork** the repository  
2. **Create a new branch**  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## Contact
If you have any questions or suggestions regarding this project, feel free to contact us at [abhijeetthakur7080@gmail.com](mailto:abhijeetthakur7080@gmail.com).
