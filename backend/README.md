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
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

## Overview

This project is a customized implementation of the Medusa e-commerce Backend Platform. The backend has been extended with several custom features to enhance content management capabilities:

### Custom Features

- **Navbar Content Editor**: A dedicated interface for managing navigation elements, allowing for dynamic control of the site's navigation structure.
- **Blog Resources**: Full blogging functionality with posts, categories, and tags to support content marketing strategies.
- **Homepage Content Editor**: A flexible editor for customizing the homepage layout and content without requiring code changes.

These customizations provide comprehensive content management capabilities on top of Medusa's robust e-commerce foundation.

## Compatibility

This starter is compatible with versions >= 1.8.0 of `@medusajs/medusa`. 

## Getting Started

### Step 1: Install dependencies
```bash
yarn install
```

### Step 2: Build the project
```bash
yarn build
```

### Step 3: Move the .env.template file to .env and fill in the correct values
```bash
mv .env.template .env
```

### Step 4: Create an admin user
```bash
yarn npx medusa user -e admin@medusajs.com -p supersecret
```

### Step 5: Run the development server
```bash
yarn dev
```

### Step 6: Add custom database tables
You need to add the custom tables for content management features:

```bash
# Generate migrations for each custom model
yarn medusa db:generate blog_resource_content
yarn medusa db:generate contact_us
yarn medusa db:generate homepage_content
yarn medusa db:generate homepage_slider_content
yarn medusa db:generate navbar_content

# Apply all migrations to the database
yarn medusa db:migrate
```

These migrations will create all necessary tables for the custom content management features.

### Step 7: Seed initial data
After creating the necessary tables, seed the database with initial data:

```bash
yarn seed
```

Visit the [Quickstart Guide](https://docs.medusajs.com/learn) to set up a server.

Visit the [Docs](https://docs.medusajs.com/learn#get-started) to learn more about our system requirements.

