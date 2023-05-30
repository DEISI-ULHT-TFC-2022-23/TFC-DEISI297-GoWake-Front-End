import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Grid, DialogContentText} from '@mui/material';
import axios from "axios";
import {endpoints, getEndpointCreateOfficial} from "../../../../api/Urls";
import DoneIcon from '@mui/icons-material/Done';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {countryCodeMatrix} from "../../athetes/ultils/Utils";

const CreateOfficial = ({ open, onClose}) => {
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));

    const [iwwfId, setIwwfId] = useState('');
    const [position, setPosition] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [qualification, setQualification] = useState('');
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [competitions, setCompetitions] = useState([]);
    const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const regions = [
        'Africa',
        'Asia',
        'Europe',
        'North America',
        'Oceania',
        'South America'
    ]
    const positions = [
        'Calculator',
        'Chief Judge',
        'Judge',
        'Boat Driver'
    ]
    countryCodeMatrix.sort();
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };
    const handleIwwfIdChange = (event) => {
        setIwwfId(event.target.value);
    };
    const handlePositionChange = (event) => {
        setPosition(event.target.value);
    };
    const handleQualificationChange = (event) => {
        setQualification(String(event.target.value));
    };
    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    };
    const handleRegionChange = (event) => {
        setRegion(event.target.value);
    };
    const handleCompetitionChange = (event) => {
        setSelectedCompetitionId(event.target.value);
    };
    const submitCreateOfficial = async () => {

        const data = {
            iwwfid: iwwfId.toUpperCase().trim(),
            position: position.trim(),
            first_name: firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
            last_name: lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
            qualification: qualification.toUpperCase().trim(),
            country: country.toUpperCase().trim(),
            region: region.trim(),
        };

        try {
            const response = await axios.post(getEndpointCreateOfficial("officialBy", selectedCompetitionId), data, {
                headers: {
                    Authorization: `Token ${usuarioSalvo.token}`,
                },
            });

            setSuccessDialogOpen(true);
            setTimeout(() => {
                cleanFieldsAndClose();
                cleanFields();
                onClose();
            }, 3000);

        } catch (error) {
            console.error(error.request.response);
            setErrorDialogOpen(true);
            setTimeout(() => {
                setErrorDialogOpen(false);
            }, 3000);
        }
    };
    const handleCreate = async () => {
        if (isFormEmpty()) {
            setErrorMessage('All fields above are required!');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
        } else {
            try {
                await submitCreateOfficial();
            } catch (error) {
                console.error('An error occurred while making the request.');
            }
        }
    };
    const cleanFields = () => {
        setIwwfId('');
        setPosition('');
        setFirstName('');
        setLastName('');
        setQualification('');
        setCountry('');
        setRegion('');
        setSelectedCompetitionId('');
    };
    const cleanFieldsAndClose = () => {
        cleanFields();
        setSuccessDialogOpen(false);
        setErrorDialogOpen(false);
    };
    const isFormEmpty = () => {
        if (
            firstName.trim() === '' ||
            lastName.trim() === '' ||
            iwwfId.trim() === '' ||
            position.trim() === '' ||
            qualification.trim() === '' ||
            country.trim() === '' ||
            region.trim() === '' ||
            selectedCompetitionId === ''
        ) {
            return true; // Form is empty
        }
        return false; // Form is not empty
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(endpoints.competitions, {
                    headers: {
                        Authorization: `Token ${usuarioSalvo.token}`,
                    },
                });
                setCompetitions(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvents();
        cleanFields();
    }, []);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Create Official</DialogTitle>
            <DialogContent>

                <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                    <DialogContent>
                        <DialogContentText sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ReportProblemIcon sx={{ color: 'red', fontSize: 48, marginBottom: '1%' }} />
                            Error: Failed to create official. Please try again.
                        </DialogContentText>
                    </DialogContent>
                </Dialog>

                <Grid container spacing={2} sx={{ marginTop: '0.0rem' }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            value={lastName}
                            onChange={handleLastNameChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Iwwf Id"
                            value={iwwfId}
                            onChange={handleIwwfIdChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Qualification"
                            value={qualification}
                            onChange={handleQualificationChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Country"
                            value={country}
                            onChange={handleCountryChange}
                            fullWidth
                        >
                            {countryCodeMatrix.map((code) => (
                                <MenuItem key={code.toUpperCase()} value={code}>
                                    <img src={`https://flagcdn.com/16x12/${code}.png`} alt={code}
                                         style={{ marginRight: '1rem' }} />
                                    {code.toUpperCase()}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Region"
                            value={region}
                            onChange={handleRegionChange}
                            fullWidth
                        >
                            {regions.map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Competition"
                            value={selectedCompetitionId}
                            onChange={handleCompetitionChange}
                            fullWidth
                        >
                            {competitions.map((competition) => (
                                <MenuItem key={competition.id} value={competition.id}>
                                    {competition.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Position"
                            value={position}
                            onChange={handlePositionChange}
                            fullWidth
                        >
                            {positions.map((p) => (
                                <MenuItem key={p} value={p}>
                                    {p}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <div align="right">
                            {errorMessage && (
                                <p id="error">{errorMessage}</p>
                            )}
                        </div>
                    </Grid>
                </Grid>
                <Dialog open={successDialogOpen} onClose={cleanFieldsAndClose}>
                    <DialogContent>
                        <DialogContentText sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <DoneIcon sx={{ color: 'green', fontSize: 48, marginBottom: '1%' }} />
                            Official created successfully!
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        cleanFieldsAndClose();
                        onClose();
                    }}
                    color="primary"
                >
                    Cancel
                </Button>
                <Button onClick={handleCreate} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateOfficial;