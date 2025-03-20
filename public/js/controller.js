// Check if login form exists before adding event listener
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission
    // Get email and password values from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      // Send login request to the server
      const response = await axios.post('/user/login', { email, password });
      // Extract token from the response
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Received token:', token);
      console.log('Login successful, token saved.');
      // Redirect to the dashboard or another page
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      // Display error message to the user
      const errorMessage = document.getElementById('error-message');
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage.textContent = error.response.data.message;
      } else {
        errorMessage.textContent = 'An error occurred during login. Please try again.';
      }
    }
  });
}

// Check if registration form exists before adding event listener
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    // Get name, email, and password values from the form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      // Send login request to the server
      const response = await axios.post('/user/register', { name, email, password });
      console.log('Registration successful:', response.data.message);
      // Redirect to the login page
      window.location.href = '/user/login';
    } catch (error) {
      console.error('Registration error:', error);
      // Display error message to the user
      const errorMessage = document.getElementById('error-message');
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage.textContent = error.response.data.message;
      } else {
        errorMessage.textContent = 'An error occurred during registration. Please try again.';
      }
    }
  });
}