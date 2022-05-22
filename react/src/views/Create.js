import React, { Fragment } from "react";
import { Grid } from '@material-ui/core';
// import { useAuth0 } from "@auth0/auth0-react";

const Create = () => {
  // const {
  //   user,
  //   isAuthenticated,
  //   loginWithRedirect,
  //   logout,
  // } = useAuth0();

  return (
    <Fragment>
      <Grid container spacing={2}>
        Create
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

export default Create;
