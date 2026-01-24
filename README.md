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

1. Clone the repo:
```bash
git clone https://github.com/Shamia702/development-platforms-ca.git
```
2.  Navigate to the project directory
```bash
cd development-platforms-ca
```
## Run locally (Live Server)
    
This project uses ES Modules, so it should be run with a local server.

**Using the Live Server extension in Visual Studio Code:**
    
 - Install Live Server
 - Right-click index.html → Open with Live Server
    
## Supabase Setup
### 1.Create a Supabase project
Create a Supabase project and enable Email/Password authentication (email confirmation enabled).

### 2.Create the articles table (RLS enabled)
Create a table named articles with Row Level Security enabled.

**Columns**

- id (int8, primary key, auto)

- created_at (default now())

- title (text, not null)

- body (text, not null)

- category (text, not null)

- submitted_by (uuid, default auth.uid())

### 3.Add Supabase URL + anon key in the project

Open **js/supabase.js** and replace the placeholders:
```js
const supabaseUrl = "Your_Project_Url";
const supabaseKey = "Your_Anon_Key";
```
### 4.Row Level Security (RLS) Policies (Required)

To make the app work securely, Row Level Security must remain enabled on the articles table.

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Public can read all articles (required for public browsing)
CREATE POLICY "Public can read articles" ON public.articles
FOR SELECT USING (true);

-- Logged-in users can create articles (submitted_by must match logged-in user)
CREATE POLICY "Users can create articles" ON public.articles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = submitted_by);

-- Logged-in users can delete their own articles
CREATE POLICY "Users can delete own articles" ON public.articles
FOR DELETE TO authenticated
USING (auth.uid() = submitted_by);
```
## Pages

- index.html — Public article feed
- login.html — Login page
- register.html — Register page
- create.html — Create article (auth protected)

## Motivation Section:
I chose the Supabase option because it allowed me to build a full working platform quickly without writing and hosting a custom backend API. Supabase provided authentication, a PostgreSQL database, and Row Level Security (RLS), 

I enjoyed connecting the frontend to real backend services and seeing the full flow working: register → confirm email → login → create an article → view it in the public feed. The hardest part was setting up and testing RLS policies so that anyone can read articles, only logged-in users can create them, and only the author can delete their own articles. I also had to debug some module path and styling issues, which helped me understand how the project structure works.

Overall, Supabase is faster and simpler to set up, while a custom Express API would give more control but would take more time to build and secure.

## Author
Shamia

## AI Usage

AI tools (ChatGPT) were used during this project for:
- Reviewing and improving README documentation clarity and structure
- Explaining Git and GitHub workflows (pull, push, resolving errors)
- Clarifying Supabase concepts such as authentication and Row Level Security (RLS)

All application logic, database design, and frontend implementation were written, tested, and understood by me.  
No AI-generated code was used without review or understanding.

