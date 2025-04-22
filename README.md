# Custom Medusa E-commerce Platform

<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

## Overview

This project is a customized implementation of the Medusa e-commerce platform. It consists of:

1. A **Backend** built on Medusa with custom content management features
2. A **Frontend** storefront built with Next.js 15

### Custom Features

- **Navbar Content Editor**: A dedicated interface for managing navigation elements
- **Blog Resources**: Full blogging functionality with posts, categories, and tags
- **Homepage Content Editor**: A flexible editor for customizing the homepage layout and content
- **Contact Us Management**: Backend support for contact form submissions
- **Extended Frontend Components**: Custom components to display the managed content

## Repository Structure

- `/backend`: Customized Medusa server with content management extensions
- `/frontend`: Next.js 15 storefront with App Router, Server Components, and more

## Getting Started

### Backend Setup

1. **Install dependencies**
   ```bash
   yarn install-all
   ```

2. **Build the project**
   ```bash
   yarn build
   ```

3. **Configure environment variables**
   ```bash
   cd backend
   mv .env.template .env
   cd ../frontend
   mv .env.template .env
   ```

4. **Create an admin user**
   ```bash
   cd backend
   yarn npx medusa user -e admin@medusajs.com -p supersecret
   ```

5. **Add custom database tables**
   ```bash
   cd backend
   # Generate migrations for each custom model
   yarn medusa db:generate blog_resource_content
   yarn medusa db:generate contact_us
   yarn medusa db:generate homepage_content
   yarn medusa db:generate homepage_slider_content
   yarn medusa db:generate navbar_content

   # Apply all migrations to the database
   yarn medusa db:migrate
   ```

6. **Seed initial data**
   ```bash
   cd backend
   yarn seed
   ```

7. **Start the development server**
   ```bash
   yarn dev
   ```

The frontend will be available at http://localhost:8000, and the backend at http://localhost:9000.

## Features

### E-commerce Capabilities

- Product catalog with collections
- Shopping cart
- Checkout with Stripe integration
- User accounts
- Order management

### Content Management

- **Blog & Resources**: Marketing content, tutorials, and announcements
- **Dynamic Navigation**: Customizable navigation structure
- **Homepage Customization**: Flexible content and slider management
- **Contact Form**: Customer communication channel

## Payment Integrations

This project supports Stripe as a payment provider. To enable Stripe:

1. Add your Stripe public key to the frontend `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
   ```

2. Configure Stripe in your Medusa backend according to the [Medusa documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe).

## Learn More

- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)