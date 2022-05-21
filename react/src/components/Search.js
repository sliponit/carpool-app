import React from 'react';
import { Paper, InputBase, Divider, Icon, IconButton, Button, Menu, MenuItem } from '@material-ui/core'
import moment from 'moment';

export default function Search({ handleChangeOrigin, origins, handleChangeDestination, destinations }) {
    const now = new Date();
    const [date, setDate] = React.useState(moment(now).add(1, 'days').format('YYYY-MM-DDTHH:mm'));
    const [origin, setOrigin] = React.useState(''); //NOTE: this is the string on the input
    const [selectedOrigin, setSelectedOrigin] = React.useState(''); //NOTE: This is the full object from GEO API
    const [destination, setDestination] = React.useState('');
    const [selectedDestination, setSelectedDestination] = React.useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleSubmit = () => {
        //TODO: call to the backend
        console.log(selectedOrigin, selectedDestination, date);
    }

    return (
        <Paper component="form"
            style={{
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 'auto',
            }}
        >
            <IconButton
                aria-label="menu"
            >
                <Icon>directions_car</Icon>
            </IconButton>
            <InputBase
                style={{
                    height: 28,
                    marginLeft: 6,
                    flex: 1,
                }}
                placeholder="Origin"
                inputProps={{ 'aria-label': 'origin' }}
                value={origin}
                onKeyDown={(e) => { handleChangeOrigin(e.target.value); }}
                onChange={(e) => {
                    setOrigin(e.target.value);
                    setAnchorEl(e.currentTarget);
                    handleChangeOrigin(e.target.value);
                }}
            />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open && Boolean(origins.length)}
                onClose={() => {
                    setAnchorEl(null);
                    handleChangeOrigin('');
                }}
            >
                {origins.map((origin) =>
                    <MenuItem
                        key={origin.properties.label}
                        onClick={() => {
                            setOrigin(origin.properties.label);
                            setSelectedOrigin(origin)
                            setAnchorEl(null);
                            handleChangeOrigin('');
                        }
                        }
                    >
                        {origin.properties.label}
                    </MenuItem>
                )}
            </Menu>
            <Divider
                style={{
                    height: 28,
                    margin: 1,
                }}
                orientation="vertical"
            />
            <InputBase
                style={{
                    marginLeft: 6,
                    flex: 1,
                }}
                placeholder="Destination"
                inputProps={{ 'aria-label': 'destination' }}
                value={destination}
                onChange={(e) => {
                    setDestination(e.target.value);
                    setAnchorEl(e.currentTarget);
                    handleChangeDestination(e.target.value);
                }}
            />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open && Boolean(destinations.length)}
                onClose={() => {
                    setAnchorEl(null);
                    handleChangeDestination('');
                }}
            >
                {destinations.map((destination) =>
                    <MenuItem
                        key={destination.properties.label}
                        onClick={() => {
                            setDestination(destination.properties.label);
                            setSelectedDestination(destination);
                            setAnchorEl(null);
                            handleChangeDestination('');
                        }}
                    >
                        {destination.properties.label}
                    </MenuItem>
                )}
            </Menu>
            <Divider style={{
                height: 28,
                margin: 1,
            }} orientation="vertical" />
            <InputBase
                style={{
                    marginLeft: 6,
                    flex: 1,
                }}
                // inputProps={{ 'aria-label': 'date' }}
                inputProps={{
                    min: moment(now).add(1, 'days').format('YYYY-MM-DDTHH:mm'),
                    max: moment(now).add(2, 'weeks').format('YYYY-MM-DDTHH:mm')
                }}
                defaultValue={date || moment(now).add(1, 'days').format('YYYY-MM-DDTHH:mm')}
                name="bookingTime"
                type="datetime-local"
                onChange={e => setDate(e.target.value)}
            />
            <Divider style={{
                height: 28,
                margin: 1,
            }} orientation="vertical" />
            <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: 'coral', fontWeight: 'bold', color: 'white' }}>
                Search
            </Button>
        </Paper >
    );
}
