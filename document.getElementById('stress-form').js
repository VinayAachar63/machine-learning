document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.getElementById('chatbot');
    const chatInput = document.getElementById('chat-input');
    const inputs = {};

    const questions = [
        { key: 'name', question: 'Please enter your name:', validator: val => isNaN(val), errorMessage: 'Names cannot contain numbers.' },
        { key: 'age', question: 'Please enter your age:', validator: val => !isNaN(val) && val > 0, errorMessage: 'Age must be a positive number.' },
        { key: 'heartRate', question: 'What is your heart rate (bpm)?', validator: val => !isNaN(val) && val > 0, errorMessage: 'Heart rate must be a positive number.' }
    ];

    let currentQuestionIndex = 0;

    function addMessage(message, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
        msgDiv.textContent = message;
        chatbot.appendChild(msgDiv);
        chatbot.scrollTop = chatbot.scrollHeight; // Scroll to the bottom
    }

    function speakMessage(message) {
        const utterance = new SpeechSynthesisUtterance(message);
        const voices = speechSynthesis.getVoices();

        if (!voices.length) {
            speechSynthesis.onvoiceschanged = () => {
                const femaleVoice = speechSynthesis.getVoices().find(voice => voice.name.includes('Female'));
                if (femaleVoice) utterance.voice = femaleVoice;
                speechSynthesis.speak(utterance);
            };
        } else {
            const femaleVoice = voices.find(voice => voice.name.includes('Female'));
            if (femaleVoice) utterance.voice = femaleVoice;
            speechSynthesis.speak(utterance);
        }
    }

    function handleResponse(response) {
        const question = questions[currentQuestionIndex];
        if (question.validator(response)) {
            inputs[question.key] = isNaN(response) ? response : parseFloat(response);
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                const nextQuestion = questions[currentQuestionIndex].question;
                addMessage(nextQuestion, false);
                speakMessage(nextQuestion);
            } else {
                addMessage('Thank you! Prediction will now begin.', false);
                speakMessage('Thank you! Prediction will now begin.');
            }
        } else {
            addMessage(question.errorMessage, false);
            speakMessage(question.errorMessage);
        }
    }

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            const userMessage = chatInput.value.trim();
            addMessage(userMessage, true);
            handleResponse(userMessage);
            chatInput.value = '';
        }
    });

    // Start the conversation
    const initialMessage = questions[currentQuestionIndex].question;
    addMessage(initialMessage, false);
    speakMessage(initialMessage);
});
const stressQuestions = [
    { key: 'stress1', question: 'In the last month, how often have you been upset because of something that happened unexpectedly? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress2', question: 'In the last month, how often have you felt that you were unable to control the important things in your life? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress3', question: 'In the last month, how often have you felt nervous and stressed? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress4', question: 'In the last month, how often have you felt confident about your ability to handle your personal problems? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress5', question: 'In the last month, how often have you felt that things were going your way? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress6', question: 'In the last month, how often have you found that you could not cope with all the things that you had to do? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress7', question: 'In the last month, how often have you been able to control irritations in your life? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress8', question: 'In the last month, how often have you felt that you were on top of things? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress9', question: 'In the last month, how often have you been angered because of things that happened that were outside of your control? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' },
    { key: 'stress10', question: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them? (0 - never, 1 - almost never, 2 - sometimes, 3 - fairly often, 4 - very often)' }
];

function validateInput(val) {
    return !isNaN(val) && val >= 0 && val <= 4;
}

function assessStress(responses) {
    let totalScore = responses.reduce((sum, val) => sum + val, 0);
    
    if (totalScore >= 0 && totalScore <= 13) {
        return "Low Stress";
    } else if (totalScore >= 14 && totalScore <= 26) {
        return "Moderate Stress";
    } else if (totalScore >= 27 && totalScore <= 40) {
        return "High Perceived Stress";
    } else {
        return "Invalid Score";
    }
}

// Example usage
let userResponses = [3, 2, 4, 1, 0, 2, 3, 4, 1, 2]; // Replace with actual user input
if (userResponses.every(validateInput)) {
    let result = assessStress(userResponses);
    console.log(`Total Score: ${userResponses.reduce((sum,val) => sum + val)} | Stress Level: ${result}`);
} else {
    console.log("Invalid input detected. Please ensure all answers are between 0 and 4.");
}
addMessage(finalMessage, false);
document.getElementById('final-result').innerText = finalMessage;

const healthQuestions = [
    {
        key: 'heartRate',
        question: 'Could you please enter your heart rate (bpm):',
        validator: val => !isNaN(val) && val > 0 && val <= 999 // Ensures value is a number, greater than 0 and up to 3 digits
    },
    {
        key: 'temperature',
        question: 'Could you please enter your body temperature (°F)?',
        validator: val => !isNaN(val) && val > 0 && val <= 999 // Ensures value is a number, greater than 0 and up to 3 digits
    },
    {
        key: 'systolic',
        question: 'Could you please enter your systolic blood pressure:',
        validator: val => !isNaN(val) && val > 0 && val <= 999 // Ensures value is a number, greater than 0 and up to 3 digits
    },
    {
        key: 'diastolic',
        question: 'Could you please enter your diastolic blood pressure:',
        validator: val => !isNaN(val) && val > 0 && val <= 999 // Ensures value is a number, greater than 0 and up to 3 digits
    }
];

// Example function to validate input
function validateInput(key, value) {
    const question = healthQuestions.find(q => q.key === key);
    if (question) {
        return question.validator(value);
    }
    return false; // If question not found, return false
}

// Example usage:
const userInput = {
    heartRate: 75,
    temperature: 98,
    systolic: 120,
    diastolic: 80
};

for (const [key, value] of Object.entries(userInput)) {
    if (!validateInput(key, value)) {
        console.log(`Invalid input for ${key}: ${value}`);
    } else {
        console.log(`${key} is valid.`);
    }
}
[
    {
        key: 'heartRate',
        question: 'Could you please enter your heart rate (bpm):',
        validator: val => !isNaN(val) && val > 0 && val <= 999
    },
    {
        key: 'temperature',
        question: 'Could you please enter your body temperature (°F)?',
        validator: val => !isNaN(val) && val > 0 && val <= 999
    },
    {
        key: 'systolic',
        question: 'Could you please enter your systolic blood pressure:',
        validator: val => !isNaN(val) && val > 0 && val <= 999
    },
    {
        key: 'diastolic',
        question: 'Could you please enter your diastolic blood pressure:',
        validator: val => !isNaN(val) && val > 0 && val <= 999
    }
];
