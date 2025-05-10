import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Box,
  Typography,
  useTheme,
  Paper,
  Zoom,
  alpha,
  Fade
} from '@mui/material';
import { MenuItem as MenuItemType } from '../sections/Menu';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';

interface MenuItemDialogProps {
  open: boolean;
  menuItem: MenuItemType | null;
  onClose: () => void;
  onSave: (menuItem: MenuItemType) => Promise<boolean>;
  availableCategories?: string[];
}

const DEFAULT_CATEGORIES = [
  'APPETIZERS',
  'MAIN COURSE',
  'DESSERTS',
  'BEVERAGES',
  'ALCOHOL',
  'SIDES',
  'SPECIALS'
];

// Orange accent color
const ACCENT_COLOR = '#d38236';

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({ 
  open, 
  menuItem, 
  onClose, 
  onSave,
  availableCategories = [] 
}) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Combine default categories with any unique ones from the backend
  const categories = [...new Set([
    ...DEFAULT_CATEGORIES,
    ...availableCategories
  ])].sort();

  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name || '');
      setDescription(menuItem.description || '');
      setPrice(menuItem.price.toString() || '');
      setCategory(menuItem.category || '');
      setIsAvailable(menuItem.is_available);
      setImageUrl(menuItem.image_url || '');
    } else {
      // Reset form for new item
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setIsAvailable(true);
      setImageUrl('');
    }
    setErrors({});
    setImageLoaded(false);
  }, [menuItem, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    if (!price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (!category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    
    const menuItemData: MenuItemType = {
      menu_id: menuItem?.menu_id || 0, // 0 for new items, will be ignored by backend
      name,
      description,
      price: parseFloat(price),
      category,
      is_available: isAvailable,
      image_url: imageUrl
    };
    
    try {
      const success = await onSave(menuItemData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      setSaving(false);
    }
  };

  // Enhanced styling using the accent color
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
    },
    divider: {
      borderColor: 'rgba(255, 255, 255, 0.07)'
    },
    imagePreview: {
      background: '#0f0f0f',
      borderRadius: '12px',
      padding: '12px',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)',
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
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!saving ? onClose : undefined}
      fullWidth
      maxWidth="md"
      TransitionComponent={Zoom}
      transitionDuration={300}
      PaperProps={{
        elevation: 8,
        sx: styles.paper
      }}
    >
      <DialogTitle sx={{ pt: 2.5, pb: 1.5, color: '#ffffff' }}>
        <Box sx={styles.title}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
            {menuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mt: 0.5 }}>
            {menuItem ? 'Update the details of this menu item' : 'Create a new item for your menu'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <Divider sx={styles.divider} />
      
      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Item Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              disabled={saving}
              variant="outlined"
              sx={styles.input}
              InputLabelProps={{
                style: { color: errors.name ? theme.palette.error.main : 'rgba(255, 255, 255, 0.7)' }
              }}
              placeholder="e.g. Grilled Chicken Sandwich"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              error={!!errors.category} 
              disabled={saving}
              sx={styles.input}
            >
              <InputLabel style={{ 
                color: errors.category ? theme.palette.error.main : 'rgba(255, 255, 255, 0.7)' 
              }}>
                Category
              </InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                MenuProps={{
                  PaperProps: {
                    sx: { 
                      bgcolor: '#1e1e1e',
                      backgroundImage: 'linear-gradient(145deg, #222222 0%, #1a1a1a 100%)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: alpha(ACCENT_COLOR, 0.15)
                      },
                      '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: alpha(ACCENT_COLOR, 0.2)
                      }
                    }
                  }
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ color: '#ffffff' }}>{cat}</MenuItem>
                ))}
                <MenuItem value="OTHER" sx={{ color: '#ffffff' }}>OTHER</MenuItem>
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: '#ffffff' }}>$</InputAdornment>,
              }}
              error={!!errors.price}
              helperText={errors.price}
              disabled={saving}
              variant="outlined"
              sx={styles.input}
              InputLabelProps={{
                style: { color: errors.price ? theme.palette.error.main : 'rgba(255, 255, 255, 0.7)' }
              }}
              placeholder="0.00"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Image URL"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={saving}
              variant="outlined"
              placeholder="https://example.com/image.jpg"
              sx={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: '#ffffff' }}>
                    <ImageIcon sx={{ color: imageUrl ? ACCENT_COLOR : 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              disabled={saving}
              variant="outlined"
              sx={styles.input}
              InputLabelProps={{
                style: { color: errors.description ? theme.palette.error.main : 'rgba(255, 255, 255, 0.7)' }
              }}
              placeholder="Describe the menu item, including key ingredients and preparation style..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ 
              p: 1.5, 
              bgcolor: alpha(ACCENT_COLOR, 0.1), 
              borderRadius: '8px',
              border: `1px solid ${alpha(ACCENT_COLOR, 0.2)}`
            }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    disabled={saving}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: ACCENT_COLOR,
                        '&:hover': {
                          backgroundColor: alpha(ACCENT_COLOR, 0.1),
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: alpha(ACCENT_COLOR, 0.5),
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ 
                      fontWeight: isAvailable ? 'bold' : 'normal', 
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center', 
                    }}>
                      {isAvailable ? "Available on menu" : "Not available on menu"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {isAvailable 
                        ? "Customers can see and order this item" 
                        : "This item will be hidden from customers"}
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          </Grid>
          
          {imageUrl && (
            <Grid item xs={12}>
              <Fade in={true} timeout={500}>
                <Box sx={styles.imagePreview}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: ACCENT_COLOR, fontWeight: 600 }}>
                    Image Preview
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Fade in={imageLoaded} timeout={500}>
                      <Box 
                        component="img"
                        src={imageUrl}
                        alt={name}
                        sx={{ 
                          height: 200, 
                          maxWidth: '100%', 
                          objectFit: 'cover',
                          borderRadius: '8px',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                          opacity: imageLoaded ? 1 : 0,
                        }}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                          setImageLoaded(true);
                        }}
                      />
                    </Fade>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <Divider sx={styles.divider} />
      
      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button 
          onClick={onClose} 
          disabled={saving}
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
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={styles.primaryButton}
        >
          {saving ? 'Saving...' : menuItem ? 'Update Item' : 'Save Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemDialog;