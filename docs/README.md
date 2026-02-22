[![Playwright Tests](https://github.com/adrianyadav/unpacked/actions/workflows/playwright.yml/badge.svg)](https://github.com/adrianyadav/unpacked/actions/workflows/playwright.yml)

[![Deployed](https://deploy-badge.vercel.app/vercel/unpacked)](https://www.unpacked.com)

# unpacked - Fashion Outfit Management App

unpacked is a modern web application built with Next.js that helps users organize, save, and browse fashion outfits. Built with a responsive design and intuitive user interface, it provides a seamless experience for fashion enthusiasts to manage their wardrobe digitally.

## Features

- **Modern Tech Stack**: Next.js 15 with App Router, Server Actions & API Routes
- **Authentication**: Secure login and signup using NextAuth.js v4
- **Database**: Prisma ORM with PostgreSQL for reliable data storage
- **Responsive Design**: Mobile-first approach with responsive header and navigation
- **Outfit Management**: Create, view, edit, and delete outfit collections
- **User Profiles**: Personalized experience with user-specific outfit libraries
- **Modern UI**: Beautiful interface with gradient designs and smooth animations
- **Real-time Updates**: Instant feedback and seamless user interactions

## Key Components

### Responsive Header

- Mobile hamburger menu for smaller screens
- Desktop horizontal navigation for larger screens
- Smooth transitions and hover effects
- User authentication status display

### Outfit Management

- Browse all public outfits
- Create and manage personal outfit collections
- User-specific "My Outfits" section
- Intuitive CRUD operations

## Getting started

### 1. Install dependencies

After cloning the repo and navigating into it, install dependencies:

```bash
npm install
```

### 2. Create a Prisma Postgres instance

Create a Prisma Postgres instance by running the following command:

```bash
npx prisma init --db
```

This command is interactive and will prompt you to:

1. Log in to the [Prisma Console](https://console.prisma.io)
2. Select a **region** for your Prisma Postgres instance
3. Give a **name** to your Prisma project

Once the command has terminated, copy the **Database URL** from the terminal output. You'll need it in the next step when you configure your `.env` file.

### 3. Set up your `.env` file

You now need to configure your database connection via an environment variable.

First, create an `.env` file:

```bash
touch .env
```

Then update the `.env` file by replacing the existing `DATABASE_URL` value with the one you previously copied. It will look similar to this:

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=PRISMA_POSTGRES_API_KEY"
```

To ensure your authentication works properly, you'll also need to set [env vars for NextAuth.js](https://next-auth.js.org/configuration/options):

```bash
AUTH_SECRET="RANDOM_32_CHARACTER_STRING"
```

You can generate a random 32 character string for the `AUTH_SECRET` secret with this command:

```bash
npx auth secret
```

In the end, your entire `.env` file should look similar to this (but using _your own values_ for the env vars):

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMWEzMjBiYTEtYjg2Yy00ZTA5LThmZTktZDBhODA3YjQwZjBkIiwidGVuYW50X2lkIjoiY2RhYmM3ZTU1NzdmMmIxMmM0ZTI1Y2IwNWJhZmZhZmU4NjAxNzkxZThlMzhlYjI1NDgwNmIzZjI5NmU1NTkzNiIsImludGVybmFsX3NlY3JldCI6ImI3YmQzMjFhLTY2ODQtNGRiMC05ZWRiLWIyMGE2ZTQ0ZDMwMSJ9.JgKXQBatjjh7GIG3_fRHDnia6bDv8BdwvaX5F-XdBfw"

AUTH_SECRET="gTwLSXFeNWFRpUTmxlRniOfegXYw445pd0k6JqXd7Ag="
```

### 4. Migrate the database

Run the following commands to set up your database and Prisma schema:

```bash
npx prisma migrate dev --name init
```

### 5. Seed the database

Add initial data to your database:

```bash
npx prisma db seed
```

### 6. Run the app

Start the development server:

```bash
npm run dev
```

Once the server is running, visit `http://localhost:3000` to start using unpacked.

## Project Structure

```
app/
├── components/          # Reusable UI components
├── Header.tsx          # Responsive navigation header
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page
├── outfits/            # Outfit browsing pages
├── my-outfits/         # User's personal outfits
└── login/              # Authentication pages
```

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: NextAuth.js v4
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **UI Components**: Custom component library

## Responsive Design

The application features a mobile-first responsive design:

- **Mobile (< 768px)**: Hamburger menu with full-width dropdown navigation
- **Tablet (768px+)**: Full horizontal navigation
- **Desktop (1024px+)**: Enhanced spacing and layout optimizations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

- [Prisma ORM documentation](https://www.prisma.io/docs/orm)
- [Next.js documentation](https://nextjs.org/docs)
- [NextAuth.js documentation](https://next-auth.js.org/)
