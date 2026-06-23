Install Frontend Dependencies: Download the core interface packages (React, Vite, ESLint, etc.) listed in package.json:
npm install

Install Backend Database Engine: Install json-server as a development dependency so your local db.json file can process real requests:

npm install -D json-server
npx json-server db.json --port 3000

By default, the initial setup uses hardcoded conditional structures and simulated arrays inside MockData.js. If you want the backend database to actually work and process live data, you must completely replace your old App.jsx file with the new database-connected versions.