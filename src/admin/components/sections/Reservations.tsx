// admin/components/sections/Reservations.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination, // Add this import
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Reservation, getStatusDisplay } from '../dashboard';
import ReservationDialog from '../dialogs/ReservationDialog';
import ReservationFormDialog from '../dialogs/ReservationFormDialog';
import AddReservationDialog from '../dialogs/AddReservationDialog';

// Helper function to format time in 12-hour format
const formatTime12Hour = (timeString: string) => {
  if (!timeString) return '';
  
  try {
    // Handle HH:MM:SS format
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hourNum = parseInt(hours, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 || 12;
      return `${hour12}:${minutes.substring(0, 2)} ${ampm}`;
    }
    return timeString;
  } catch (e) {
    return timeString;
  }
};

// Define the Room interface based on the backend model
interface Room {
  id: number;
  room_name: string;
  room_description?: string;
  room_can_be_booked: boolean;
  max_number_of_people: number;
  room_type: string;
}

// Create axios instance with authorization header
const axiosInstance = axios.create({
  baseURL: 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

interface ReservationsProps {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  onAddReservation: (newReservation: any) => Promise<boolean>;
  onUpdateReservation: (reservation: any) => Promise<boolean>;
  onDeleteReservation: (id: number) => Promise<boolean>;
  onStatusChange: (id: number, status: string) => Promise<void>;
}

const Reservations: React.FC<ReservationsProps> = ({
  reservations,
  loading,
  error,
  onAddReservation,
  onUpdateReservation,
  onDeleteReservation,
  onStatusChange
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [reservationDialog, setReservationDialog] = useState(false);
  const [addReservationDialog, setAddReservationDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add pagination state variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingReservation, setConfirmingReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get('/rooms/');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    
    fetchRooms();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenReservationDialog = (reservation: any) => {
    setSelectedReservation(reservation);
    setReservationDialog(true);
    setEditMode(false);
  };

  const handleCloseReservationDialog = () => {
    setReservationDialog(false);
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handleOpenAddDialog = () => {
    setSelectedReservation(null);
    setDialogMode('add');
    setFormDialogOpen(true);
  };

  // Update the handleOpenEditDialog function

const handleOpenEditDialog = () => {
  // Prevent editing if reservation is in a final state
  if (selectedReservation && (selectedReservation.status === 'CONFIRMED' || selectedReservation.status === 'CANCELLED')) {
    // Just show a view-only version
    setDialogMode('edit'); // Will still be read-only because of status
    setViewDialogOpen(false);
    setFormDialogOpen(true);
    return;
  }
  
  setDialogMode('edit');
  setViewDialogOpen(false);
  setFormDialogOpen(true);
};

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
  };

  const handleSaveReservation = async (reservationData: any) => {
    setIsSubmitting(true);
    try {
      console.log(`Attempting to ${dialogMode === 'add' ? 'create' : 'update'} reservation:`, reservationData);
      
      let success = false;
      if (dialogMode === 'add') {
        success = await handleAddReservation(reservationData);
      } else {
        success = await handleUpdateReservation(reservationData);
        
        // If this was part of a confirmation flow and update was successful
        if (success && confirmingReservation && reservationData.room_id) {
          // Now we can proceed with the status change to CONFIRMED
          await onStatusChange(confirmingReservation.id, 'CONFIRMED');
          setConfirmingReservation(null);
        }
      }
      
      console.log(`Reservation ${dialogMode} ${success ? 'successful' : 'failed'}`);
      setIsSubmitting(false);
      return success;
    } catch (error) {
      console.error(`Error ${dialogMode === 'add' ? 'creating' : 'updating'} reservation:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
      }
      setIsSubmitting(false);
      return false;
    }
  };

  const handleAddReservation = async (reservationData: any) => {
    try {
      // Remove id field for new reservations
      const { id, ...dataToSubmit } = reservationData;
      
      // Process room_id into proper format for API
      if (dataToSubmit.room_id) {
        dataToSubmit.room = dataToSubmit.room_id;
        delete dataToSubmit.room_id;
      }
      
      // Call the parent's onAddReservation and get the response
      const response = await onAddReservation(dataToSubmit);
      
      // The response could be the formatted data or just a boolean
      return response;
    } catch (error) {
      console.error('Error in handleAddReservation:', error);
      return false;
    }
  };

  const handleUpdateReservation = async (reservationData: any) => {
    try {
      // Ensure proper format for API
      const dataToSubmit = { ...reservationData };
      
      // If room_id is provided, make sure it's properly formatted for the API
      if (dataToSubmit.room_id) {
        // The backend expects room_id for updating rooms
        dataToSubmit.room_id = parseInt(dataToSubmit.room_id);
      }
      
      // Normalize room_type if needed
      if (dataToSubmit.room_type && dataToSubmit.room_type.includes(' ')) {
        dataToSubmit.room_type = dataToSubmit.room_type.toUpperCase().replace(/\s/g, '_');
      }
      
      const response = await onUpdateReservation(dataToSubmit);
      return response;
    } catch (error) {
      console.error('Error in handleUpdateReservation:', error);
      return false;
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    // If confirming a reservation, check if a room is assigned first
    if (newStatus === 'CONFIRMED') {
      const reservation = reservations.find(res => res.id === id);
      
      if (reservation && !reservation.room) {
        // No room assigned, open dialog for room assignment first
        setSelectedReservation(reservation);
        setConfirmingReservation(reservation);
        setDialogMode('edit');
        setFormDialogOpen(true);
        return; // Stop here until they assign a room
      }
    }
    
    // Proceed with status change if not confirming or if room is already assigned
    await onStatusChange(id, newStatus);
  };

  // Update the filtering logic to handle both tab selection and search query

// First apply status filtering based on the selected tab
const getFilteredReservationsByStatus = () => {
  switch (tabValue) {
    case 1: // Confirmed tab
      return reservations.filter(res => res.status === 'CONFIRMED');
    case 2: // Pending tab
      return reservations.filter(res => res.status === 'PENDING');
    case 3: // Cancelled tab
      return reservations.filter(res => res.status === 'CANCELLED');
    case 0: // All reservations tab
    default:
      return reservations;
  }
};

// Then apply search query filtering
const filteredReservations = getFilteredReservationsByStatus().filter(res => 
  (res.guest_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
  (res.guest_email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
  (res.reservation_date || '').includes(searchQuery) ||
  (res.room_type?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
  (res.room?.room_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
);

// Get current page of data
const currentPageReservations = filteredReservations.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

// Add pagination handlers
const handleChangePage = (event: unknown, newPage: number) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0); // Reset to first page when changing rows per page
};

  return (
    <motion.div
      key="reservations"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="content-paper">
        <Box className="content-header">
          <Typography variant="h5" className="content-title">
            Manage Reservations
          </Typography>
          
          <Box className="content-actions">
            <TextField
              placeholder="Search reservations..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              className="add-btn"
              onClick={() => setAddReservationDialog(true)}
            >
              Add New
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="content-tabs"
        >
          <Tab label="All Reservations" />
          <Tab label="Confirmed" />
          <Tab label="Pending" />
          <Tab label="Cancelled" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <>
            <TableContainer className="table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Guests</TableCell>
                    <TableCell>Reservation Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentPageReservations.map((row, index) => (
                    <TableRow key={row.id || `temp-${index}`} className="table-row">
                      <TableCell>{row.guest_name}</TableCell>
                      <TableCell>{row.guest_email}</TableCell>
                      <TableCell>{row.reservation_date}</TableCell>
                      <TableCell>{formatTime12Hour(row.reservation_time)}</TableCell>
                      <TableCell>{row.number_of_guests}</TableCell>
                      <TableCell>{row.room?.room_name || row.room_type || 'Unassigned'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status_display || row.status || 'PENDING'} 
                          className={`status-chip ${((row.status || 'PENDING')?.toLowerCase() || '')}`}
                        />
                      </TableCell>
                      <TableCell align="right" className="action-cell">
                        <IconButton size="small" onClick={() => handleViewReservation(row)}>
                          <VisibilityIcon fontSize="small" style={{ color: '#8eccff' }} />
                        </IconButton>
                        
                        {/* Only show confirm button if not already confirmed or cancelled */}
                        {row.status !== 'CONFIRMED' && row.status !== 'CANCELLED' && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleStatusChange(row.id, 'CONFIRMED')}
                            className="confirm-button"
                            title={!row.room ? "Room assignment required before confirmation" : "Confirm reservation"}
                          >
                            <CheckCircleIcon 
                              fontSize="small" 
                              style={{ 
                                color: !row.room ? '#ffaa00' : '#4caf50' 
                              }} 
                            />
                          </IconButton>
                        )}
                        
                        {/* Only show cancel button if not already cancelled or confirmed */}
                        {row.status !== 'CANCELLED' && row.status !== 'CONFIRMED' && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleStatusChange(row.id, 'CANCELLED')}
                            className="cancel-button"
                          >
                            <CancelIcon fontSize="small" style={{ color: '#f44336' }} />
                          </IconButton>
                        )}
                        
                        {/* Only show delete button for pending reservations */}
                        {row.status === 'PENDING' && (
                          <IconButton size="small" onClick={() => onDeleteReservation(row.id)}>
                            <DeleteIcon fontSize="small" style={{ color: '#ff7043' }} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Add TablePagination component */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredReservations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: '#fff', // Set base text color to white
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  margin: 0,
                  color: '#fff', // Set "Rows per page" and pagination info text to white
                },
                '.MuiTablePagination-toolbar': {
                  pl: 2,
                  pr: 2,
                },
                '.MuiTablePagination-select': {
                  color: '#fff', // Set dropdown text color to white
                },
                '.MuiTablePagination-selectIcon': {
                  color: '#fff', // Set dropdown icon color to white
                },
                '.MuiTablePagination-actions': {
                  color: '#fff', // Set pagination navigation button colors
                },
                '.MuiIconButton-root.Mui-disabled': {
                  color: 'rgba(255, 255, 255, 0.3)', // Set disabled pagination button to slightly transparent white
                },
                '.MuiTablePagination-menuItem': {
                  color: '#333', // Keep dropdown menu items dark (they have a light background)
                }
              }}
            />
          </>
        )}
      </Paper>
      
      {/* Reservation Dialog */}
      <ReservationDialog
        open={reservationDialog}
        reservation={selectedReservation}
        onClose={handleCloseReservationDialog}
        onEdit={() => setEditMode(true)}
      />

      {/* Add Reservation Dialog */}
      <AddReservationDialog
        open={addReservationDialog}
        onClose={() => setAddReservationDialog(false)}
        onAdd={onAddReservation}
      />

      {/* View reservation dialog */}
      <ReservationDialog
        open={viewDialogOpen}
        reservation={selectedReservation}
        onClose={handleCloseViewDialog}
        onEdit={() => {
          console.log("Edit button clicked for reservation:", selectedReservation?.id);
          handleOpenEditDialog();
        }}
      />
      
      {/* Add/Edit reservation dialog */}
      <ReservationFormDialog
        open={formDialogOpen}
        reservation={selectedReservation}
        onClose={handleCloseFormDialog}
        onSave={handleSaveReservation}
        rooms={rooms}
        isLoading={isSubmitting}
        mode={dialogMode}
      />
    </motion.div>
  );
};

export default Reservations;