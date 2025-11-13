Admin - admin@lodgify.lite pass-adminpassword
# Lodgify Lite

This is a modern hotel reservation application built with Next.js and Firebase. It provides a platform for users to browse and book hotels, for hotel owners to manage their properties, and for administrators to oversee the platform.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **AI/Generative Features**: [Genkit](https://firebase.google.com/docs/genkit)
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore)
*   **Authentication**: Simulated local logic using Firestore.

## Key Features

*   **Role-Based Authentication**: Secure sign-up and login for three distinct user roles: Guests, Hotel Owners, and Administrators.
*   **Dynamic Hotel Discovery**: Guests can browse and search for hotels, with filtering options for destinations.
*   **Multi-Step Hotel Creation**: A guided, four-step form for hotel owners to submit new properties, including basic info, facilities, and optional verification documents.
*   **Owner Dashboard**: A comprehensive dashboard for property owners to view their submitted hotels, track their status (Pending, Approved, Rejected), and see booking information.
*   **Hotel Management**: Once a hotel is approved, owners can access a dedicated page to add and manage its rooms.
*   **Admin Dashboard**: A powerful control panel for administrators to review and approve or reject new hotel and room submissions, with a complete overview of all platform data.
*   **Seamless Booking**: Guests can book rooms, view their reservation history, and manage their stays.
*   **AI-Powered Suggestions**: In case of booking failures, an AI agent can suggest alternative accommodations based on user preferences.

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application comes pre-seeded with sample users:
*   **Admin:** `admin@lodgify.lite` / `adminpassword`
*   **Owner:** `alice@example.com` / `password`
*   **Guest:** `bob@example.com` / `password`
