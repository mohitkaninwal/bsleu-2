// Temporary script to create admin user
// Run this once after backend deployment, then delete this file

const createAdmin = async () => {
  const BACKEND_URL = 'https://your-backend-url.com'; // Replace with your actual backend URL
  const ADMIN_SECRET = 'your_admin_invite_secret'; // Use the same secret from your .env
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inviteSecret: ADMIN_SECRET,
        email: 'admin@bsleu.com', // Your admin email
        password: 'your_secure_admin_password', // Your admin password
        familyName: 'Administrator',
        firstName: 'System',
        telephone: '+1234567890',
        placeOfResidence: 'New Delhi',
        countryOfResidence: 'India'
      })
    });

    const result = await response.json();
    console.log('Admin creation result:', result);
    
    if (result.success) {
      console.log('✅ Admin user created successfully!');
      console.log('You can now login at: https://your-vercel-app.vercel.app/admin');
    } else {
      console.log('❌ Failed to create admin:', result.message);
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

// Run the script
createAdmin();
