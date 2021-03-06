import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from "@auth0/auth0-react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment'

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
                    {ride.driver}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Date: </b>{moment(ride.time).format('YYYY-MM-DD HH:mm')}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Origin: </b>{ride.origin_address}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <b>Destination: </b>{ride.destination_address}
                </Typography>
                {!onSubmit ? (
                    <Typography variant="body2" color="textSecondary" component="p">
                        <b>Price: </b>{ride.price}€
                    </Typography>
                ) : (
                    <div />
                )}
            </CardContent>
            {onSubmit ?
                (
                    <CardActions style={{ float: 'right' }}>
                        {isAuthenticated ? (
                            <Button size="small" variant={'contained'} color="primary" onClick={onSubmit}>
                                Book for {ride.price} MATIC
                            </Button>
                        ) : (
                            <Button size="small" variant={'contained'} color="primary" onClick={() => loginWithRedirect()}>
                                Login
                            </Button>
                        )}
                    </CardActions>
                ) : (
                    <div />
                )
            }
        </Card>
    );
}
