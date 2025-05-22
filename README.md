# Cruise Viewer

**Cruise Viewer** is a secure, modern React-based frontend for browsing and administering Lindblad Expeditions cruise data. It provides authenticated access for admins and public trip availability browsing via a clean and responsive interface.

---

## 🔧 Technologies Used

* **React** (via Vite) for fast, modular UI
* **Tailwind CSS** for styling and responsive design
* **Auth0** for authentication and role-based access control
* **CloudFront** to serve static assets globally
* **S3** for expedition data storage (JSON)
* **API Gateway + Lambda** for admin API access via `cruise-admin`

---

## 🧭 Key Features

### 🔐 Authentication

* Login/Logout via Auth0
* Role-based routing: Only users with the `admin` role can access the Admin Panel

### 🛳️ Trip Browser

* Loads expedition data from S3 `trip_list.json`
* Filters by destination, dates, ships, cabin availability, duration
* Responsive grid layout and mobile-friendly experience
* Dark mode support with system preference detection

### ⚙️ Admin Portal

* **List Users**: Displays users with roles, favorites, last login, etc.
* **Invite User**: Sends an Auth0 invitation
* **Delete User**: Securely deletes an Auth0 user by email

All admin actions are powered via secure API calls to `cruise-admin`, authenticated via JWT access tokens.

---

## 🚀 Deployment

Static frontend is built via Vite and deployed to **AWS CloudFront** with S3 as origin. Infrastructure is managed via Terraform.

Auth0 settings and S3 endpoints are injected at build time from the `config.js` module.

---

## 🔐 Security Highlights

* No secrets are stored client-side
* All admin actions require a valid JWT access token
* Role checking is done both client-side and server-side
* Logout triggers a full Auth0 session termination

---

## 📁 Project Structure

```
cruise-viewer/
├── public/
├── src/
│   ├── components/       # TripCard, DepartureRow, CabinCategoryRow, etc.
│   ├── pages/            # PortalAdmin, LoginRedirect
│   ├── hooks/            # useAccessToken.js
│   ├── styles/           # index.css (tailwind)
│   └── config.js         # S3 and API URLs
├── vite.config.js
├── index.html
└── package.json
```

---

## 🧪 Local Development

```bash
npm install
npm run dev
```

Make sure `.env` includes correct Auth0 and S3 base URLs.

---

## 📬 Feedback

Reach out to the project maintainers for bugs, feature requests, or API integration questions.

---

Part of the **Lindblad Cruise Infrastructure**:

* `cruise-finder`: Expedition data scraper
* `cruise-admin`: Admin API and Auth0 user management
