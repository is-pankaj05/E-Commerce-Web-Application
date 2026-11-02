# Zelo – E-Commerce Web Application

Zelo is a modern and responsive E-Commerce web application developed using React.js. It provides users with a smooth online shopping experience, allowing them to explore products, manage wishlists, add items to their cart, and complete the shopping and payment process.

The project was developed to strengthen my frontend development skills and gain practical experience in building a real-world E-Commerce application.

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Application Architecture](#application-architecture)
* [Project Screenshots](#project-screenshots)
* [How to Run the Project](#how-to-run-the-project)
* [Author](#author)

## Features

* User Registration and Login
* Forgot Password Functionality
* Browse and Explore Products
* Add and Remove Products from Wishlist
* Shopping Cart Management
* Payment Process
* User Profile Management
* Responsive Design
* Easy-to-Use Interface

## Technologies Used

| Technology   | Purpose                       |
| ------------ | ----------------------------- |
| React.js     | Frontend Development          |
| JavaScript   | Application Logic             |
| Tailwind CSS | Styling and Responsive Design |
| HTML5        | Web Structure                 |
| React Router | Navigation and Routing        |
| Vite         | Development and Build Tool    |

## Application Architecture

Zelo follows a component-based React architecture. The application is divided into different pages and UI components to make the code organized, reusable, and easier to maintain.

### Architecture Diagram

```mermaid
flowchart TD
    A[User] --> B[Zelo E-Commerce Application]
    B --> C[React.js]
    C --> D[React Router]
    D --> E[Authentication]
    D --> F[Home and Products]
    D --> G[Wishlist]
    D --> H[Shopping Cart]
    D --> I[Payment]
    D --> J[User Profile]
    E --> K[Reusable UI Components]
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
    K --> L[Tailwind CSS]
    L --> M[Responsive User Interface]
```

### Application Flow

1. Users access the application through the browser.
2. React.js renders the user interface using reusable components.
3. React Router manages navigation between different pages.
4. Users can browse products, manage their wishlist, and add products to the shopping cart.
5. Users can proceed through the payment process and manage their profile.

## Project Screenshots

The following screenshots showcase different pages and functionalities of the Zelo E-Commerce application.

### 1. Login Page

<p align="center">
  <img src="screenshots/login.png" width="85%" alt="Login Page">
</p>

### 2. Sign Up Page

<p align="center">
  <img src="screenshots/signUp.png" width="85%" alt="Sign Up Page">
</p>

### 3. Forgot Password

<p align="center">
  <img src="screenshots/forgotPassword.png" width="85%" alt="Forgot Password Page">
</p>

### 4. Home Page

<p align="center">
  <img src="screenshots/home1.png" width="85%" alt="Home Page 1">
</p>

<p align="center">
  <img src="screenshots/home2.png" width="85%" alt="Home Page 2">
</p>

<p align="center">
  <img src="screenshots/home3.png" width="85%" alt="Home Page 3">
</p>

### 5. Wishlist

<p align="center">
  <img src="screenshots/wishlist.png" width="85%" alt="Wishlist Page">
</p>

### 6. Shopping Cart

<p align="center">
  <img src="screenshots/emptycart.png" width="85%" alt="Empty Cart">
</p>

<p align="center">
  <img src="screenshots/cart.png" width="85%" alt="Shopping Cart">
</p>

### 7. Payment Process

<p align="center">
  <img src="screenshots/payment1.png" width="85%" alt="Payment Page 1">
</p>

<p align="center">
  <img src="screenshots/payment2.png" width="85%" alt="Payment Page 2">
</p>

### 8. Logout

<p align="center">
  <img src="screenshots/logout.png" width="85%" alt="Logout Page">
</p>

### 9. User Profile

<p align="center">
  <img src="screenshots/profile.png" width="85%" alt="User Profile">
</p>

## How to Run the Project

**1. Clone the repository**

```bash
git clone https://github.com/is-pankaj05/E-Commerce-Web-Application.git
```

**2. Navigate to the project directory**

```bash
cd E-Commerce-Web-Application
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Open the local URL displayed in your terminal to access the application in your browser.

## Author

**Pankaj Verma**

B.Tech – Electronics and Communication Engineering
MMMUT, Gorakhpur

GitHub: [is-pankaj05](https://github.com/is-pankaj05)
