// admin/components/sections/Employees.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import EmployeeDialog from '../dialogs/EmployeeDialog';
import AddEmployeeDialog from '../dialogs/AddEmployeeDialog';
import { Employee } from '../dashboard';

interface EmployeesProps {
  employees: Employee[];
  onAddEmployee: (employee: any) => Promise<boolean>;
  onUpdateEmployee: (employee: any) => Promise<boolean>;
  onDeleteEmployee: (id: number) => Promise<boolean>;
}

// Define possible roles
const AVAILABLE_ROLES = [
  'BARTENDER',
  'BAR_MANAGER',
  'HEAD_CHEF',
  'SERVER'
];

const Employees: React.FC<EmployeesProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [addEmployeeDialog, setAddEmployeeDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeEditMode, setEmployeeEditMode] = useState(false);
  
  // Filter menu state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenEmployeeDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeDialog(true);
    setEmployeeEditMode(false);
  };

  const handleCloseEmployeeDialog = () => {
    setEmployeeDialog(false);
  };
  
  // Filter menu handlers
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  const handleToggleRoleFilter = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

  const handleClearFilters = () => {
    setSelectedRoles([]);
  };
  
  const isFilterMenuOpen = Boolean(filterAnchorEl);
  const filterMenuId = isFilterMenuOpen ? 'employee-filter-popover' : undefined;
  
  // Format role display (convert BAR_MANAGER to Bar Manager)
  const formatRole = (role: string) => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Filter employees based on search query, selected roles, and exclude admin/owner roles
  const filteredEmployees = employees.filter(employee => {
    // Exclude admin and owner roles
    if (employee.role.toLowerCase() === 'admin' || employee.role.toLowerCase() === 'owner') {
      return false;
    }
    
    // Apply role filter if any are selected
    if (selectedRoles.length > 0 && !selectedRoles.includes(employee.role)) {
      return false;
    }
    
    // Apply search query filter
    return (
      (employee.first_name + ' ' + employee.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get employee full name
  const getEmployeeName = (employee: Employee) => {
    if (employee.first_name && employee.last_name) {
      return `${employee.first_name} ${employee.last_name}`;
    } else if (employee.first_name) {
      return employee.first_name;
    } else if (employee.username) {
      return employee.username;
    } else {
      return 'Unnamed Employee';
    }
  };

  // Get first letter for avatar
  const getAvatarInitial = (employee: Employee) => {
    if (employee.first_name) {
      return employee.first_name.charAt(0);
    } else if (employee.username) {
      return employee.username.charAt(0);
    } else {
      return 'E';
    }
  };

  // Get available roles from employee data
  const getAvailableRoles = () => {
    const roles = employees
      .filter(emp => emp.role.toLowerCase() !== 'admin' && emp.role.toLowerCase() !== 'owner')
      .map(emp => emp.role);
    
    return Array.from(new Set(roles)).sort();
  };

  if (!employees || employees.length === 0) {
    return (
      <motion.div
        key="employees-loading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper className="content-paper">
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        </Paper>
      </motion.div>
    );
  }

  // Filter out admin and owner from the count
  const nonAdminEmployees = employees.filter(
    e => e.role.toLowerCase() !== 'admin' && e.role.toLowerCase() !== 'owner'
  );

  // Get unique roles from data or use predefined roles
  const availableRoles = getAvailableRoles().length > 0 ? 
    getAvailableRoles() : 
    AVAILABLE_ROLES;

  return (
    <motion.div
      key="employees"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="content-paper">
        <Box className="content-header">
          <Typography variant="h5" className="content-title">Employee Management</Typography>
          <Box className="content-actions">
            <TextField
              size="small"
              placeholder="Search employees"
              value={searchQuery}
              onChange={handleSearch}
              className="search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton 
              size="small" 
              className="filter-btn"
              onClick={handleOpenFilterMenu}
              aria-describedby={filterMenuId}
            >
              <Badge 
                color="primary" 
                variant="dot" 
                invisible={selectedRoles.length === 0}
              >
                <TuneIcon />
              </Badge>
            </IconButton>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              className="add-btn"
              onClick={() => setAddEmployeeDialog(true)}
            >
              Add Employee
            </Button>

            {/* Role Filter Popover */}
            <Popover
              id={filterMenuId}
              open={isFilterMenuOpen}
              anchorEl={filterAnchorEl}
              onClose={handleCloseFilterMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  width: 250,
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Box sx={{ p: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1
                }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1 }}>
                    Filter by Role
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    onClick={handleClearFilters}
                    disabled={selectedRoles.length === 0}
                    sx={{ 
                      color: '#e67e22', 
                      '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.26)' } 
                    }}
                  >
                    Clear
                  </Button>
                </Box>
                <Divider />
                <List sx={{ width: '100%', pt: 0 }}>
                  {availableRoles.map((role) => (
                    <ListItem 
                      key={role} 
                      dense 
                      button 
                      onClick={() => handleToggleRoleFilter(role)}
                    >
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Checkbox
                          edge="start"
                          checked={selectedRoles.includes(role)}
                          disableRipple
                          sx={{
                            color: '#e67e22',
                            '&.Mui-checked': {
                              color: '#e67e22',
                            },
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={formatRole(role)} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Popover>
          </Box>
        </Box>

        {/* Employee Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Total Employees</Typography>
                <WorkIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">{nonAdminEmployees.length}</Typography>
              <Typography variant="body2" className="stats-trend positive">
                Staff management
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Active Employees</Typography>
                <CheckCircleIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">
                {nonAdminEmployees.filter(e => e.is_active).length}
              </Typography>
              <Typography variant="body2" className="stats-trend">
                {nonAdminEmployees.length > 0 
                  ? Math.round((nonAdminEmployees.filter(e => e.is_active).length / nonAdminEmployees.length) * 100)
                  : 0}% of total
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className="stats-card">
              <Box className="stats-header">
                <Typography className="stats-title">Positions</Typography>
                <SportsBarIcon className="stats-icon" />
              </Box>
              <Typography variant="h4" className="stats-value">
                {new Set(nonAdminEmployees.map(e => e.role)).size}
              </Typography>
              <Typography variant="body2" className="stats-trend">
                Different roles
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Show active filters if any */}
        {selectedRoles.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ 
              color: '#ffffff', // Changed from 'text.secondary' to white
              mr: 1, 
              display: 'flex', 
              alignItems: 'center',
              opacity: 0.8 // Adding slight transparency for better visual hierarchy
            }}>
              <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} /> Active filters:
            </Typography>
            {selectedRoles.map(role => (
              <Chip
                key={role}
                label={formatRole(role)}
                size="small"
                onDelete={() => handleToggleRoleFilter(role)}
                sx={{ 
                  bgcolor: 'rgba(230, 126, 34, 0.1)', 
                  color: '#e67e22', 
                  borderColor: 'rgba(230, 126, 34, 0.3)',
                  '& .MuiChip-deleteIcon': {
                    color: '#e67e22',
                    '&:hover': { color: '#d35400' }
                  }
                }}
              />
            ))}
          </Box>
        )}

        <TableContainer className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Hire Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.user_id} className="table-row">
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: '#d38236' }}>
                        {getAvatarInitial(employee)}
                      </Avatar>
                      {getEmployeeName(employee)}
                    </Box>
                  </TableCell>
                  <TableCell>{formatRole(employee.role)}</TableCell>
                  <TableCell>{employee.phone_number}</TableCell>
                  <TableCell>{employee.hire_date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={employee.is_active ? 'active' : 'inactive'} 
                      size="small"
                      className={`status-chip ${employee.is_active ? 'confirmed' : 'cancelled'}`}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      className="action-btn view-btn"
                      onClick={() => handleOpenEmployeeDialog(employee)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EmployeeDialog
        open={employeeDialog}
        employee={selectedEmployee}
        editMode={employeeEditMode}
        onClose={handleCloseEmployeeDialog}
        onUpdate={onUpdateEmployee}
        setEditMode={setEmployeeEditMode}
      />

      <AddEmployeeDialog
        open={addEmployeeDialog}
        onClose={() => setAddEmployeeDialog(false)}
        onAdd={onAddEmployee}
      />
    </motion.div>
  );
};

export default Employees;