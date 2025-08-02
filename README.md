# Mini LinkedIn-like Community Platform

A mini LinkedIn-like community platform built with Next.js and MongoDB. This application allows users to register, log in (via credentials or Google), create posts, and interact with a real-time feed. It features a modern, responsive UI built with ShadCN/UI and Tailwind CSS.

---

### ✨ Live Demo

**Check out the live version here: [https://mini-linkedin-two.vercel.app](https://mini-linkedin-two.vercel.app)**

---

*(Optional: Add a screenshot of your application here for a better first impression)*

`![App Screenshot](link-to-your-screenshot.png)`

---

## 🚀 Features

-   **Authentication:** Secure user registration and login with email/password or Google OAuth, managed by NextAuth.js.
-   **Email Verification:** Ensures valid user signups using the Resend API.
-   **JWT-Secured Sessions:** Secure, stateless session management.
-   **User Profiles:** Viewable user profiles with name, email, and a customizable bio.
-   **Post Creation:** Users can create and publish text-only posts.
-   **Real-time Feed:** A live feed displaying all posts with author and timestamp.
-   **Responsive Design:** A fully responsive UI that works seamlessly on desktop and mobile devices.
-   **Form Validation:** Robust client-side form validation using React Hook Form and Zod.

---

## 🛠️ Tech Stack

-   **Framework:** Next.js (React)
-   **Authentication:** NextAuth.js (Email/Password + Google OAuth)
-   **Database:** MongoDB with Mongoose
-   **Email Services:** Resend API
-   **UI:** ShadCN/UI, Tailwind CSS
-   **Form Management:** React Hook Form
-   **Schema Validation:** Zod
-   **Deployment:** Vercel

---

## 📦 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB URI (from a local instance or a cloud service like MongoDB Atlas)
-   Resend API Key
-   Google OAuth Client ID and Secret

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/CodingRamBharose/mini-linkedin.git](https://github.com/CodingRamBharose/mini-linkedin.git)
    cd mini-linkedin
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following variables:
    ```env
    # MongoDB
    MONGO_URI=your_mongodb_connection_string

    # NextAuth.js
    NEXTAUTH_SECRET=generate_a_strong_secret_key # You can use `openssl rand -base64 32`
    NEXTAUTH_URL=http://localhost:3000

    # Google OAuth Credentials
    GOOGLE_CLIENT_ID=your_google_oauth_client_id
    GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

    # Resend API for Emails
    RESEND_API_KEY=your_resend_api_key

    # JWT Secret
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 🤝 Contribution

Contributions are welcome! If you have suggestions or want to improve the code, feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please open an issue first to discuss what you would like to change.

---

## 📧 Contact

Ram Avtar – [ramavtar.crb@gmail.com](mailto:ramavtar.crb@gmail.com)

Project Link: [https://github.com/CodingRamBharose/mini-linkedin](https://github.com/CodingRamBharose/mini-linkedin)