import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from "../../../navs/Drawer";
import DrawerHeader from "../../../navs/DrawerHeader";
import {Container} from "@material-ui/core";
import {MDBContainer} from "mdb-react-ui-kit";
import {Spinner} from "react-bootstrap";
import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";
import {getCountryFlag, GetGenderFlags, handleMouseEnter, handleMouseLeave} from "../dashboard/utils/Utils";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {endpoints, getEndpointAthleteById, getEndpointDeleteAthleteById} from "../../../api/Urls";
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {IconButton} from '@mui/material';
import {Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from "@mui/material/Tooltip";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditAthlete from "./edit/EditAthlete";
import CreateAthlete from "./create/CreateAthlete";
import DoneIcon from "@mui/icons-material/Done";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const Athletes = (props) => {

    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [idAthlete, setIdAthlete] = useState('');
    const [idCompetition, setIdCompetition] = useState('');
    const [showSpinner, setShowSpinner] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dataCompetition, setDataCompetition] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [successDialogOpenDelete, setSuccessDialogOpenDeleteDelete] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const fetchAtletes = async () => {
        axios.get(endpoints.competitions, {
            headers: {
                'Authorization': `Token ${usuarioSalvo.token}`
            }
        }).then(response => {
            /*const uniqueAthletes = {};
            response.data.results.forEach((competition) => {
                competition.athletes.forEach((athlete) => {
                    if (!uniqueAthletes[athlete.fed_id]) {
                        uniqueAthletes[athlete.fed_id] = athlete;
                    }
                });
            });
            const uniqueAthletesArray = Object.values(uniqueAthletes);
            const sortedData = uniqueAthletesArray.sort((a, b) => a.first_name.localeCompare(b.first_name));
            setData(sortedData);*/
            setDataCompetition(response.data.results);
        }).catch(error => {
            console.error(error);
        });
    };

    useEffect(() => {
        fetchAtletes();

        const timer = setTimeout(() => {
            setShowSpinner(false);
        }, 3000); // Tempo limite de 3 segundos

        return () => clearTimeout(timer);
    }, []);
    const reload = () => {
        fetchAtletes();

        const timer = setTimeout(() => {
            setShowSpinner(false);
        }, 3000); // Tempo limite de 3 segundos

        return () => clearTimeout(timer);
    }
    const handleCloseSuccessDialogDelete = () => {
        setSuccessDialogOpenDeleteDelete(false);
    };
    const handleAthleteDelete = async (idComp, idAthl) => {

        try {
            const response = await axios.delete(getEndpointDeleteAthleteById("athleteBy", idComp, idAthl), {
                headers: {
                    'Authorization': `Token ${usuarioSalvo.token}`
                }
            });

            reload();
            setSuccessDialogOpenDeleteDelete(true);
            setTimeout(() => {
                setSuccessDialogOpenDeleteDelete(false);
            }, 3000);

        } catch (error) {
            console.error('An error occurred while fetching the athlete.');
            setErrorDialogOpen(true);
            setTimeout(() => {
                setErrorDialogOpen(false);
            }, 3000);
        }
    };
    const handleClickOpenDelete = (compId, athlId) => {
        //console.log(compId, athlID);
        setIdCompetition(compId);
        setIdAthlete(athlId);
        setOpen(true);
    };
    const handleDelete = (idComp, idAthl) => {
        handleAthleteDelete(idComp, idAthl)
        handleClose();
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        fetchAtletes();
        setOpenDialog(false);
    };
    const handleOpenEditDialog = (competitionId, athleteId) => {
        //  reload();
        //  console.log(competitionId, athleteId);
        setIdCompetition(competitionId);
        setIdAthlete(athleteId);
        setOpenEditDialog(true);
    };
    const handleCloseEditDialog = () => {
        reload();
        setOpenEditDialog(false);
    };

    const isMobile = useMediaQuery('(max-width: 600px)');

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="sdd">
            <Box sx={{display: "flex"}}>
                <Drawer/>
                <Container id="marginDrawerHeader">
                    <DrawerHeader/>
                    <MDBContainer className="p-1 my-2">
                        <Typography variant="h6" fontWeight="bold" className="my-3 pb-0" style={{
                            fontSize: '20px'
                        }}>Athletes</Typography>

                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Confirmation</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this athlete?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancelar</Button>
                                <Button onClick={() => handleDelete(idCompetition, idAthlete)} color="error">
                                    Excluir
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={successDialogOpenDelete} onClose={handleCloseSuccessDialogDelete}>
                            <DialogContent>
                                <DialogContentText
                                    sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <DoneIcon sx={{color: 'green', fontSize: 48, marginBottom: '1%'}}/>
                                    Athlete deleted successfully!
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                            <DialogContent>
                                <DialogContentText
                                    sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <ReportProblemIcon sx={{color: 'red', fontSize: 48, marginBottom: '1%'}}/>
                                    Error: Failed to delete the athlete. Please try again.
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>

                        <Typography id="margin2">
                            Here you can see all the athletes that are currently available. Click on the athlete to
                            see more details.
                        </Typography>

                        <TextField
                            label="Search by athlete name"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                            size="large"
                            sx={{ width: '100%', margin: '0 0 1rem' }}
                        />

                        {isMobile ? (
                            <Grid item xs={12} sm={12}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon/>}
                                    onClick={handleOpenDialog}
                                    style={{textTransform: 'none', color: 'success', marginBottom: '3vh'}}
                                    sx={{width: '100%', maxWidth: '100%'}}
                                >
                                    Create athlete
                                </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12} sm={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button variant="contained" startIcon={<AddIcon/>} onClick={handleOpenDialog}
                                        style={{textTransform: 'none', color: 'success', marginBottom: '1vh'}}>
                                    Create athlete
                                </Button>
                            </Grid>
                        )}

                        <CreateAthlete
                            open={openDialog}
                            onClose={handleCloseDialog}
                        />

                        <EditAthlete
                            open={openEditDialog}
                            onClose={handleCloseEditDialog}
                            idAth={idAthlete}
                            idComp={idCompetition}
                        />

                        {dataCompetition.length === 0 && showSpinner &&
                            (
                                <div align="left">
                                    <Spinner id="load" animation="border" variant="secondary" size="3rem"/>
                                    <p id="load2">Loading...</p>
                                </div>
                            )
                        }

                        {dataCompetition.length === 0 && !showSpinner && (
                            <div align="left">
                                <p id="error2">There are no athletes at the moment!</p>
                            </div>
                        )}

                        {dataCompetition.length !== 0 && (
                            <div>
                                <div>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell id="esconde">Fed id</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell id="esconde">Country</TableCell>
                                                    <TableCell id="esconde">Gender</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {dataCompetition.map((competition) => (
                                                    competition.athletes
                                                        .filter((athlete) =>
                                                            athlete.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            athlete.last_name.toLowerCase().includes(searchTerm.toLowerCase())
                                                        )
                                                        .map((athlete) => (
                                                            <TableRow style={{cursor: 'pointer'}} key={athlete.id}
                                                                      onMouseEnter={handleMouseEnter}
                                                                      onMouseLeave={handleMouseLeave}>
                                                                <TableCell id="esconde">{athlete.fed_id}</TableCell>
                                                                <TableCell>
                                                                    {athlete.first_name.charAt(0).toUpperCase() + athlete.first_name.slice(1).toLowerCase()}{" "}
                                                                    {athlete.last_name.charAt(0).toUpperCase() + athlete.last_name.slice(1).toLowerCase()}
                                                                </TableCell>
                                                                <TableCell id="esconde">
                                                                    <Tooltip title={athlete.country.toUpperCase()}>
                                                                        {getCountryFlag(athlete.country)}
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell id="esconde">
                                                                    {athlete.gender === "F" && (
                                                                        <Tooltip title="Feminine"
                                                                                 className="tooltip-gender">
                                                                            {GetGenderFlags(athlete.gender)}
                                                                        </Tooltip>
                                                                    )}
                                                                    {athlete.gender === "M" && (
                                                                        <Tooltip title="Masculine"
                                                                                 className="tooltip-gender">
                                                                            {GetGenderFlags(athlete.gender)}
                                                                        </Tooltip>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip title="Edit" className="tooltip-gender">
                                                                        <IconButton
                                                                            onClick={() => handleOpenEditDialog(competition.id, athlete.id)}>
                                                                            <EditIcon color="gray"
                                                                                      style={{cursor: 'pointer'}}/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Remove" className="tooltip-gender">
                                                                        <IconButton
                                                                            onClick={() => handleClickOpenDelete(competition.id, athlete.id)}>
                                                                            <DeleteIcon color="error"
                                                                                        style={{cursor: 'pointer'}}/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                ))}
                                                {dataCompetition.every((competition) => {
                                                    return competition.athletes.every((athlete) =>
                                                        athlete.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
                                                        athlete.last_name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1
                                                    );
                                                }) && (
                                                        <TableRow
                                                            onMouseEnter={handleMouseEnter}
                                                            onMouseLeave={handleMouseLeave}
                                                        >
                                                            <TableCell colSpan={5} id="error2" align="left">
                                                                Athlete not found!
                                                            </TableCell>
                                                        </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        )}
                    </MDBContainer>
                </Container>
            </Box>
        </div>
    );
};

export default Athletes;