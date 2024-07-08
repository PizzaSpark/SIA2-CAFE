import React from 'react';
import { Modal, Box } from '@mui/material';

const ImagePreviewModal = ({ open, onClose, imageUrl }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxWidth: '90%',
          maxHeight: '90%',
        }}
      >
        <img 
          src={imageUrl} 
          alt="Preview" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain' 
          }} 
        />
      </Box>
    </Modal>
  );
};

export default ImagePreviewModal;