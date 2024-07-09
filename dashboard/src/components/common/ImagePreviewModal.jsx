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
          width: '80vw',  // Fixed width
          height: '80vh', // Fixed height
          maxWidth: '800px', // Optional maximum width
          maxHeight: '600px', // Optional maximum height
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
