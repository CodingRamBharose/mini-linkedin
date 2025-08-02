```markdown
# Mini LinkedIn-like Community Platform

A mini LinkedIn-like community platform built with **Next.js**, **NextAuth.js** (supporting Google login and credentials), **JWT** for authentication, and **MongoDB**. The app supports user authentication with email verification through **Resend**, public post creation, a real-time feed, and user profiles displaying bios and posts. The UI is styled using **ShadCN** and fully responsive.

---

## Tech Stack

- **Framework:** Next.js (React)  
- **Authentication:** NextAuth.js (Email/password + Google OAuth), JWT tokens  
- **Database:** MongoDB with Mongoose  
- **Email Verification:** Resend API  
- **UI:** ShadCN components, Tailwind CSS  
- **Validation:** React Hook Form, Zod  
- **Deployment:** Vercel

---

## Features

- Register/Login using email/password or Google OAuth  
- Email verification on signup via Resend  
- JWT-secured sessions  
- User profiles with name, email, and bio  
- Create and view text-only posts  
- Real-time post feed with author and timestamp  
- Responsive UI for desktop and mobile  
- Form validation with React Hook Form and Zod

---

## Project Structure

```

/app                 # Next.js app directory with pages and API routes
/components          # Reusable UI components (ShadCN-based)
/lib                 # Utilities: database connection, JWT helpers, validation schemas
/models              # Mongoose schemas/models for User, Post, etc.
/pages/api           # API routes (auth, posts, users, email verification)
/public              # Static assets
/styles              # Tailwind and global styles

````

---

## Getting Started

### Prerequisites

- Node.js v16 or higher  
- MongoDB URI (local or cloud)  
- Resend API Key  
- Google OAuth Client ID and Secret  

### Setup

1. Clone the repo:

```bash
git clone https://github.com/CodingRamBharose/mini-linkedin.git
cd mini-linkedin
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root folder with:

```env
MONGO_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_jwt_secret_key
```

4. Run the development server:

```bash
npm run dev
```

5. Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Extra Notes

* Email verification is implemented using the Resend API and React Email components
* JWT tokens are used for secure session management
* UI styled with ShadCN and Tailwind for modern and responsive design
* Client-side validation is done with React Hook Form and Zod schemas
* Real-time feed updates can be enhanced via polling or websockets (currently polling, specify if different)

---

## Live Demo

[https://mini-linkedin-two.vercel.app](https://mini-linkedin-two.vercel.app)

---

## Contribution

Feel free to fork the repo, open issues, and submit pull requests.

---

## Contact

Reach out at [your-email@example.com](mailto:ramavtar.crb@gmail.com) for questions or feedback.

---

