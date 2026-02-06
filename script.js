document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const roomTypeSelect = document.getElementById('roomType');
    const toast = document.getElementById('toast');
    const btnSubmit = document.querySelector('.btn-submit');
    const btnText = document.querySelector('.btn-text');
    const successIcon = document.querySelector('.success-icon');

    // --- Date Initialization & Logic ---

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Set min check-in date to today
    checkInInput.setAttribute('min', today);

    // Update Check-out min date when Check-in changes
    checkInInput.addEventListener('change', () => {
        const checkInDate = checkInInput.value;

        if (checkInDate) {
            checkOutInput.removeAttribute('disabled');

            // Calculate next day for minimum checkout
            const date = new Date(checkInDate);
            date.setDate(date.getDate() + 1);
            const nextDay = date.toISOString().split('T')[0];

            checkOutInput.setAttribute('min', nextDay);

            // If current checkout is invalid (before new min), clear it
            if (checkOutInput.value && checkOutInput.value < nextDay) {
                checkOutInput.value = '';
                showError(checkOutInput, 'Please re-select check-out date');
            } else {
                clearError(checkOutInput);
            }
        } else {
            checkOutInput.setAttribute('disabled', 'true');
            checkOutInput.value = '';
        }
    });

    // --- Validation Functions ---

    function showError(input, message) {
        const group = input.closest('.input-group');
        group.classList.add('error');
        const errorSpan = group.querySelector('.error-message');
        if (errorSpan && message) {
            errorSpan.textContent = message;
        }
    }

    function clearError(input) {
        const group = input.closest('.input-group');
        group.classList.remove('error');
    }

    // Validate single input
    function validateInput(input) {
        if (input.checkValidity()) {
            clearError(input);
            return true;
        } else {
            // Customize messages based on type
            let msg = input.validationMessage;
            if (input.id === 'checkIn') msg = 'Please select a valid check-in date';
            if (input.id === 'roomType') msg = 'Please select a room type';

            showError(input, msg);
            return false;
        }
    }

    // Real-time validation on blur/input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.closest('.input-group').classList.contains('error')) {
                validateInput(input);
            }
        });
    });

    // --- Form Submission ---

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate all fields
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Simulate API call / Loading
            simulateSubmission();
        } else {
            // Shake animation for invalid form
            const card = document.querySelector('.booking-card');
            card.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(0)' }
            ], {
                duration: 400,
                easing: 'ease-in-out'
            });
        }
    });

    function simulateSubmission() {
        // Change button state
        const originalText = btnText.textContent;
        btnText.textContent = 'Booking...';
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.8';

        setTimeout(() => {
            // Success & Redirect
            window.location.href = 'submit.html';
        }, 1500);
    }

    // Removed showToast function as it's no longer needed
});
