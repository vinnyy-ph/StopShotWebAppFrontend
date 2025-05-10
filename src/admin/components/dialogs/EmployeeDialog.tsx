import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Typography,
  TextField,
  Avatar,
  Chip,
  MenuItem,
  Box,
  CircularProgress,
  Divider,
  Paper,
  useTheme,
  Zoom,
  alpha,
  Fade,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // For Last Login

import { Employee } from '../../components/dashboard';

// Orange accent color
const ACCENT_COLOR = '#d38236';

interface EmployeeDialogProps {
  open: boolean;
  employee: Employee | null;
  editMode: boolean;
  onClose: () => void;
  onUpdate: (employee: any) => Promise<boolean>;
  setEditMode: (mode: boolean) => void;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  open,
  employee,
  editMode,
  onClose,
  onUpdate,
  setEditMode
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editedEmployee, setEditedEmployee] = useState<any>(null);
  
  useEffect(() => {
    if (employee) {
      setEditedEmployee({...employee});
    }
  }, [employee, open]); // Reset editedEmployee when dialog opens or employee changes

  const handleUpdateEmployee = async () => {
    if (!editedEmployee) return;
    
    setLoading(true);
    setError('');
    try {
      const updateData = {
        user_id: editedEmployee.user_id,
        first_name: editedEmployee.first_name,
        last_name: editedEmployee.last_name,
        phone_number: editedEmployee.phone_number,
        hire_date: editedEmployee.hire_date,
        role: editedEmployee.role,
        is_active: typeof editedEmployee.is_active === 'string' 
          ? editedEmployee.is_active === 'true' 
          : Boolean(editedEmployee.is_active)
      };
      
      const success = await onUpdate(updateData);
      if (success) {
        setEditMode(false);
        // onClose(); // Consider if onClose should be called here or if parent handles it
      } else {
        setError('Failed to update employee. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while updating the employee.');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (emp: Employee | null) => {
    if (!emp) return 'Employee';
    if (emp.first_name && emp.last_name) {
      return `${emp.first_name} ${emp.last_name}`;
    } else if (emp.first_name) {
      return emp.first_name;
    } else if (emp.username) {
      return emp.username;
    } else {
      return 'Unnamed Employee';
    }
  };

  const getAvatarInitial = (emp: Employee | null) => {
    if (!emp) return 'E';
    if (emp.first_name) {
      return emp.first_name.charAt(0).toUpperCase();
    } else if (emp.username) {
      return emp.username.charAt(0).toUpperCase();
    } else {
      return 'E';
    }
  };

  const formatRole = (role: string) => {
    if (!role) return 'N/A';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const styles = {
    paper: {
      backgroundColor: '#1a1a1a',
      backgroundImage: `linear-gradient(145deg, #1e1e1e 0%, #121212 100%)`,
      color: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
    title: {
      borderLeft: `4px solid ${ACCENT_COLOR}`,
      paddingLeft: '16px',
      margin: '12px 0',
    },
    input: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        transition: 'all 0.2s',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          transition: 'all 0.2s',
        },
        '&:hover fieldset': {
          borderColor: alpha(ACCENT_COLOR, 0.5),
        },
        '&.Mui-focused fieldset': {
          borderColor: ACCENT_COLOR,
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-focused': {
          color: ACCENT_COLOR,
        },
      },
      '& .MuiInputBase-input': {
        color: '#ffffff',
      },
      '& .MuiSelect-icon': {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    divider: {
      borderColor: 'rgba(255, 255, 255, 0.07)'
    },
    primaryButton: {
      background: `linear-gradient(45deg, ${ACCENT_COLOR} 30%, ${alpha(ACCENT_COLOR, 0.8)} 90%)`,
      color: 'white',
      fontWeight: 600,
      padding: '8px 24px',
      borderRadius: '8px',
      boxShadow: `0 4px 12px ${alpha(ACCENT_COLOR, 0.3)}`,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: `0 6px 16px ${alpha(ACCENT_COLOR, 0.5)}`,
        transform: 'translateY(-1px)',
      },
    },
    menuItem: {
      color: '#ffffff',
      '&:hover': {
        backgroundColor: alpha(ACCENT_COLOR, 0.1)
      },
      '&.Mui-selected': {
        backgroundColor: alpha(ACCENT_COLOR, 0.2),
        '&:hover': {
          backgroundColor: alpha(ACCENT_COLOR, 0.3)
        }
      }
    },
    detailItem: {
      mb: 1.5,
      p: 1.5,
      borderRadius: '8px',
      background: alpha('#000', 0.15),
      border: `1px solid ${alpha('#fff', 0.05)}`,
    },
    detailLabel: {
      color: alpha('#fff', 0.6),
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      mb: 0.5,
      '& svg': {
        fontSize: '1rem',
        color: ACCENT_COLOR,
      }
    },
    detailValue: {
      fontWeight: 500,
      color: '#ffffff',
    }
  };

  if (!employee || !editedEmployee) return null;

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Zoom}
      transitionDuration={300}
      PaperProps={{
        elevation: 8,
        sx: styles.paper
      }}
    >
      <DialogTitle sx={{ pt: 2.5, pb: 1.5, color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={styles.title}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: ACCENT_COLOR }} /> {editMode ? "Edit Employee" : "Employee Details"}
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mt: 0.5 }}>
            {getEmployeeName(employee)}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          disabled={loading}
          sx={{ 
            color: alpha('#fff', 0.7),
            '&:hover': { color: '#fff', bgcolor: alpha('#fff', 0.1) }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={styles.divider} />
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {error && (
          <Fade in={Boolean(error)}>
            <Paper sx={{ 
              p: 1.5, 
              mb: 2, 
              bgcolor: alpha(theme.palette.error.main, 0.15),
              borderRadius: '8px',
              borderLeft: `4px solid ${theme.palette.error.main}`
            }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          </Fade>
        )}
        {editMode ? (
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={editedEmployee.first_name || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, first_name: e.target.value})}
                sx={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: editedEmployee.first_name ? ACCENT_COLOR : 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={editedEmployee.last_name || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, last_name: e.target.value})}
                sx={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: editedEmployee.last_name ? ACCENT_COLOR : 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={editedEmployee.phone_number || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, phone_number: e.target.value})}
                sx={styles.input}
                placeholder="e.g. 09XXXXXXXXX"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: editedEmployee.phone_number ? ACCENT_COLOR : 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hire Date"
                type="date"
                fullWidth
                value={editedEmployee.hire_date || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, hire_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: ACCENT_COLOR }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role"
                select
                fullWidth
                value={editedEmployee.role || ""}
                onChange={(e) => setEditedEmployee({...editedEmployee, role: e.target.value})}
                sx={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon sx={{ color: ACCENT_COLOR }} />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: { 
                        bgcolor: '#1e1e1e',
                        backgroundImage: 'linear-gradient(145deg, #222222 0%, #1a1a1a 100%)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                      }
                    }
                  }
                }}
              >
                <MenuItem value="ADMIN" sx={styles.menuItem}>Admin</MenuItem>
                <MenuItem value="OWNER" sx={styles.menuItem}>Owner</MenuItem>
                <MenuItem value="BAR_MANAGER" sx={styles.menuItem}>Bar Manager</MenuItem>
                <MenuItem value="HEAD_CHEF" sx={styles.menuItem}>Head Chef</MenuItem>
                <MenuItem value="BARTENDER" sx={styles.menuItem}>Bartender</MenuItem>
                <MenuItem value="SERVER" sx={styles.menuItem}>Server</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Status"
                select
                fullWidth
                value={String(editedEmployee.is_active)}
                onChange={(e) => setEditedEmployee({
                  ...editedEmployee, 
                  is_active: e.target.value === 'true'
                })}
                sx={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {editedEmployee.is_active ? <ToggleOnIcon sx={{ color: ACCENT_COLOR }} /> : <ToggleOffIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />}
                    </InputAdornment>
                  ),
                }}
                 SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: { 
                        bgcolor: '#1e1e1e',
                        backgroundImage: 'linear-gradient(145deg, #222222 0%, #1a1a1a 100%)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                      }
                    }
                  }
                }}
              >
                <MenuItem value="true" sx={styles.menuItem}>Active</MenuItem>
                <MenuItem value="false" sx={styles.menuItem}>Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={0}> {/* Reduced spacing for view mode */}
            <Grid item xs={12} display="flex" alignItems="center" mb={3} 
              sx={{ 
                p:2, 
                background: alpha('#000', 0.2), 
                borderRadius: '12px',
                border: `1px solid ${alpha('#fff', 0.08)}`
              }}
            >
              <Avatar 
                sx={{ 
                  width: 72, 
                  height: 72, 
                  mr: 2.5, 
                  bgcolor: ACCENT_COLOR, 
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  boxShadow: `0 0 15px ${alpha(ACCENT_COLOR, 0.5)}`
                }}
              >
                {getAvatarInitial(employee)}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>{getEmployeeName(employee)}</Typography>
                <Chip 
                  label={employee.is_active ? 'Active' : 'Inactive'} 
                  size="small"
                  icon={employee.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                  sx={{
                    mt: 0.5,
                    bgcolor: employee.is_active ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                    color: employee.is_active ? theme.palette.success.light : theme.palette.error.light,
                    border: `1px solid ${employee.is_active ? alpha(theme.palette.success.main, 0.5) : alpha(theme.palette.error.main, 0.5)}`,
                    '& .MuiChip-icon': { color: 'inherit' }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} pr={{ sm: 1 }}>
              <Box sx={styles.detailItem}>
                <Typography sx={styles.detailLabel}><WorkIcon />Role</Typography>
                <Typography sx={styles.detailValue}>{formatRole(employee.role)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} pl={{ sm: 1 }}>
              <Box sx={styles.detailItem}>
                <Typography sx={styles.detailLabel}><PhoneIcon />Phone</Typography>
                <Typography sx={styles.detailValue}>{employee.phone_number || 'Not set'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} pr={{ sm: 1 }}>
              <Box sx={styles.detailItem}>
                <Typography sx={styles.detailLabel}><CalendarTodayIcon />Hire Date</Typography>
                <Typography sx={styles.detailValue}>{employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'Not set'}</Typography>
              </Box>
            </Grid>
            {employee.last_login_date && (
              <Grid item xs={12} sm={6} pl={{ sm: 1 }}>
                <Box sx={styles.detailItem}>
                  <Typography sx={styles.detailLabel}><VpnKeyIcon />Last Login</Typography>
                  <Typography sx={styles.detailValue}>
                    {new Date(employee.last_login_date).toLocaleDateString()} 
                    {employee.last_login_time && ` at ${employee.last_login_time}`}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      <Divider sx={styles.divider} />
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          color="inherit"
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{ 
            color: '#ffffff', 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          Cancel
        </Button>
        {editMode ? (
          <Button 
            variant="contained"
            onClick={handleUpdateEmployee}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={styles.primaryButton}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        ) : (
          <Button 
            variant="contained"
            onClick={() => setEditMode(true)}
            startIcon={<EditIcon />}
            sx={styles.primaryButton}
          >
            Edit Employee
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDialog;