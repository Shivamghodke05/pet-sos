# PetSOS
A platform to report lost or injured animals in real-time, connecting users with local rescuers using geolocation and alerts.

## Setup
1. Clone the repo: `git clone https://github.com/your-username/pet-sos.git`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and add your credentials.
4. Set up a MySQL database and update `db.js` with your credentials.
5. Run the backend: `npm start`
6. Run the frontend: `cd client && npm start` (if separated, see below).
7. edit the `filebase.js` file and replace firebase config with your own firebase config.

## Features
- Report lost/injured animals with geolocation or address input.
- View recent reports with images and locations.
- Powered by Nominatim for free geocoding and Cloudinary for image uploads.
- Built with React, Node.js, Express, MySQL, and Firebase Auth.

## Deployment
- Frontend: Deployed on Netlify/Vercel.
- Backend: Deployed on Render/Heroku.
- Database: Hosted on a MySQL provider (e.g., PlanetScale, AWS RDS).

## Attribution
Location data powered by [OpenStreetMap](https://www.openstreetmap.org).
