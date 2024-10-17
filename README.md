# Chatup 
![Chatup Logo](/images/tesfa-logo.png)

<br>

**Tesfa** is an ERP and CRM Web Application. It is developed to easy and track ministry activities in and outside Organizations. This project is built using Next.js.
<br>

![Login screenshot](/images/login.png)
![Dashboard screenshot](/images/dashboard.png)

## Table of Content
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Configuration](#contribution)
5. [Contribution](#contribution)
6. [License](#license)
7. [Acknowledgement](#acknowledgement)

## Features
- **User:** Registration and Role based User management
- **Reporting:** Report submission and generations through a role based
- **Consignments:** Consigment of Ministry Activities to a registered partners
- **Online Library:** Public online library with thousands of ministry programs.

<br>

## Installation

### Prerequisites
Before you begin, ensure to have met the following requirements:
1. Supabase Account
    - Create account with [supabase](https://supabase.com)
    - Create a supabase project

2.  Google Cloud Console
    - Create [google cloud console](https://console.cloud.google.com/welcome/new)
    - Create a new project
    - Create a auth consent screen and credentials

### Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/josephakaro/Chatup.git
    cd tesfa
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure enivronment variables:
    - Rename `.env.example` to `.env.local` and update the value from supabase
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
    ```

4. Run database migrations:
    ```bash
    npx prisma migrate dev
    ```

5. Start the application:
    ```bash
    # This will reload on update with nodmen
    npm run dev

    # This will start the main application and will require manual reload
    npm start
    ```

## Usage
- **Frontend:** Access the application at [http://localhost:300](http://localhost:3000).
- **API:** Use the following endpoints to interact with the backend:
    - **Book Report**
    - `GET /api/book`: List All book reports
    - `GET /api/book/[:id]`
    - `POST /api/book/add`: Create a new Book report
    - `DELETE /api/book/delete/[:id]`: Delete one book report by ID
    - `UPDATE /api/book/update/[:id]`: Updates one book report by ID

### Testing:
To run tests:

    ```bash
    npm run test
    ```

## Configuration
This project uses the following configuration files
- **.env.local :** Contains enivronment-specific variables
- **config.json :** Configurations for different environments (development, testing, productions)

Update these files as neccessary to match your enironment settings.

## Contribution
To Contribute to this project, please follow these steps:
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-brach-name`).
3. Commit your changes (`git commit -m 'Add some features`).
4. Push to the branch(`git push origin feature-branch-name`).
5. Create a new Pull Request

## License
This project is licensed under the [ONEHOPE License](/LICENSE)

## Acknowledgement
- **Supabase:** Complete backend resource and Database
- **Next.js:** Front-end developements
- **Node.js:** Backend Development
- **Prisma:** Database ORM mapping
- **Contributor:** [Joseph Akaro](https://josephakaro.tech)

<br>

[BACK TO TOP](#tesfa)
