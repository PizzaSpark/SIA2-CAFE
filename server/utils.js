const fs = require('fs');
const path = require('path');

// File operations
const fileOps = {
    uploadsDir: './uploads',

    deleteImage(imageName) {
        const imagePath = path.join(this.uploadsDir, imageName);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            } else {
                console.log("Image deleted successfully");
            }
        });
    },

    // Additional file operations can be added here
};

module.exports = { fileOps };