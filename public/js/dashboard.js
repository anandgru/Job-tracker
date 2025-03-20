// dashboard.js - Handles all dashboard functionality

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    // Check for auth token
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Set username in header
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    document.getElementById('username').textContent = userData.firstName || 'User';

    // Initialize dashboard
    loadDashboardData();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Logout button
    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    });

    // Modal close button
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        document.getElementById('applicationModal').style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('applicationModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Load all dashboard data from API
async function loadDashboardData() {
    try {
        showLoadingIndicators();
        
        // Fetch dashboard data from API
        const response = await fetchWithAuth('/api/dashboard');
        const data = await response.json();
        
        if (response.ok) {
            // Update dashboard elements with received data
            updateStatistics(data.statistics);
            createStatusChart(data.statusBreakdown);
            createTimelineChart(data.timeline);
            displayRecentApplications(data.recentApplications);
            displayUpcomingReminders(data.upcomingReminders);
        } else {
            showError('Failed to load dashboard data');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Could not connect to server');
    } finally {
        hideLoadingIndicators();
    }
}

// Helper function for authenticated API requests
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('authToken');
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    
    return fetch(url, { ...defaultOptions, ...options });
}

// Update statistics section
function updateStatistics(stats) {
    document.getElementById('totalApplications').textContent = stats.total || 0;
    document.getElementById('activeApplications').textContent = stats.active || 0;
    document.getElementById('interviews').textContent = stats.interviews || 0;
    document.getElementById('offers').textContent = stats.offers || 0;
}

// Create status breakdown chart
function createStatusChart(statusData) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    // Create labels and data arrays from status data
    const labels = Object.keys(statusData);
    const data = Object.values(statusData);
    
    // Define colors for different statuses
    const backgroundColors = [
        'rgba(54, 162, 235, 0.6)', // Applied
        'rgba(255, 206, 86, 0.6)', // In Progress
        'rgba(75, 192, 192, 0.6)', // Interviewed
        'rgba(153, 102, 255, 0.6)', // Offered
        'rgba(255, 99, 132, 0.6)',  // Rejected
        'rgba(255, 159, 64, 0.6)'   // Other
    ];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Create applications timeline chart
function createTimelineChart(timelineData) {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    // Sort timeline data by date
    const sortedData = [...timelineData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Extract dates and counts
    const dates = sortedData.map(item => formatDate(item.date));
    const counts = sortedData.map(item => item.count);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Applications',
                data: counts,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Display recent applications table
function displayRecentApplications(applications) {
    const tableBody = document.getElementById('recentApplicationsList');
    tableBody.innerHTML = '';
    
    if (applications.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" class="no-data">No applications found</td>';
        tableBody.appendChild(tr);
        return;
    }
    
    applications.forEach(app => {
        const tr = document.createElement('tr');
        
        // Define status classes for color coding
        const statusClasses = {
            'applied': 'status-applied',
            'interviewed': 'status-interviewed',
            'offered': 'status-offered',
            'rejected': 'status-rejected',
            'saved': 'status-saved'
        };
        
        const statusClass = statusClasses[app.status.toLowerCase()] || '';
        
        tr.innerHTML = `
            <td>${escapeHTML(app.companyName)}</td>
            <td>${escapeHTML(app.jobTitle)}</td>
            <td>${formatDate(app.applicationDate)}</td>
            <td><span class="status-badge ${statusClass}">${escapeHTML(app.status)}</span></td>
            <td>
                <button class="btn-icon view-app" data-id="${app.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit-app" data-id="${app.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners to buttons
    tableBody.querySelectorAll('.view-app').forEach(btn => {
        btn.addEventListener('click', function() {
            const appId = this.getAttribute('data-id');
            viewApplicationDetails(appId);
        });
    });
    
    tableBody.querySelectorAll('.edit-app').forEach(btn => {
        btn.addEventListener('click', function() {
            const appId = this.getAttribute('data-id');
            window.location.href = `application-edit.html?id=${appId}`;
        });
    });
}

// Display upcoming reminders
function displayUpcomingReminders(reminders) {
    const remindersList = document.getElementById('remindersList');
    remindersList.innerHTML = '';
    
    if (reminders.length === 0) {
        remindersList.innerHTML = '<li class="no-data">No upcoming reminders</li>';
        return;
    }
    
    reminders.forEach(reminder => {
        const li = document.createElement('li');
        li.className = 'reminder-item';
        
        const reminderDate = new Date(reminder.reminderDate);
        const isToday = isSameDay(reminderDate, new Date());
        
        li.innerHTML = `
            <div class="reminder-info">
                <div class="reminder-date ${isToday ? 'today' : ''}">
                    ${formatDateShort(reminderDate)}
                </div>
                <div class="reminder-details">
                    <h4>${escapeHTML(reminder.title)}</h4>
                    <p>${escapeHTML(reminder.description)}</p>
                    <p class="reminder-company">
                        <i class="fas fa-building"></i> 
                        ${escapeHTML(reminder.companyName)} - ${escapeHTML(reminder.jobTitle)}
                    </p>
                </div>
            </div>
            <div class="reminder-actions">
                <button class="btn-icon mark-complete" data-id="${reminder.id}" title="Mark Complete">
                    <i class="fas fa-check-circle"></i>
                </button>
            </div>
        `;
        
        remindersList.appendChild(li);
    });
    
    // Add event listeners to mark complete buttons
    remindersList.querySelectorAll('.mark-complete').forEach(btn => {
        btn.addEventListener('click', function() {
            const reminderId = this.getAttribute('data-id');
            markReminderComplete(reminderId);
        });
    });
}

// View application details in modal
async function viewApplicationDetails(applicationId) {
    try {
        const response = await fetchWithAuth(`/api/applications/${applicationId}`);
        
        if (response.ok) {
            const application = await response.json();
            displayApplicationModal(application);
        } else {
            showError('Failed to load application details');
        }
    } catch (error) {
        console.error('Error loading application details:', error);
        showError('Could not connect to server');
    }
}

// Display application details in modal
function displayApplicationModal(application) {

}
    