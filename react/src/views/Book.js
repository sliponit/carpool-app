import React, { Fragment } from "react";
import { Grid } from '@material-ui/core';
import Search from '../components/Search'
import RideCard from '../components/RideCard'
import img from "../assets/img001.png";
import { useDebounce } from "../hooks";
import axios from 'axios';

const Book = () => {
  const [destinations, setDestinations] = React.useState([])
  const [origins, setOrigins] = React.useState([])

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
  //NOTE: UNCOMMENT TO SEE THE LISTING
  const results = [
    // {
    //   id: "address of the ride",
    //   title: "name of the driver or eth address",
    //   origin: "This is origin adress",
    //   date: "2007-01-01",
    //   destination: "This is destination adress",
    //   seats: 1,
    //   price: 10
    // },
    // {
    //   id: "address of the ride",
    //   title: "name of the driver or eth address",
    //   origin: "This is origin adress",
    //   date: "2007-01-01",
    //   destination: "This is destination adress",
    //   seats: 1,
    //   price: 10
    // },
    // {
    //   id: "address of the ride",
    //   title: "name of the driver or eth address",
    //   origin: "This is origin adress",
    //   date: "2007-01-01",
    //   destination: "This is destination adress",
    //   seats: 1,
    //   price: 10
    // },
  ]

  const handleBooking = async () => {
    //TODO: We need to call to the Superfluid service
  }

  return (
    <Fragment>
      <Grid container spacing={2} style={{ background: '#f4f4f4', padding: 20 }}>
        <Grid item xs={12}>
          <div style={{ height: 400, borderRadius: 4, overflow: 'hidden', background: `url(${img}) center center` }} />
        </Grid>
        <Grid item xs={12}>
          <Search
            handleChangeOrigin={useDebounce(handleChangeOrigin, 1000)}
            origins={origins}
            handleChangeDestination={useDebounce(handleChangeDestination, 1000)}
            destinations={destinations}
          />
        </Grid>
        <Grid item xs={12}>
          {results.map((ride) =>
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
