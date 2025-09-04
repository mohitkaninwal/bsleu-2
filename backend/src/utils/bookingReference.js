// Utility function for generating consistent booking references across the application
export const generateBookingReference = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const randomCode = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `BSLEU-${year}${month}${day}-${randomCode}`;
};

// Function to generate seed booking references for testing
export const generateSeedBookingReference = (seedNumber) => {
  return `BSLEU-SEED-${seedNumber}`;
};
