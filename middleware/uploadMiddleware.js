const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const storagebuffer = multer.memoryStorage();
const uploadbuffer = multer({ 
    storage: storagebuffer,
    // limits: { fileSize: 200 * 1024 * 1024 }
});

const upload = multer({ 
    storage,
    // limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = {upload, uploadbuffer};
