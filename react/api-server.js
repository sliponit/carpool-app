require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const app = express();
var bodyParser = require('body-parser')


const audience =
    process.env.REACT_APP_AUDIENCE && process.env.REACT_APP_AUDIENCE !== "YOUR_API_IDENTIFIER"
      ? process.env.REACT_APP_AUDIENCE
      : null;
const domain = process.env.REACT_APP_DOMAIN;

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = process.env.REACT_APP_ORIGIN || `http://localhost:${appPort}`;


if (
  !domain ||
  !audience ||
  audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));
app.use(bodyParser.json());  


const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),

  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"],
});


const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'example',
  port: 5432,
})

app.get("/auth/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});


app.get("/auth/rides", checkJwt, (req, res) => {
  const { driver, day, origin, destination } = req.query;
  const { sub } = req.user;
  const address = sub.slice('oauth2|siwe|eip155:1:'.length);
  console.log({ sub, address, driver, origin, destination });
  let query = 'SELECT rides_id, ST_AsGeoJSON(origin)::json as origin, ST_AsGeoJSON(destination)::json as destination, origin_address, destination_address, price, driver, passenger, time, created_at FROM rides';
  const params = [];
  if (driver) {
    query += ' WHERE driver=$1';
    params.push(driver);
  } else if (origin || destination || day) {
    if (!origin || !destination || !day) return res.status(400).send('BadRequest: specify day, origin and destination');

    query += ' WHERE passenger is null AND ST_DWithin(origin, ST_MakePoint($1,$2)::geography, 20000) AND ST_DWithin(destination, ST_MakePoint($3,$4)::geography, 20000) AND CAST(time AS DATE) = $5'; // TODO?? 20 km
    const [lat1, lng1] = origin.split(',');
    const [lat2, lng2] = destination.split(',');
    [lat1, lng1, lat2, lng2, day].forEach(param => { params.push(param) })
  }
  

  query += ' ORDER BY TIME'
  return pool
    .query(query, params)
    .then(results => results.rows.map(ride => ({ ...ride, origin: ride.origin.coordinates.join(','), destination: ride.destination.coordinates.join(',')})))
    .then(rides => res.send({ rides }))
    .catch(err => {
      console.error('Error executing query', err.stack);
      res.status(500).send('InternalServerError')
    })
});


app.post("/auth/rides", checkJwt, (req, res) => {
  const { time, origin, destination, origin_address, destination_address, price } = req.body;
  const { sub } = req.user;
  const driver = sub.slice('oauth2|siwe|eip155:1:'.length);
  const query = `insert into rides (origin, destination, origin_address, destination_address, price, driver, time)
   VALUES (ST_MakePoint($1,$2)::geography, ST_MakePoint($3,$4)::geography, $5, $6, $7, $8, $9)`;
  const [lat1, lng1] = origin.split(',');
  const [lat2, lng2] = destination.split(',');
  const params = [lat1, lng1, lat2, lng2, origin_address, destination_address, price, driver, time];
  return pool
    .query(query, params)
    .then(rides => res.send('OK'))
    .catch(err => {
      console.error('Error executing query', err.stack);
      res.status(500).send('InternalServerError')
    })
});


app.listen(port, () => console.log(`API Server listening on port ${port}`));
