// admin/components/dashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  CircularProgress, 
  Typography,
  Menu as MuiMenu,
  MenuItem,
  Toolbar,
  Drawer,
  Divider,
  Badge,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Layout components
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';

// Section components
import DashboardOverview from './sections/DashboardOverview';
import Reservations from './sections/Reservations';
import Feedback from './sections/Feedback';
import Employees from './sections/Employees';
import Analytics from './sections/Analytics';
import Settings from './sections/Settings';
import Menu from './sections/Menu';

// Import CSS
import '../styles/dashboard.css';

// Define API base URL
const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';

// Interface for reservation data structure
export interface Reservation {
  id: number;
  guest_name: string;
  guest_email: string;
  reservation_date: string;
  reservation_time: string;
  duration?: string;
  number_of_guests: number;
  room?: {
    id: number;
    room_name: string;
    room_description?: string;
    room_can_be_booked: boolean;
    max_number_of_people: number;
    room_type: string;
  };
  room_type?: string;
  special_requests?: string;
  status: string;
  status_display?: string;
  guest_phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Import the employee service and type
import { employeeService, Employee as EmployeeType } from '../../services/employeeService';

// Replace the Employee interface with the imported type
export type Employee = EmployeeType;

// Add types for menu items (add this near the other interface definitions)
export interface MenuItem {
  menu_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
}

// Mock data for components
export const mockReservationsData = [
  { id: 1, name: 'John Doe', date: '2025-04-28', time: '19:00', guests: 4, tableType: 'VIP Booth', status: 'confirmed' },
  { id: 2, name: 'Jane Smith', date: '2025-04-28', time: '20:00', guests: 2, tableType: 'Bar', status: 'confirmed' },
  { id: 3, name: 'Mike Johnson', date: '2025-04-29', time: '18:30', guests: 8, tableType: 'Large Table', status: 'pending' },
  { id: 4, name: 'Sarah Williams', date: '2025-04-30', time: '21:00', guests: 6, tableType: 'VIP Booth', status: 'confirmed' },
  { id: 5, name: 'Robert Brown', date: '2025-05-01', time: '19:30', guests: 3, tableType: 'Regular', status: 'cancelled' },
  { id: 6, name: 'Emily Davis', date: '2025-05-02', time: '20:15', guests: 5, tableType: 'Regular', status: 'confirmed' },
  { id: 7, name: 'Michael Wilson', date: '2025-05-02', time: '18:00', guests: 2, tableType: 'Bar', status: 'confirmed' },
  { id: 8, name: 'Jennifer Taylor', date: '2025-05-03', time: '19:45', guests: 4, tableType: 'VIP Booth', status: 'pending' },
  { id: 9, name: 'David Martinez', date: '2025-05-04', time: '17:30', guests: 10, tableType: 'Large Table', status: 'pending' },
  { id: 10, name: 'Lisa Anderson', date: '2025-05-05', time: '20:30', guests: 6, tableType: 'VIP Booth', status: 'confirmed' },
  { id: 11, name: 'Thomas Rodriguez', date: '2025-05-06', time: '18:45', guests: 4, tableType: 'Regular', status: 'confirmed' },
  { id: 12, name: 'Amanda Garcia', date: '2025-05-06', time: '21:15', guests: 3, tableType: 'Bar', status: 'cancelled' },
  { id: 13, name: 'Kevin Lee', date: '2025-05-07', time: '19:00', guests: 7, tableType: 'Large Table', status: 'confirmed' },
  { id: 14, name: 'Elizabeth Clark', date: '2025-05-08', time: '20:00', guests: 2, tableType: 'Regular', status: 'pending' },
  { id: 15, name: 'Steven Wright', date: '2025-05-09', time: '18:30', guests: 5, tableType: 'VIP Booth', status: 'confirmed' }
];

export const mockFeedbackData = [
  { id: 1, name: 'Michael J.', date: '2025-04-15', rating: 5, comment: 'Best place to watch NBA games! The atmosphere during playoffs is unbeatable.' },
  { id: 2, name: 'Sarah T.', date: '2025-04-20', rating: 4, comment: 'Love the food selection and craft beer options. My go-to spot on weekends!' },
  { id: 3, name: 'David R.', date: '2025-04-22', rating: 5, comment: 'The karaoke rooms are fantastic for private parties. Had an amazing birthday celebration here!' },
  { id: 4, name: 'Kimberly L.', date: '2025-04-25', rating: 5, comment: 'Excellent service and the best chicken wings in town. Always my first choice for game nights.' },
  { id: 5, name: 'Jason M.', date: '2025-04-26', rating: 4, comment: 'Great screens, great drinks, great vibe. What more could you ask for?' },
];

export const drawerWidth = 260;

// Helper function to get display text for statuses
export const getStatusDisplay = (status: string): string => {
  switch(status) {
    case 'PENDING': return 'Pending';
    case 'CONFIRMED': return 'Confirmed';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
  }
};

// Helper function to get display text for room types
export const getRoomTypeDisplay = (roomType: string): string => {
  switch(roomType) {
    case 'TABLE': return 'Table';
    case 'KARAOKE_ROOM': return 'Karaoke Room';
    default: return roomType;
  }
};

const AdminDashboard: React.FC = () => {
  const { authToken, logout } = useAuth();
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Token ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState(true);
  
  // CRUD State Management
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationLoading, setReservationLoading] = useState<boolean>(true);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState([...mockFeedbackData]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [_, setEmployeesLoading] = useState<boolean>(true);
  const [__, setEmployeesError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchReservations();
      fetchEmployees();
    }
  }, [authToken]);

  const fetchReservations = async () => {
    setReservationLoading(true);
    setReservationError(null);
    try {
      const response = await axiosInstance.get('/reservations/');
      console.log('Reservation data:', response.data);
      setReservations(response.data);
      setReservationLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservationError('Failed to load reservations. Please try again.');
      setReservationLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setEmployeesLoading(true); // Use the specific employees loading state
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployeesError('Failed to load employees. Please try again.');
    } finally {
      setEmployeesLoading(false); // Always set loading to false when done
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    setSelectedSection('settings');
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axiosInstance.patch(`/reservations/${id}/`, {
        status: newStatus
      });
      
      // Update local state
      const updatedReservations = reservations.map(res => 
        res.id === id ? {...res, status: newStatus, status_display: getStatusDisplay(newStatus)} : res
      );
      setReservations(updatedReservations);
      
      // Show notification
      alert(`Reservation status updated to ${getStatusDisplay(newStatus)}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update reservation status. Please try again.');
    }
  };

  // Handlers for Reservation CRUD
  const handleAddReservation = async (newReservationData: any) => {
    try {
      const response = await axiosInstance.post('/reservations/', newReservationData);
      
      // Log the response data to debug
      console.log('New reservation response:', response.data);
      
      // Format the received data before adding to state
      const formattedData = {
        ...response.data,
        id: response.data.id, // Ensure ID is properly set
        status_display: getStatusDisplay(response.data.status || 'PENDING'),
        room_type: getRoomTypeDisplay(response.data.room_type)
      };
      
      // Add to state
      setReservations([...reservations, formattedData]);
      
      // Return the formatted data so it can be used by the child components
      return formattedData;
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to create reservation. Please try again.');
      return false;
    }
  };

  const handleUpdateReservation = async (reservationData: any) => {
    try {
      const { id, ...updateData } = reservationData;
      await axiosInstance.patch(`/reservations/${id}/`, updateData);
      
      // Update local state
      const updatedReservations = reservations.map(res => 
        res.id === reservationData.id ? reservationData : res
      );
      setReservations(updatedReservations);
      return true;
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation. Please try again.');
      return false;
    }
  };

  const handleDeleteReservation = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await axiosInstance.delete(`/reservations/${id}/`);
        const updatedReservations = reservations.filter(res => res.id !== id);
        setReservations(updatedReservations);
        return true;
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Failed to delete reservation. Please try again.');
        return false;
      }
    }
    return false;
  };

  // Update the handleDeleteFeedback function
  const handleDeleteFeedback = async (id: number) => {
    try {
      // The actual delete functionality is now handled in the Feedback component
      // This is kept for backwards compatibility
      const updatedFeedback = feedback.filter(item => {
        // Handle both legacy mockData format and new API format
        const itemId = item.id || (item as any).feedback_id;
        return itemId !== id;
      });
      setFeedback(updatedFeedback);
      return true;
    } catch (error) {
      console.error('Error handling feedback deletion:', error);
      return false;
    }
  };

  // Handlers for Employees
  const handleAddEmployee = async (employeeData: any) => {
    try {
      await employeeService.createEmployee(employeeData);
      // Refresh the employee list
      await fetchEmployees();
      return true;
    } catch (error) {
      console.error('Error adding employee:', error);
      return false;
    }
  };

  const handleUpdateEmployee = async (employeeData: any) => {
    try {
      // For complete employee updates, use the new method instead
      await employeeService.updateEmployee(employeeData.user_id, employeeData);
      
      // Refresh the employee list to show updated data
      await fetchEmployees();
      return true;
    } catch (error) {
      console.error('Failed to update employee:', error);
      return false;
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const success = await employeeService.deleteEmployee(id);
        if (success) {
          // Update local state after successful deletion
          const updatedEmployees = employees.filter(emp => emp.user_id !== id);
          setEmployees(updatedEmployees);
          return true;
        } else {
          alert('Failed to delete employee. Please try again.');
          return false;
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        return false;
      }
    }
    return false;
  };

  // In the AdminDashboard component, add these handlers
  const handleAddMenuItem = async (menuItemData: any) => {
    try {
      const response = await axiosInstance.post('/menus/create', menuItemData);
      console.log('Menu item created:', response.data);
      return true;
    } catch (error) {
      console.error('Error creating menu item:', error);
      alert('Failed to create menu item. Please try again.');
      return false;
    }
  };

  const handleUpdateMenuItem = async (menuItemData: any) => {
    try {
      const response = await axiosInstance.put(`/menus/${menuItemData.menu_id}/`, menuItemData);
      console.log('Menu item updated:', response.data);
      return true;
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Failed to update menu item. Please try again.');
      return false;
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axiosInstance.delete(`/menus/${id}/`);
        return true;
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item. Please try again.');
        return false;
      }
    }
    return false;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box className="loading-container">
          <CircularProgress className="loading-spinner" />
          <Typography variant="h6" className="loading-text">
            Loading Dashboard...
          </Typography>
        </Box>
      );
    }
    
    switch (selectedSection) {
      case 'dashboard':
        return <DashboardOverview 
                 reservations={reservations}
                 feedback={feedback}
                 employees={employees}
                 onSectionChange={handleSectionChange}
               />;
      case 'reservations':
        return <Reservations 
                 reservations={reservations}
                 loading={reservationLoading}
                 error={reservationError}
                 onAddReservation={handleAddReservation}
                 onUpdateReservation={handleUpdateReservation}
                 onDeleteReservation={handleDeleteReservation}
                 onStatusChange={handleStatusChange}
               />;
      case 'menu':
        return <Menu 
                 onAddMenuItem={handleAddMenuItem}
                 onUpdateMenuItem={handleUpdateMenuItem}
                 onDeleteMenuItem={handleDeleteMenuItem}
               />;
      case 'feedback':
        return <Feedback 
                 feedback={feedback} 
                 onDeleteFeedback={handleDeleteFeedback}
               />;
      case 'employees':
        return <Employees 
                 employees={employees}
                 onAddEmployee={handleAddEmployee}
                 onUpdateEmployee={handleUpdateEmployee}
                 onDeleteEmployee={handleDeleteEmployee}
               />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings 
                 darkMode={darkMode}
                 onDarkModeChange={setDarkMode}
               />;
      default:
        return <DashboardOverview 
                 reservations={reservations}
                 feedback={feedback}
                 employees={employees}
                 onSectionChange={handleSectionChange}
               />;
    }
  };

  return (
    <Box className={`admin-dashboard ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header 
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
        onProfileMenuOpen={handleProfileMenuOpen}
        onNotificationMenuOpen={handleNotificationMenuOpen}
      />
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        className="nav-drawer"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          className="mobile-drawer"
        >
          <Sidebar selectedSection={selectedSection} onSectionChange={handleSectionChange} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          className="desktop-drawer"
          open
        >
          <Sidebar selectedSection={selectedSection} onSectionChange={handleSectionChange} />
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
        className="main-content"
      >
        <Toolbar />
        <Box className="page-content">
          {renderContent()}
        </Box>
      </Box>

      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="profile-menu"
      >
        <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MuiMenu>

      <MuiMenu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleMenuClose}
        className="notification-menu"
      >
        <MenuItem onClick={handleMenuClose} className="notification-item">
          <Badge color="primary" variant="dot" className="notification-badge">
            <Typography variant="body2">New reservation from John Doe</Typography>
          </Badge>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="notification-item">
          <Badge color="primary" variant="dot" className="notification-badge">
            <Typography variant="body2">New feedback (5 stars)</Typography>
          </Badge>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="notification-item">
          <Typography variant="body2">Reservation cancelled</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} className="notification-action">
          <Typography variant="body2" align="center">View all notifications</Typography>
        </MenuItem>
      </MuiMenu>
    </Box>
  );
};

export default AdminDashboard;