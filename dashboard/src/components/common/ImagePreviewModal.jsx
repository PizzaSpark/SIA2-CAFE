import React from 'react';
import { Modal, Box } from '@mui/material';

const ImagePreviewModal = ({ open, onClose, imageUrl }) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 'calc(90vw - 40px)',  // Subtract padding from width
          height: 'calc(90vh - 40px)', // Subtract padding from height
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'hidden',
          padding: '20px',  // Add padding here
          borderRadius: '8px', // Optional: add rounded corners
        }}
      >
        <img 
          src={imageUrl} 
          alt="Preview" 
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }} 
        />
      </Box>
    </Modal>
  );
};

export default ImagePreviewModal;