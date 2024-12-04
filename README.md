This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started Locally Setup

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## App Specification

- **Authentication**: Implement Signin/Signup functionality using JWT for Role-Based Access Control (RBAC) and token verification/validation.
- **CRUD Operations for Tasks/Todos**: Create, Read, Update, and Delete tasks or todos. Mark tasks as complete and view details of individual todos.
- **Profile Management**: Update user profile information and change passwords.
- **Todo Pagination**: Set the maximum number of todos displayed per page and control pagination.

## Tech Stack and Libraries

This project uses the following technologies, concepts, and libraries:

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **bcryptjs**: A library to help you hash passwords.
- **jose**: A library for JSON Web Tokens (JWT) and other JOSE (JSON Object Signing and Encryption) standards.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **Valibot**: A validation library for TypeScript.
- **React Query**: A library for fetching, caching, and updating asynchronous data in React applications.
- **Lucide React**: A library of icons for React.
- **Sonner**: A library for notifications in React applications.

## Setup Environment Variables

Before running the application, you need to set up the environment variables. Create a `.env` file in the root directory of your project and copy the contents of `.env.example` into it. Then, fill in the required values.
