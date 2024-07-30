import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Box
} from "@mui/material";
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import InventoryIcon from '@mui/icons-material/Inventory';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiListItem-root': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
}));

const StockErrorDialog = ({ open, onClose, errorMessage }) => {
  // Parse the error message and group by menu item
  const parseErrorMessage = (message) => {
    if (typeof message !== 'string') {
      console.error('Error message is not a string:', message);
      return {};
    }

    const lines = message.split('\n');
    const groupedErrors = {};

    let currentMenuItem = '';
    lines.forEach(line => {
      if (typeof line !== 'string') {
        console.error('Invalid line in error message:', line);
        return;
      }

      if (line.startsWith('Menu Item:')) {
        currentMenuItem = line.replace('Menu Item:', '').trim();
        groupedErrors[currentMenuItem] = [];
      } else if (line.startsWith('Insufficient stock:')) {
        if (!currentMenuItem) {
          console.error('Found stock error without associated menu item:', line);
          return;
        }

        const parts = line.replace('Insufficient stock:', '').split(',');
        if (parts.length !== 2) {
          console.error('Invalid stock error format:', line);
          return;
        }

        const [stockName, quantityNeeded] = parts;
        groupedErrors[currentMenuItem].push({
          stock: stockName.trim(),
          needed: parseInt(quantityNeeded.trim(), 10) || 0
        });
      }
    });

    return groupedErrors;
  };

  const groupedErrors = parseErrorMessage(errorMessage);

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h6" component="div" style={{ display: 'flex', alignItems: 'center' }}>
          <ErrorOutlineIcon style={{ marginRight: '8px' }} />
          Insufficient Stock
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          The following items have insufficient stock:
        </Typography>
        <List>
          {Object.entries(groupedErrors).map(([menuItem, stocks], index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemIcon>
                  <RestaurantMenuIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle1">{menuItem}</Typography>}
                  secondary={
                    <Box component="span" sx={{ display: 'block', mt: 1 }}>
                      {stocks.map((stock, stockIndex) => (
                        <Typography key={stockIndex} variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <InventoryIcon fontSize="small" sx={{ mr: 1 }} />
                          {stock.stock}: {stock.needed} more needed
                        </Typography>
                      ))}
                    </Box>
                  }
                />
              </ListItem>
              {index < Object.keys(groupedErrors).length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" autoFocus>
          CLOSE
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default StockErrorDialog;