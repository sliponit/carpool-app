import React, { Fragment } from "react";
import { Grid } from '@material-ui/core';
import Search from '../components/Search'
import RideCard from '../components/RideCard'
import img from "../assets/img001.png";
import { useDebounce } from "../hooks";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import moment from 'moment';

const Book = () => {
  const [destinations, setDestinations] = React.useState([]);
  const [origins, setOrigins] = React.useState([]);
  const [rides, setRides] = React.useState([]);
  const {
    getAccessTokenSilently
  } = useAuth0();


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

  const handleSearch = async (selectedOrigin, selectedDestination, date) => {
    try {
      if (selectedOrigin && selectedDestination && date) {
        const token = await getAccessTokenSilently();
        const day = moment(date).format('YYYY-MM-DD');
        const rides = await axios.get(
          process.env.REACT_APP_API_ORIGIN + `/auth/rides?origin=${selectedOrigin.geometry.coordinates.join(',')}&destination=${selectedDestination.geometry.coordinates.join(',')}&day=${day}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (rides.data.rides.length) {
          return setRides(rides.data.rides)
        }
        return setRides([]);
      }
    } catch (error) {
      return setRides([]);
    }
  }

  const handleBooking = async () => {
    //TODO: We need to call to the Superfluid service
  }

  return (
    <Fragment>
      <Grid container spacing={2} style={{ background: '#f4f4f4', padding: 20 }}>
        <Grid item xs={12}>
          <div style={{
            height: 400,
            borderRadius: 4,
            overflow: 'hidden',
            background: `url(${img}) center center`
          }}
          />
        </Grid>
        <Grid item xs={12}>
          <Search
            handleSubmit={handleSearch}
            handleChangeOrigin={useDebounce(handleChangeOrigin, 500)}
            origins={origins}
            handleChangeDestination={useDebounce(handleChangeDestination, 500)}
            destinations={destinations}
          />
        </Grid>
        <Grid item xs={12}>
          {rides.map((ride) =>
            <RideCard key={ride.id} ride={ride} onSubmit={handleBooking} />
          )}
        </Grid>
        <Grid item xs={4}>
          <h5>Your pick of rides at low prices</h5>
          <p>No matter where you’re going, find the perfect ride from our wide range of destinations and routes at low prices.</p>
        </Grid>
        <Grid item xs={4}>
          <h5>Trust who you travel with</h5>
          <p>We take the time to get to know each of our members. We check reviews, profiles and IDs, so you know who you’re travelling with and can book your ride at ease on our secure platform.</p>
        </Grid>
        <Grid item xs={4}>
          <h5>Scroll, click, tap and go!</h5>
          <p>Booking a ride has never been easier! Thanks to our simple app powered by great technology, you can book a ride close to you in just minutes.</p>
        </Grid>
      </Grid>
    </Fragment>
  )
};

export default Book;
