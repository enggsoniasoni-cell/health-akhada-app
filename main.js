// Health Akhada - Main JavaScript
// Core functionality and data management

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserData();
    setupAnimations();
});

// Initialize application
function initializeApp() {
    console.log('Health Akhada initialized');
    
    // Check if user data exists
    if (!localStorage.getItem('healthAkhadaUser')) {
        createDefaultUser();
    }
    
    // Load theme preference
    loadThemePreference();
}

// Create default user data
function createDefaultUser() {
    const defaultUser = {
        id: 'user_' + Date.now(),
        name: 'Warrior',
        email: 'warrior@healthakhada.com',
        joinDate: new Date().toISOString(),
        membershipTier: 'Gold',
        energyScore: 87,
        streak: 45,
        totalWorkouts: 127,
        totalHours: 89.5,
        caloriesBurned: 42800,
        preferences: {
            theme: 'dark',
            notifications: true,
            units: 'metric'
        }
    };
    
    localStorage.setItem('healthAkhadaUser', JSON.stringify(defaultUser));
}

// Load user data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('healthAkhadaUser'));
    
    if (userData) {
        // Update UI with user data
        const userNameElements = document.querySelectorAll('#userName');
        userNameElements.forEach(el => {
            if (el) el.textContent = userData.name;
        });
        
        const energyScoreElement = document.getElementById('energyScore');
        if (energyScoreElement) {
            energyScoreElement.textContent = userData.energyScore;
        }
    }
}

// Setup animations
function setupAnimations() {
    // Animate cards on page load
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.glass-card',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutQuad'
        });
    }
}

// Load theme preference
function loadThemePreference() {
    const userData = JSON.parse(localStorage.getItem('healthAkhadaUser'));
    if (userData && userData.preferences.theme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Save user data
function saveUserData(data) {
    const currentData = JSON.parse(localStorage.getItem('healthAkhadaUser'));
    const updatedData = { ...currentData, ...data };
    localStorage.setItem('healthAkhadaUser', JSON.stringify(updatedData));
}

// Update energy score
function updateEnergyScore(score) {
    const userData = JSON.parse(localStorage.getItem('healthAkhadaUser'));
    userData.energyScore = score;
    saveUserData(userData);
    
    const energyScoreElement = document.getElementById('energyScore');
    if (energyScoreElement) {
        energyScoreElement.textContent = score;
    }
}

// Start recommended workout
function startRecommendedWorkout() {
    console.log('Starting recommended workout');
    window.location.href = 'workout.html';
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Utility function to format time
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Calculate calories burned
function calculateCaloriesBurned(duration, intensity) {
    // Simple calculation: duration (minutes) * intensity factor
    const intensityFactors = {
        low: 5,
        medium: 8,
        high: 12
    };
    
    return Math.round(duration * (intensityFactors[intensity] || 8));
}

// Get workout data
function getWorkoutData() {
    const workoutData = localStorage.getItem('healthAkhadaWorkouts');
    return workoutData ? JSON.parse(workoutData) : {
        currentWorkout: null,
        workoutHistory: [],
        personalRecords: {
            benchPress: 85,
            squat: 120,
            deadlift: 140
        }
    };
}

// Save workout data
function saveWorkoutData(data) {
    localStorage.setItem('healthAkhadaWorkouts', JSON.stringify(data));
}

// Get nutrition data
function getNutritionData() {
    const nutritionData = localStorage.getItem('healthAkhadaNutrition');
    return nutritionData ? JSON.parse(nutritionData) : {
        dailyGoal: 2500,
        caloriesConsumed: 1847,
        macros: {
            protein: { current: 142, goal: 180 },
            carbs: { current: 198, goal: 250 },
            fat: { current: 62, goal: 70 }
        },
        waterIntake: { current: 1.8, goal: 3.0 },
        meals: []
    };
}

// Save nutrition data
function saveNutritionData(data) {
    localStorage.setItem('healthAkhadaNutrition', JSON.stringify(data));
}

// Export functions for use in other files
window.HealthAkhada = {
    saveUserData,
    loadUserData,
    updateEnergyScore,
    getWorkoutData,
    saveWorkoutData,
    getNutritionData,
    saveNutritionData,
    formatDate,
    formatTime,
    calculateCaloriesBurned
};

console.log('Health Akhada Core Loaded ✓');