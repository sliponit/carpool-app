import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from "@auth0/auth0-react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        marginBottom: 12
    },
});

export default function RideCard({ ride, onSubmit }) {
    const classes = useStyles();
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {ride.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Date:</b>{ride.date}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Origin:</b>{ride.origin}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Destination:</b>{ride.destination}
                </Typography>
            </CardContent>
            <CardActions style={{ float: 'right' }}>
                {isAuthenticated ? (
                    <Button size="small" variant={'contained'} color="primary" onClick={onSubmit}>
                        Book for {ride.price}€
                    </Button>
                ) : (
                    <Button size="small" variant={'contained'} color="primary" onClick={() => loginWithRedirect()}>
                        Login
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}
