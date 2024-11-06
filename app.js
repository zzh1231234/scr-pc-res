// app.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const bookingTableBody = document.querySelector('#bookingTable tbody');

    // Load existing bookings from local storage on page load
    window.onload = () => {
        const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        displayBookings(storedBookings);
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const computerNumber = document.getElementById('computerNumber').value;
        const date = document.getElementById('date').value;
        const timeSlot = document.getElementById('timeSlot').value;
        const projectCode = document.getElementById('projectCode').value;
        const reviewer = document.getElementById('reviewer').value;
        const projectManager = document.getElementById('projectManager').value;

        if (!validateFields(computerNumber, date, timeSlot, projectCode, reviewer, projectManager)) {
            return;
        }

        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

        if (isBookingConflict(computerNumber, date, timeSlot, bookings)) {
            alert('该时间段内该电脑已被预约，请选择其他时间段或电脑。');
            return;
        }

        const newBooking = {
            id: Date.now(),
            computerNumber,
            date,
            timeSlot,
            projectCode,
            reviewer,
            projectManager
        };

        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        displayBookings(bookings);

        clearForm();
    });

    function validateFields(...fields) {
        return fields.every(field => field.trim() !== '');
    }

    function clearForm() {
        document.getElementById('computerNumber').selectedIndex = 0;
        document.getElementById('date').value = '';
        document.getElementById('timeSlot').selectedIndex = 0;
        document.getElementById('projectCode').value = '';
        document.getElementById('reviewer').value = '';
        document.getElementById('projectManager').value = '';
    }

    function displayBookings(bookings) {
        bookingTableBody.innerHTML = '';

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.computerNumber}</td>
                <td>${booking.date}</td>
                <td>${booking.timeSlot}</td>
                <td>${booking.projectCode}</td>
                <td>${booking.reviewer}</td>
                <td>${booking.projectManager}</td>
                <td><button onclick="deleteBooking(${booking.id})">Delete</button></td>
            `;
            bookingTableBody.appendChild(row);
        });
    }

    function isBookingConflict(computerNumber, date, timeSlot, bookings) {
        return bookings.some(booking => 
            booking.computerNumber === computerNumber && 
            booking.date === date && 
            booking.timeSlot === timeSlot
        );
    }

    function deleteBooking(id) {
        if (confirm('Are you sure you want to delete this booking?')) {
            const bookings = JSON.parse(localStorage.getItem('bookings'));
            const updatedBookings = bookings.filter(booking => booking.id !== id);
            localStorage.setItem('bookings', JSON.stringify(updatedBookings));
            displayBookings(updatedBookings);
        }
    }
});