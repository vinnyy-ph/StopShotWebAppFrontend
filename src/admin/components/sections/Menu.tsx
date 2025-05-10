import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MenuItemDialog from '../dialogs/MenuItemDialog';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

// MenuItem interface remains the same
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

// Initial categories, will be updated from API
const initialCategories = ['All Categories'];

interface MenuProps {
  onAddMenuItem: (menuItem: MenuItem) => Promise<boolean>;
  onUpdateMenuItem: (menuItem: MenuItem) => Promise<boolean>;
  onDeleteMenuItem: (id: number) => Promise<boolean>;
}

const Menu: React.FC<MenuProps> = ({ onAddMenuItem, onUpdateMenuItem, onDeleteMenuItem }) => {
  const { authToken } = useAuth();
  const API_BASE_URL = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Token ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Extract unique categories from menu items
  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
      setCategories(['All Categories', ...uniqueCategories]);
    }
  }, [menuItems]);

  // Filter menu items when search term or tab changes
  useEffect(() => {
    filterMenuItems();
  }, [searchTerm, tabValue, menuItems]);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/menus/list');
      setMenuItems(response.data);
      setFilteredItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items. Please try again.');
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = [...menuItems];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by tab selection
    if (tabValue > 0) {
      // Tab 1: All Categories (no filter)
      // Tab 2: Available Items
      if (tabValue === 1) {
        filtered = filtered.filter(item => item.is_available);
      }
      // Tab 3: Unavailable Items
      else if (tabValue === 2) {
        filtered = filtered.filter(item => !item.is_available);
      }
      // Tab 4+: Filter by category (if available)
      else if (categories.length > 0 && tabValue < categories.length + 2) {
        const categoryFilter = categories[tabValue - 2];
        filtered = filtered.filter(item => item.category === categoryFilter);
      }
    }
    
    setFilteredItems(filtered);
    setPage(0); // Reset to first page when filters change
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenAddDialog = () => {
    setSelectedMenuItem(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMenuItem(null);
  };

  const handleDeleteMenuItem = async (id: number) => {
    const success = await onDeleteMenuItem(id);
    if (success) {
      setMenuItems(menuItems.filter(item => item.menu_id !== id));
    }
  };

  const handleSaveMenuItem = async (menuItem: MenuItem) => {
    let success = false;
    
    if (selectedMenuItem) {
      // Update
      success = await onUpdateMenuItem(menuItem);
      if (success) {
        setMenuItems(menuItems.map(item => 
          item.menu_id === menuItem.menu_id ? menuItem : item
        ));
      }
    } else {
      // Add
      success = await onAddMenuItem(menuItem);
      if (success) {
        fetchMenuItems(); // Refresh to get the server-generated ID
      }
    }
    
    if (success) {
      handleCloseDialog();
    }
    
    return success;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="content-paper">
        <Box className="content-header">
          <Typography variant="h5" className="content-title">
            Manage Menu Items
          </Typography>
          
          <Box className="content-actions">
            <TextField
              placeholder="Search menu items..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={handleOpenAddDialog}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="content-tabs"
        >
          <Tab label="All Items" />
          <Tab label="Available" />
          <Tab label="Unavailable" />
          {categories.slice(1).map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>

        {error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <TableContainer className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.menu_id} className="table-row">
                      <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                      <TableCell>
                        {item.description.length > 50
                          ? `${item.description.substring(0, 50)}...`
                          : item.description}
                      </TableCell>
                      <TableCell>${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.category} 
                          size="small"
                          className="category-chip"
                          sx={{ 
                            backgroundColor: '#2e4a66', 
                            color: '#ffffff',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.is_available ? "Available" : "Unavailable"} 
                          size="small"
                          className={`status-chip ${item.is_available ? 'confirmed' : 'cancelled'}`}
                        />
                      </TableCell>
                      <TableCell align="right" className="action-cell">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenEditDialog(item)}
                          className="action-btn edit-btn"
                        >
                          <EditIcon fontSize="small" sx={{ color: '#8eccff' }} />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => handleDeleteMenuItem(item.menu_id)}
                          className="action-btn delete-btn"
                        >
                          <DeleteIcon fontSize="small" sx={{ color: '#ff7043' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="empty-state">
                      No menu items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="table-pagination"
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          sx={{
            color: '#e0e0e0',
            '.MuiTablePagination-selectIcon': { color: '#e0e0e0' },
            '.MuiTablePagination-actions': { color: '#e0e0e0' },
            '& .MuiIconButton-root': {
              color: '#8eccff',
              '&.Mui-disabled': {
                color: '#555555'
              }
            }
          }}
        />
      </Paper>

      <MenuItemDialog 
        open={openDialog}
        menuItem={selectedMenuItem}
        onClose={handleCloseDialog}
        onSave={handleSaveMenuItem}
        availableCategories={menuItems.map(item => item.category)}
      />
    </motion.div>
  );
};

export default Menu;