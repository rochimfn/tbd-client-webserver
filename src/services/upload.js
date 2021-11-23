import multer from 'multer';
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    const name = file.originalname;
    cb(null, name);
  },
});

const upload = multer({storage: storage});

export {upload};
