const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "images");
  }, // path to save file

  filename(req, file, callback) {
    callback(null, new Date().toISOString() + "-" + file.originalname);
  },
  // rename incoming file
});

const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, callback) => {
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true); // true, valid is pass
  } else {
    callback(null, false);
  }
};
// validator for file

module.exports = multer({
  storage,
  fileFilter,
});
