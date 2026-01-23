# News Platform

A simple news platform where anyone can browse articles and authenticated users can submit new articles. This project is built with vanilla JavaScript and uses Supabase for the backend.

## Features

- Public article feed (anyone can view)
- Register + login (email/password, email confirmation enabled)
- Only logged-in users can create articles
- Articles include title, body, category, created date, and submitter
- Users can delete their own articles (protected by RLS)


## Technologies Used

- HTML, CSS, Vanilla JavaScript (ES Modules)
- Supabase (PostgreSQL, Auth, Row Level Security)
- Supabase JS client (CDN)

## Getting Started

### Installation

1.  Clone the repo
    ```bash
    git clone https://github.com/your-username/development-platforms-ca.git
    ```
2.  Navigate to the project directory
    ```bash
    cd development-platforms-ca
    ```

**Using the Live Server extension in Visual Studio Code:**

- Install Live Server
- Right-click index.html → Open with Live Server

## Pages

- index.html — Public article feed
- login.html — Login page
- register.html — Register page
- create.html — Create article (auth protected)

## Motivation:
I chose the Supabase option because it let me build a complete full-stack solution quickly without having to write and host a custom backend API. Supabase gave me authentication, a PostgreSQL database, and security features (RLS) out of the box, which matched the assignment requirements well.

What I enjoyed most was connecting the frontend to real backend services and seeing the whole flow working: register → confirm email → login → create an article → see it appear in the public feed. I also liked how the UI could change based on whether a user is logged in or not.

The hardest part was configuring Row Level Security policies correctly. It took some trial and testing to make sure the public could read articles, while only authenticated users could create articles, and only the original author could delete their own posts. I also found debugging small issues (like file paths and styling conflicts) a bit time-consuming, but it helped me understand the project structure better.

## Author
Shamia