import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const SuccessDialog = ({ open, onClose, referenceId }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Order Successful!</DialogTitle>
      <DialogContent>
        Your order has been successfully placed and processed with a reference ID of {referenceId}.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;