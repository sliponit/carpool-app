import React, { Fragment } from "react";
import { Grid } from '@material-ui/core';
import CreateRide from '../components/CreateRide';
import RideCard from '../components/RideCard';
import axios from 'axios';
import { useDebounce } from "../hooks";
import { useAuth0 } from "@auth0/auth0-react";

const Create = () => {
  const {
    getAccessTokenSilently
  } = useAuth0();

  const [destinations, setDestinations] = React.useState([]);
  const [origins, setOrigins] = React.useState([]);
  const [rides, setRides] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const results = await axios.get(
          process.env.REACT_APP_API_ORIGIN + '/auth/rides',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        if (results.data.rides.length) {
          return setRides(results.data.rides)
        }
        return setRides([]);
      } catch (error) {
        return setRides([]);
      }
    })();
  }, []);

  const handleCreate = async (selectedOrigin, selectedDestination, date, price) => {
    try {
      if (selectedOrigin && selectedDestination && date && price) {
        const token = await getAccessTokenSilently();
        const body = {
          "origin": selectedOrigin.geometry.coordinates.join(','),
          "destination": selectedDestination.geometry.coordinates.join(','),
          "origin_address": selectedOrigin.properties.label,
          "destination_address": selectedDestination.properties.label,
          "price": price,
          "time": date
        }
        const results = await axios.post(process.env.REACT_APP_API_ORIGIN + '/auth/rides', body, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setRides(rides.concat(body));
      }
    } catch (error) {
      return false
    }
  }

  const handleChangeOrigin = async (address) => {
    if (address) {
      const results = await axios.get('https://api-adresse.data.gouv.fr/search/?q=' + address + '&limit=5');
      return setOrigins(results.data.features);
    }
    return setOrigins([]);
  }
  const handleChangeDestination = async (address) => {
    if (address) {
      const results = await axios.get('https://api-adresse.data.gouv.fr/search/?q=' + address + '&limit=5');
      return setDestinations(results.data.features);
    }
    return setDestinations([]);
  }
  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <h5>Save on travel costs</h5>
          <p>Share your travel costs and save every time you travel by car. Plus, for your 1st ride on BlaBlaCar with at least one passenger, you’ll get a 25€ fuel voucher or 40€ car wash voucher.</p>
        </Grid>
        <Grid item xs={4}>
          <h5>Join a trustworthy community</h5>
          <p>We know each of our members: both drivers and passengers. We verify ratings, profiles and IDs, so you know exactly who you’re travelling with.</p>
        </Grid>
        <Grid item xs={4}>
          <h5>Carpooling made simple</h5>
          <p>Our technology makes the entire experience with BlaBlaCar simple, so you can easily find, chat with and meet passengers right on your way.</p>
        </Grid>
        <Grid item xs={12}>
          {rides.map((ride) =>
            <RideCard key={ride.id} ride={ride} />
          )}
        </Grid>
        <Grid item xs={12}>
          <CreateRide
            handleSubmit={handleCreate}
            handleChangeOrigin={useDebounce(handleChangeOrigin, 500)}
            origins={origins}
            handleChangeDestination={useDebounce(handleChangeDestination, 500)}
            destinations={destinations}
          />
        </Grid>
      </Grid>
    </Fragment>
  )
};



export default Create;
