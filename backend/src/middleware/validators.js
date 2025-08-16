import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export const validateRegistration = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('familyName').notEmpty().withMessage('Family name is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('dateOfBirth').isISO8601().toDate().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'Diverse']).withMessage('Invalid gender specified'),
  body('countryOfBirth').notEmpty().withMessage('Country of birth is required'),
  body('birthPlace').notEmpty().withMessage('Birth place is required'),
  body('nativeLanguage').notEmpty().withMessage('Native language is required'),
  body('currentCity').notEmpty().withMessage('Current city is required'),
  body('currentCountry').notEmpty().withMessage('Current country of Residence is required'),
  body('idType').isIn(['passport', 'national_id']).withMessage('Invalid ID type'),
  body('idNumber').notEmpty().withMessage('ID number is required'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Minimal validator for creating an admin via invite secret
export const validateAdminRegistration = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('familyName').notEmpty().withMessage('Family name is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('telephone').notEmpty().withMessage('Telephone is required'),
  body('placeOfResidence').notEmpty().withMessage('Place of residence is required'),
  body('countryOfResidence').notEmpty().withMessage('Country of residence is required'),
  handleValidationErrors,
];

export const validatePasswordResetRequest = [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    handleValidationErrors,
];

export const validatePasswordReset = [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    handleValidationErrors,
];
