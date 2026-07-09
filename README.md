# Tech Gadget Information Retrieval System (TGIRS)

TGIRS is a full-stack web application built for the CSC 522 (Information Storage and Retrieval) university course. It serves as an academic demonstration of core IR concepts like indexing, retrieval, search, and relevance scoring, wrapped in a modern, responsive UI.

## Tech Stack
- **Frontend**: React + Vite, Tailwind CSS, React Router, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose

## Project Structure
```
tgirs/
├── server/
│   ├── src/
│   │   ├── models/Gadget.js        # Mongoose Schema & Text Index
│   │   ├── routes/gadgetRoutes.js  # API routes
│   │   ├── controllers/            # Route logic
│   │   ├── config/db.js            # MongoDB connection
│   │   └── services/               # Relevance Scorer (Custom IR Logic)
│   ├── seed.js                     # Database seeding script (50 gadgets)
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/                  # Home, Browse, Details, Admin, About
│   │   ├── hooks/                  # Custom hooks (useDebounce)
│   │   ├── lib/api.js              # API Client
│   │   ├── App.jsx                 # React Router Config
│   │   └── index.css               # Tailwind & Global styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### 1. Database Configuration
Create a `.env` file inside the `server/` directory with the following content:
```
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```
> **Note:** You can get a free MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas). If you prefer a local instance, use: `MONGO_URI=mongodb://127.0.0.1:27017/tgirs`.

### 2. Backend Setup
Navigate to the `server` directory, install dependencies, and run the server:
```bash
cd server
npm install
npm run dev
```
> The backend runs on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window, navigate to the `client` directory, install dependencies, and start Vite:
```bash
cd client
npm install
npm run dev
```
> The frontend runs on `http://localhost:5173`.

## Core IR Concepts Demonstrated
- **Collection & Documents:** A MongoDB database of structured tech gadgets with unstructured text descriptions.
- **Indexing:** MongoDB Text Indexes are used for rapid initial candidate retrieval.
- **Querying:** Support for multi-keyword, partial, and case-insensitive search.
- **Retrieval & Relevance Scoring:** A custom Node.js `services/relevanceScorer.js` weights exact and partial matches across different document fields (Product Name > Brand > Specs > Description) to assign a relevance score and rank results.

Check the **Evaluation & IR** page within the running app for a full breakdown!
"# TGIRS-522_Project" 
