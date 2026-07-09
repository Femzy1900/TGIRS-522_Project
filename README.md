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
By default, the project uses a MongoDB Atlas cluster. The connection string is provided in the `server/.env` file:
```
MONGO_URI=mongodb+srv://adedokunfemi14_db_user:Adedokun1900@cluster0.n7chauo.mongodb.net/tgirs?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```
> **Note:** If you wish to use a local MongoDB instance instead, update the `.env` file to: `MONGO_URI=mongodb://127.0.0.1:27017/tgirs`.

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
