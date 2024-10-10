# Labo 2 BE

## Prerequisites

#### Node.js
#### MongoDB 

- Install <b>MongoDB Community Server with Compass</b> from https://www.mongodb.com/try/download/community
(under On-premises  MondoDB locally)
- Install <b>The MongoDB Database Tools</b> https://www.mongodb.com/try/download/database-tools
- Create a db called <b>gti525</b>
- Create collection <b>fontaines, compteurs, stats</b>
## Importing CSV
use a terminal to import excel for fontaines and compteurs <b> use the csv from this project folder</b>

- navigate to the bin folder of the MongoDB Database Tools
  <b>ex: cd C:\Program Files\MongoDB\Tools\100\bin</b>
#### run commands:
    mongoimport --db=gti525 --collection=pointsinteret --type=csv --headerline --file=...path to fontaines csv
    mongoimport --db=gti525 --collection=compteurs --type=csv --headerline --file=...path to compteurs csv


## Getting started with this App
<b>Scripts are in place for SSR (server side rendering)</b>
- if changes have been made to client run <b>ng build</b> before starting nodejs
#### run commands:
    npm install
    npm run build
    npm run start (or run start-dev for dev)
##### You should get:
    Successfully connected to database: gti525 and collection: stats
    waiting for localhost...
    Serveur disponible à http://localhost:3000 (this step may be long the first time as it is loading the stats)
