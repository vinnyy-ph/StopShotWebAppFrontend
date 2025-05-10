// admin/components/layout/Header.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
  onProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onNotificationMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header: React.FC<HeaderProps> = ({
  drawerWidth,
  onDrawerToggle,
  onProfileMenuOpen,
  onNotificationMenuOpen
}) => {
  return (
    <AppBar 
      position="fixed" 
      className="app-bar"
      sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}
    >
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          className="menu-button"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <IconButton className="header-icon" onClick={onNotificationMenuOpen}>
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        
        <IconButton
          edge="end"
          onClick={onProfileMenuOpen}
          className="profile-icon"
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;