// Hardcoded doctors data
const doctors = [
    { name: "Dr. John Doe", specialization: "Cardiology", fee: "$100" },
    { name: "Dr. Jane Smith", specialization: "Dermatology", fee: "$80" },
    { name: "Dr. Alex Johnson", specialization: "Pediatrics", fee: "$90" }
];

// Function to load doctors into table or dropdown
function loadDoctors() {
    const tableBody = document.getElementById('doctors-table')?.querySelector('tbody');
    const select = document.getElementById('doctor-select');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        doctors.forEach(doctor => {
            const row = `<tr>
                <td>${doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.fee}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }
    
    if (select) {
        select.innerHTML = '<option value="">-- Choose a Doctor --</option>';
        doctors.forEach(doctor => {
            const option = `<option value="${doctor.name}">${doctor.name} (${doctor.specialization})</option>`;
            select.innerHTML += option;
        });
    }
}

// Function to load appointments from localStorage
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const tableBody = document.getElementById('appointments-table')?.querySelector('tbody');
    const noAppointments = document.getElementById('no-appointments');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        if (appointments.length === 0) {
            noAppointments.style.display = 'block';
        } else {
            noAppointments.style.display = 'none';
            appointments.forEach(apt => {
                const row = `<tr>
                    <td>${apt.patientName}</td>
                    <td>${apt.doctor}</td>
                    <td>${apt.date}</td>
                    <td>${apt.time}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        }
    }
}

// Form validation and submission
function handleBookingForm() {
    const form = document.getElementById('booking-form');
    const errorMsg = document.getElementById('error-message');
    const successMsg = document.getElementById('success-message');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        
        const patientName = document.getElementById('patient-name').value.trim();
        const doctor = document.getElementById('doctor-select').value;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        
        // Validations
        if (!patientName || patientName.length < 2) {
            errorMsg.textContent = 'Patient name must be at least 2 characters.';
            errorMsg.style.display = 'block';
            return;
        }
        if (!doctor) {
            errorMsg.textContent = 'Please select a doctor.';
            errorMsg.style.display = 'block';
            return;
        }
        if (!date) {
            errorMsg.textContent = 'Please select a date.';
            errorMsg.style.display = 'block';
            return;
        }
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            errorMsg.textContent = 'Date must be today or in the future.';
            errorMsg.style.display = 'block';
            return;
        }
        if (!time) {
            errorMsg.textContent = 'Please select a time.';
            errorMsg.style.display = 'block';
            return;
        }
        const [hours] = time.split(':').map(Number);
        if (hours < 9 || hours > 17) {
            errorMsg.textContent = 'Time must be between 9 AM and 5 PM.';
            errorMsg.style.display = 'block';
            return;
        }
        
        // Save to localStorage
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push({ patientName, doctor, date, time });
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        successMsg.style.display = 'block';
        form.reset();
    });
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', function() {
    loadDoctors();
    if (document.getElementById('booking-form')) {
        handleBookingForm();
    }
    if (document.getElementById('appointments-table')) {
        loadAppointments();
    }
});