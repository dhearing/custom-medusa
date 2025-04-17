<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

<h1 align="center">
  Medusa Next.js Starter Template
</h1>

<p align="center">
Combine Medusa's modules for your commerce backend with the newest Next.js 15 features for a performant storefront.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

### Prerequisites

To use the [Next.js Starter Template](https://medusajs.com/nextjs-commerce/), you should have a Medusa server running locally on port 9000.

Check out [create-medusa-app docs](https://docs.medusajs.com/create-medusa-app) for more details and troubleshooting.

# Overview

The Medusa Next.js Starter is built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/)

Features include:

- Full ecommerce support:
  - Product Detail Page
  - Product Overview Page
  - Product Collections
  - Cart
  - Checkout with Stripe
  - User Accounts
  - Order Details
- Full Next.js 15 support:
  - App Router
  - Next fetching/caching
  - Server Components
  - Server Actions
  - Streaming
  - Static Pre-Rendering
- Customized features pulled from backend:
  - Navbar Content
  - Blogs / Resources
  - Homepage Content (slider images and main content)

# Quickstart

### Setting up the environment variables

Navigate into your projects directory and get your environment variables ready:

```shell
cd frontend/
mv .env.template .env.local
```

### Install dependencies

Use Yarn to install all dependencies.

```shell
yarn
```

### Start developing

You are now ready to start up your project.

```shell
yarn dev
```

### Open the code and start customizing

Your site is now running at http://localhost:8000!

# Payment integrations

By default this starter supports the following payment integrations

- [Stripe](https://stripe.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
```

You'll also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe#main).

# Adding Blog & Resources Section

This starter template includes a built-in blog and resources section accessible at the `/content` URL path. To add and manage blog posts or resources in the backend, follow these steps:

## Setting up the Blog Module

1. **Add Blog Content in Admin Panel**:
   - Navigate to your Medusa admin panel
   - Look for the "Blog & Resources" section in the sidebar menu
   - Click "Add New" to create a new blog post or resource

2. **Required Fields for Blog Posts**:
   - **Title**: The title of your blog post or resource
   - **Category**: Assign a category to help organize content
   - **Description**: A brief summary of the content
   - **Main Image**: Upload a featured image (supported format: JPG, PNG)
     - For Google Drive images, use the direct link format
   - **Link**: A unique identifier for the URL (will be part of the permalink)

3. **Accessing Blog Content**:
   - Frontend users can access all blog posts and resources at `/content`
   - They can filter content by category using the sidebar navigation
   - The "All Content" option shows all available posts across categories

4. **Important Notes**:
   - Ensure your content has valid image URLs
   - The URL for accessing all blogs and resources is fixed at `/content`
   - Each individual blog post will be accessible at `/content/[link]`
   - Categories are automatically sorted alphabetically in the sidebar

5. **Customizing the Blog Display**:
   - You can modify the display components in `frontend/src/modules/resources/index.tsx`
   - Category filtering logic is in `frontend/src/modules/store/components/refinement-list/resource-category-list/index.tsx`

This blog module provides a simple way to add marketing content, tutorials, announcements, or resource pages to your Medusa store without requiring additional CMS integration.

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)
