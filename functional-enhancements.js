// Health Akhada - Functional Enhancements
// Advanced features and data management

// Workout Session Management
class WorkoutSession {
    constructor() {
        this.id = 'workout_' + Date.now();
        this.startTime = new Date().toISOString();
        this.exercises = [];
        this.totalReps = 0;
        this.totalSets = 0;
        this.caloriesBurned = 0;
        this.formScore = 0;
        this.isActive = true;
    }
    
    addExercise(exercise) {
        this.exercises.push({
            name: exercise.name,
            sets: exercise.sets || [],
            timestamp: new Date().toISOString()
        });
    }
    
    addSet(exerciseName, reps, weight) {
        const exercise = this.exercises.find(e => e.name === exerciseName);
        if (exercise) {
            exercise.sets.push({ reps, weight, timestamp: new Date().toISOString() });
            this.totalSets++;
            this.totalReps += reps;
        }
    }
    
    updateFormScore(score) {
        this.formScore = score;
    }
    
    endSession() {
        this.endTime = new Date().toISOString();
        this.isActive = false;
        this.duration = (new Date(this.endTime) - new Date(this.startTime)) / 1000;
        this.caloriesBurned = this.calculateCalories();
        return this;
    }
    
    calculateCalories() {
        // Simple calculation based on duration and intensity
        const durationMinutes = this.duration / 60;
        const intensityFactor = this.formScore > 80 ? 12 : 8;
        return Math.round(durationMinutes * intensityFactor);
    }
}

// Nutrition Tracker
class NutritionTracker {
    constructor() {
        this.dailyGoal = 2500;
        this.meals = [];
        this.waterIntake = 0;
    }
    
    addMeal(meal) {
        this.meals.push({
            id: 'meal_' + Date.now(),
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            timestamp: new Date().toISOString()
        });
        this.save();
    }
    
    getTodaysMeals() {
        const today = new Date().toDateString();
        return this.meals.filter(meal => {
            return new Date(meal.timestamp).toDateString() === today;
        });
    }
    
    getTodaysCalories() {
        return this.getTodaysMeals().reduce((sum, meal) => sum + meal.calories, 0);
    }
    
    getTodaysMacros() {
        const meals = this.getTodaysMeals();
        return {
            protein: meals.reduce((sum, meal) => sum + meal.protein, 0),
            carbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
            fat: meals.reduce((sum, meal) => sum + meal.fat, 0)
        };
    }
    
    addWater(amount = 0.25) {
        this.waterIntake += amount;
        this.save();
    }
    
    save() {
        localStorage.setItem('nutritionTracker', JSON.stringify(this));
    }
    
    static load() {
        const data = localStorage.getItem('nutritionTracker');
        if (data) {
            const tracker = new NutritionTracker();
            Object.assign(tracker, JSON.parse(data));
            return tracker;
        }
        return new NutritionTracker();
    }
}

// Progress Tracker
class ProgressTracker {
    constructor() {
        this.measurements = [];
        this.weights = [];
        this.photos = [];
        this.achievements = [];
    }
    
    addWeight(weight, date = new Date()) {
        this.weights.push({
            value: weight,
            date: date.toISOString(),
            timestamp: Date.now()
        });
        this.save();
    }
    
    addMeasurement(type, value, date = new Date()) {
        this.measurements.push({
            type,
            value,
            date: date.toISOString(),
            timestamp: Date.now()
        });
        this.save();
    }
    
    addPhoto(photoUrl, notes = '') {
        this.photos.push({
            url: photoUrl,
            notes,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });
        this.save();
    }
    
    unlockAchievement(achievementId) {
        if (!this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            this.save();
            return true;
        }
        return false;
    }
    
    getWeightProgress() {
        return this.weights.sort((a, b) => a.timestamp - b.timestamp);
    }
    
    getCurrentWeight() {
        if (this.weights.length === 0) return null;
        return this.weights[this.weights.length - 1].value;
    }
    
