// Health Akhada - Body Intelligence Module
// Gabbit Ring Integration & AI Workout Recommendations

// Gabbit Ring Data Structure
const gabbitRingData = {
    lastSync: new Date().toISOString(),
    hrv: 42,
    restingHR: 58,
    bodyTemp: 36.7,
    sleepQuality: 85,
    sleepDuration: 7.2,
    stressLevel: 'Low',
    recoveryScore: 78,
    weeklyLoad: 'Medium',
    trend: 'Stable'
};

// NADI System (Nervous System Status)
function calculateNADI(hrv, stressLevel, sleepQuality) {
    if (hrv > 50 && stressLevel === 'Low' && sleepQuality > 80) {
        return 'PUSH';
    } else if (hrv < 30 || stressLevel === 'High' || sleepQuality < 60) {
        return 'PROTECT';
    }
    return 'NORMAL';
}

// AGNI System (Metabolic Fire)
function calculateAGNI(bodyTemp, restingHR, recoveryScore) {
    const metabolicScore = (bodyTemp - 36) * 10 + (70 - restingHR) + recoveryScore;
    
    if (metabolicScore > 90) {
        return 'HIGH';
    } else if (metabolicScore < 60) {
        return 'LOW';
    }
    return 'MEDIUM';
}

// SHAKTI System (Training Readiness)
function calculateSHAKTI(recoveryScore, weeklyLoad, trend) {
    if (recoveryScore > 75 && weeklyLoad !== 'High' && trend !== 'Declining') {
        return 'PUSH';
    } else if (recoveryScore < 50 || weeklyLoad === 'High' || trend === 'Declining') {
        return 'DELOAD';
    }
    return 'NORMAL';
}

// Generate AI Workout Recommendation
function generateWorkoutRecommendation(nadi, agni, shakti) {
    const recommendations = {
        'PUSH-HIGH-PUSH': {
            workout: 'High-Intensity Strength Training',
            reason: 'Your recovery is optimal and metabolic fire is high. Perfect day for heavy compound lifts.'
        },
        'PUSH-HIGH-NORMAL': {
            workout: 'Moderate Strength with Power Work',
            reason: 'Good recovery with high metabolism. Mix strength training with explosive movements.'
        },
        'PUSH-MEDIUM-PUSH': {
            workout: 'Balanced Strength & Conditioning',
            reason: 'Nervous system is ready. Focus on balanced training with moderate intensity.'
        },
        'NORMAL-HIGH-PUSH': {
            workout: 'Metabolic Conditioning',
            reason: 'High metabolic state. Great for circuit training and conditioning work.'
        },
        'NORMAL-MEDIUM-NORMAL': {
            workout: 'Moderate Training Session',
            reason: 'Balanced state. Stick to your regular training routine with moderate intensity.'
        },
        'NORMAL-LOW-NORMAL': {
            workout: 'Light Strength Training',
            reason: 'Metabolism is lower. Focus on technique and lighter weights today.'
        },
        'PROTECT-LOW-DELOAD': {
            workout: 'Active Recovery',
            reason: 'Your body needs recovery. Light mobility work, stretching, or yoga recommended.'
        },
        'PROTECT-MEDIUM-DELOAD': {
            workout: 'Recovery & Mobility',
            reason: 'Nervous system needs rest. Focus on recovery activities and light movement.'
        },
        'NORMAL-MEDIUM-DELOAD': {
            workout: 'Deload Week Training',
            reason: 'Time to reduce volume. Train at 60-70% intensity to allow recovery.'
        }
    };
    
    const key = `${nadi}-${agni}-${shakti}`;
    return recommendations[key] || {
        workout: 'Moderate Training Session',
        reason: 'Listen to your body and train at a comfortable intensity.'
    };
}

// Simulate Gabbit Ring Data Sync
function syncGabbitRing() {
    // Simulate real-time data with slight variations
    gabbitRingData.hrv = 42 + Math.floor(Math.random() * 10) - 5;
    gabbitRingData.restingHR = 58 + Math.floor(Math.random() * 6) - 3;
    gabbitRingData.bodyTemp = 36.7 + (Math.random() * 0.4 - 0.2);
    gabbitRingData.sleepQuality = 85 + Math.floor(Math.random() * 10) - 5;
    gabbitRingData.recoveryScore = 78 + Math.floor(Math.random() * 10) - 5;
    gabbitRingData.lastSync = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('gabbitRingData', JSON.stringify(gabbitRingData));
    
    return gabbitRingData;
}

// Update Body Intelligence Card
function updateBodyIntelligenceCard() {
    const data = syncGabbitRing();
    
    // Calculate systems
    const nadi = calculateNADI(data.hrv, data.stressLevel, data.sleepQuality);
    const agni = calculateAGNI(data.bodyTemp, data.restingHR, data.recoveryScore);
    const shakti = calculateSHAKTI(data.recoveryScore, data.weeklyLoad, data.trend);
    
    // Update UI
    const nadiElement = document.getElementById('nadiStatus');
    const agniElement = document.getElementById('agniStatus');
    const shaktiElement = document.getElementById('shaktiStatus');
    
    if (nadiElement) {
        nadiElement.textContent = nadi;
        nadiElement.className = `text-sm font-bold ${getStatusColor(nadi)}`;
    }
    
    if (agniElement) {
        agniElement.textContent = agni;
        agniElement.className = `text-sm font-bold ${getStatusColor(agni)}`;
    }
    
    if (shaktiElement) {
        shaktiElement.textContent = shakti;
        shaktiElement.className = `text-sm font-bold ${getStatusColor(shakti)}`;
    }
    
    // Update recommendation
    const recommendation = generateWorkoutRecommendation(nadi, agni, shakti);
    const recommendationElement = document.getElementById('aiRecommendation');
    const reasonElement = document.getElementById('aiReason');
    
    if (recommendationElement) {
        recommendationElement.textContent = recommendation.workout;
    }
    
    if (reasonElement) {
        reasonElement.textContent = recommendation.reason;
    }
    
    // Save current state
    const bodyIntelligence = {
        nadi,
        agni,
        shakti,
        recommendation,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('bodyIntelligence', JSON.stringify(bodyIntelligence));
}

// Get status color class
function getStatusColor(status) {
    const colors = {
        'PUSH': 'text-green-500',
        'NORMAL': 'text-blue-500',
        'PROTECT': 'text-red-500',
        'DELOAD': 'text-yellow-500',
        'HIGH': 'text-orange-500',
        'MEDIUM': 'text-yellow-500',
        'LOW': 'text-blue-400'
    };
    
    return colors[status] || 'text-gray-400';
}

// Get Gabbit Ring Data
function getGabbitRingData() {
    const stored = localStorage.getItem('gabbitRingData');
    return stored ? JSON.parse(stored) : gabbitRingData;
}

// Initialize Body Intelligence on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('nadiStatus')) {
        updateBodyIntelligenceCard();
        
        // Auto-refresh every 5 minutes
        setInterval(updateBodyIntelligenceCard, 5 * 60 * 1000);
    }
});

// Export functions
window.BodyIntelligence = {
    syncGabbitRing,
    updateBodyIntelligenceCard,
    getGabbitRingData,
    calculateNADI,
    calculateAGNI,
    calculateSHAKTI,
    generateWorkoutRecommendation
};

console.log('Body Intelligence Module Loaded ✓');