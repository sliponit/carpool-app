import React, { Fragment } from "react";
import { Grid } from '@material-ui/core';
import { CreateRide } from '../components/CreateRide';
// import { useAuth0 } from "@auth0/auth0-react";

const Create = () => {
  // const {
  //   user,
  //   isAuthenticated,
  //   loginWithRedirect,
  //   logout,
  // } = useAuth0();







  //TODO: Load my drives.

  //TODO: Refactor CreateRide to standarize

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
          <CreateRide />
        </Grid>
      </Grid>
    </Fragment>
  )
};

// {
//   "origin": "1,3",
//   "destination": "1,4",
//   "origin_address": "Paris",
//   "destination_address": "Lyon",
//   "price": "1.5",
//   "time": "2022-05-21T22:52:27.330Z"
// }


export default Create;
