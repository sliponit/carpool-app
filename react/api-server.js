require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const app = express();

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

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});


app.get("/api/rides", checkJwt, (req, res) => {
  const { driver } = req.query;
  const { sub } = req.user;
  const address = sub.slice('oauth2|siwe|eip155:1:'.length)
  console.log({ sub, address, driver })
  let query = 'SELECT rides_id, ST_AsGeoJSON(origin)::json as origin, ST_AsGeoJSON(destination)::json as destination, price, driver, passenger, time, created_at FROM rides';
  const params = [];
  if (driver) {
    query += ' WHERE driver=$1';
    params.push(driver)
  }
  

  query += ' ORDER BY TIME'
  return pool
    .query(query, params)
    .then(results => results.rows)
    .then(rides => res.send({ rides }))
    .catch(err => console.error('Error executing query', err.stack))
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