    save() {
        localStorage.setItem('progressTracker', JSON.stringify(this));
    }
    
    static load() {
        const data = localStorage.getItem('progressTracker');
        if (data) {
            const tracker = new ProgressTracker();
            Object.assign(tracker, JSON.parse(data));
            return tracker;
        }
        return new ProgressTracker();
    }
}

// Achievement System
const achievements = {
    'first_workout': {
        id: 'first_workout',
        name: 'First Workout',
        description: 'Complete your first workout',
        icon: '🏆',
        condition: (stats) => stats.totalWorkouts >= 1
    },
    'week_streak': {
        id: 'week_streak',
        name: '7 Day Streak',
        description: 'Maintain a 7-day workout streak',
        icon: '🔥',
        condition: (stats) => stats.streak >= 7
    },
    'fifty_workouts': {
        id: 'fifty_workouts',
        name: '50 Workouts',
        description: 'Complete 50 workouts',
        icon: '💪',
        condition: (stats) => stats.totalWorkouts >= 50
    },
    'hundred_workouts': {
        id: 'hundred_workouts',
        name: '100 Workouts',
        description: 'Complete 100 workouts',
        icon: '⚡',
        condition: (stats) => stats.totalWorkouts >= 100
    },
    'goal_weight': {
        id: 'goal_weight',
        name: 'Goal Weight',
        description: 'Reach your goal weight',
        icon: '🎯',
        condition: (stats) => stats.goalWeightReached
    },
    'year_active': {
        id: 'year_active',
        name: '365 Days',
        description: 'Stay active for a full year',
        icon: '👑',
        condition: (stats) => stats.activeDays >= 365
    }
};

// Check and unlock achievements
function checkAchievements() {
    const userData = JSON.parse(localStorage.getItem('healthAkhadaUser'));
    const progressTracker = ProgressTracker.load();
    
    const stats = {
        totalWorkouts: userData.totalWorkouts,
        streak: userData.streak,
        activeDays: userData.activeDays || 45,
        goalWeightReached: false // Would check actual weight vs goal
    };
    
    Object.values(achievements).forEach(achievement => {
        if (achievement.condition(stats)) {
            if (progressTracker.unlockAchievement(achievement.id)) {
                showAchievementNotification(achievement);
            }
        }
    });
}

// Show achievement notification
function showAchievementNotification(achievement) {
    console.log(`Achievement Unlocked: ${achievement.name}`);
    // In a real app, this would show a toast notification
    if (typeof anime !== 'undefined') {
        // Animate achievement unlock
    }
}

// Form Analysis System
class FormAnalyzer {
    constructor() {
        this.currentScore = 0;
        this.corrections = [];
        this.repCount = 0;
    }
    
    analyzeForm(keypoints) {
        // Simulated form analysis
        // In real implementation, this would use pose detection
        const score = 75 + Math.floor(Math.random() * 20);
        this.currentScore = score;
        
        if (score < 80) {
            this.addCorrection('Keep your back straight');
        }
        if (score < 70) {
            this.addCorrection('Lower your hips more');
        }
        
        return score;
    }
    
    addCorrection(message) {
        this.corrections.push({
            message,
            timestamp: new Date().toISOString()
        });
    }
    
    incrementRep() {
        this.repCount++;
    }
    
    reset() {
        this.currentScore = 0;
        this.corrections = [];
        this.repCount = 0;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check achievements
    checkAchievements();
    
    // Initialize trackers if needed
    if (!localStorage.getItem('nutritionTracker')) {
        const tracker = new NutritionTracker();
        tracker.save();
    }
    
    if (!localStorage.getItem('progressTracker')) {
        const tracker = new ProgressTracker();
        tracker.save();
    }
});

// Export classes and functions
window.HealthAkhadaEnhanced = {
    WorkoutSession,
    NutritionTracker,
    ProgressTracker,
    FormAnalyzer,
    achievements,
    checkAchievements
};

console.log('Functional Enhancements Loaded ✓');