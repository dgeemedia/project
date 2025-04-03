document.addEventListener('DOMContentLoaded', () => {
    // --- Registration Form Handling (as defined previously) ---
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
      regForm.addEventListener('submit', handleRegistration);
      document.getElementById('userType').addEventListener('change', handleUserTypeChange);
    }
    
    // --- Login Form Handling ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    // --- Dynamic Creation of Login and Register Buttons in the Hero Section ---
    const heroButtonsContainer = document.querySelector('.hero-buttons');
    if (heroButtonsContainer) {
        // Create Login button
        const loginBtn = document.createElement('a')
        loginBtn.href = "login.html";
        loginBtn.className = "btn";
        loginBtn.textContent = "Login";
        heroButtonsContainer.appendChild(loginBtn);

        // Create Register button
        const registerBtn = document.createElement('a')
        registerBtn.href = "register.html";
        registerBtn.className = "btn";
        registerBtn.textContent = "register";
        heroButtonsContainer.appendChild(registerBtn);

    }
  
    // --- Hero Slider Functionality ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
  
    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, slideInterval);
  
    // --- Errands Form Handling (if on errands page) ---
    const errandForm = document.getElementById('errandForm');
    if (errandForm) {
      errandForm.addEventListener('submit', addErrand);
      loadErrands();
    }
  
    // --- Wallet Form Handling (if on wallet page) ---
    const fundForm = document.getElementById('fundForm');
    if (fundForm) {
      fundForm.addEventListener('submit', loadFunds);
      updateBalance();
      // Set the proper currency symbol based on the last registered user (default to US if none)
      const user = JSON.parse(localStorage.getItem('user'));
      const currencySymbol = user ? getCurrencySymbol(user.country) : getCurrencySymbol('US');
      document.querySelector('.currency').textContent = currencySymbol;
    }
  
    // --- Dashboard Loading (if on dashboard page) ---
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      loadDashboard();
    }
  });
  
  // --- Login Function ---
  function handleLogin(event) {
    event.preventDefault();
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;
  
    // Retrieve all registered users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Save current user
      alert('Login successful!');
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid email or password!');
    }
  }
  
  // --- Dashboard Function ---
  function loadDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = 'login.html'; // Redirect if not logged in
      return;
    }
    document.getElementById('userInfo').innerHTML = `
      <p>Welcome, <strong>${user.fullName}</strong> (${user.userType.toUpperCase()})</p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      <p>Country: ${user.country} (${getCurrencySymbol(user.country)})</p>
    `;
  }
  
  // --- Logout Function ---
  function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
  
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  
  // --- Registration Form Functions (from previous code) ---
  function handleUserTypeChange(event) {
    const userType = event.target.value;
    const businessFields = document.getElementById('businessFields');
    const artisanFields = document.getElementById('artisanFields');
  
    if (userType === 'business') {
      businessFields.style.display = 'block';
      artisanFields.style.display = 'none';
      document.getElementById('businessCertificate').required = true;
      document.getElementById('taxId').required = true;
      document.getElementById('servicesOffered').required = false;
    } else if (userType === 'artisan') {
      artisanFields.style.display = 'block';
      businessFields.style.display = 'none';
      document.getElementById('servicesOffered').required = true;
      document.getElementById('businessCertificate').required = false;
      document.getElementById('taxId').required = false;
    } else {
      businessFields.style.display = 'none';
      artisanFields.style.display = 'none';
      document.getElementById('businessCertificate').required = false;
      document.getElementById('taxId').required = false;
      document.getElementById('servicesOffered').required = false;
    }
  }
  
  function handleRegistration(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const country = document.getElementById('country').value;
    const userType = document.getElementById('userType').value;
    const password = document.getElementById('password').value;
    let businessCertificate = null;
    let taxId = null;
    let servicesOffered = null;
  
    if (userType === 'business') {
      const certificateInput = document.getElementById('businessCertificate');
      businessCertificate = certificateInput.files[0] ? certificateInput.files[0].name : '';
      taxId = document.getElementById('taxId').value;
    } else if (userType === 'artisan') {
      servicesOffered = document.getElementById('servicesOffered').value;
    }
  
    const user = {
      fullName,
      email,
      phone,
      country,
      userType,
      password, // Reminder: In a production app, never store plaintext passwords.
      businessCertificate,
      taxId,
      servicesOffered,
      currency: getCurrencySymbol(country)
    };
  
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(user)); // Save last registered user
  
    alert(`Registration successful! Welcome, ${fullName}`);
    event.target.reset();
  }
  
  function getCurrencySymbol(country) {
    const currencies = {
      'NG': '₦',
      'GH': 'GH₵',
      'US': '$',
      'UK': '£'
    };
    return currencies[country] || '$';
  }
  
  // --- Errands Functions (as previously defined) ---
  let errands = JSON.parse(localStorage.getItem('errands')) || [];
  
  function addErrand(event) {
    event.preventDefault();
    const taskDescription = document.getElementById('taskDescription').value;
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    
    const newErrand = {
      description: taskDescription,
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      timestamp: new Date().toISOString()
    };
  
    errands.push(newErrand);
    localStorage.setItem('errands', JSON.stringify(errands));
    displayErrands();
    event.target.reset();
  }
  
  function loadErrands() {
    displayErrands();
  }
  
  function displayErrands() {
    const errandsList = document.getElementById('errands');
    if (errandsList) {
      errandsList.innerHTML = errands.map(errand => 
        `<li>
           <strong>Task:</strong> ${errand.description} <br>
           <strong>Pickup:</strong> ${errand.pickup} <br>
           <strong>Dropoff:</strong> ${errand.dropoff} <br>
           <em>Posted on: ${new Date(errand.timestamp).toLocaleString()}</em>
         </li>`
      ).join('');
    }
  }
  
  // --- Wallet Functions (as previously defined) ---
  let balance = parseFloat(localStorage.getItem('balance')) || 0.00;
  
  function loadFunds(event) {
    event.preventDefault();
    const fundAmount = parseFloat(document.getElementById('fundAmount').value);
    if (isNaN(fundAmount) || fundAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    balance += fundAmount;
    localStorage.setItem('balance', balance.toFixed(2));
    updateBalance();
    const user = JSON.parse(localStorage.getItem('user'));
    const currencySymbol = user ? getCurrencySymbol(user.country) : getCurrencySymbol('US');
    document.getElementById('transactionMessage').innerHTML = `<p>Successfully added ${currencySymbol}${fundAmount.toFixed(2)} to your wallet.</p>`;
    event.target.reset();
  }
  
  function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(2);
  }
  