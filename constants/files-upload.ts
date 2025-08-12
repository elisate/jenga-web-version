const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FILES_UPLOAD_CONSTANTS = {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  ERROR_MESSAGES: {
    INVALID_FILE_TYPE:
      "Dosiye zigomba kuba amafoto (PNG, JPG), PDF cyangwa DOCX",
    FILE_TOO_LARGE: `Dosiye ntirenze ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  },
};
