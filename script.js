const createHealthTracker = () => {
    let history = JSON.parse(localStorage.getItem('healthHistory')) || [];

    return {
        addEntry: (entry) => {
            history = [...history, entry];
            localStorage.setItem('healthHistory', JSON.stringify(history));
        },
        getHistory: () => history
    };
};

const tracker = createHealthTracker();

const updateScreen = () => {
    const historyList = document.getElementById('meal-history');
    const intakeEl = document.getElementById('calorie-intake');
    const burnedEl = document.getElementById('calories-burned');
    const netEl = document.getElementById('net-calories');

    const entries = tracker.getHistory();

    historyList.innerHTML = "";

    entries.forEach(item => {
        const li = document.createElement('li');
        li.className = item.type === 'food' ? 'meal-item' : 'burn-item';

        const timestamp = new Date(item.id).toLocaleString();

        li.innerHTML = `
            <div>
                <span>${item.name}</span>
                <small style="display:block; color:#999">${timestamp}</small>
            </div>
            <strong>${item.calories} kcal</strong>
            <button onclick="deleteEntry(${item.id})">×</button>
        `;
        historyList.appendChild(li);
    });

    const totalIntake = entries
        .filter(e => e.type === 'food')
        .reduce((total, item) => total + item.calories, 0);

    const totalBurned = entries
        .filter(e => e.type === 'burn')
        .reduce((total, item) => total + item.calories, 0);

    const netCalories = totalIntake - totalBurned;

    intakeEl.innerText = `${totalIntake} kcal`;
    burnedEl.innerText = `${totalBurned} kcal`;
    netEl.innerText = `${netCalories} kcal`;
};

const deleteEntry = (id) => {
    const entries = tracker.getHistory().filter(e => e.id !== id);
    localStorage.setItem('healthHistory', JSON.stringify(entries));
    location.reload();
};

const mealForm = document.getElementById('meal-form');
mealForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('meal-name');
    const calInput = document.getElementById('meal-calories');

    if (calInput.value <= 0) {
        alert('Calories must be greater than 0');
        return;
    }

    const newEntry = {
        id: Date.now(),
        name: nameInput.value,
        calories: Number(calInput.value),
        type: 'food'
    };

    tracker.addEntry(newEntry);
    updateScreen();
    mealForm.reset();
});

const burnForm = document.getElementById('burn-form');
burnForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const calInput = document.getElementById('burn-calories');
    const noteInput = document.getElementById('burn-calories-note');

    const newEntry = {
        id: Date.now(),
        name: noteInput.value,
        calories: Number(calInput.value),
        type: 'burn'
    };

    tracker.addEntry(newEntry);
    updateScreen();
    burnForm.reset();
});

updateScreen();