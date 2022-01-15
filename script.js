const weekLtDays = ['pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis', 'sekmadienis']
const calendar = document.getElementById('calendar');
const title = document.getElementById('title');
const events = document.getElementById('events')
let timeNavigation = 0;
let savedEvents = JSON.parse(localStorage.getItem('events')) || [];
let selected = null;
let selectedEvent = null;
const eventInput = document.getElementById('eventInput');

const onLoad = () => {
    const date = new Date();

    if (timeNavigation !== 0) {
        date.setMonth(new Date().getMonth() + timeNavigation)
    }

    calendar.innerHTML = '';
    title.innerHTML = '';
    events.innerHTML = '';
    weekLtDays.map(day => {
        let weekday = document.createElement('div');
        weekday.innerText = day;
        weekday.classList.add('weekday');
        calendar.appendChild(weekday);
    })

    const currentMonthDay = date.getDate()
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).toLocaleDateString('lt-LT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const blankDays = weekLtDays.indexOf(firstDayOfMonth.split(', ')[1]);

    let titleText = document.createElement('h2');
    titleText.innerText = firstDayOfMonth;
    title.appendChild(titleText);

    const openEvents = (dayElementDate, dayElement, blankDays) => {
        events.innerHTML= '';
        if(!dayElement) return;

        let activeDay = dayElementDate.split('-')[2];
        selected = dayElementDate;
        let children = calendar.children;
        for (let i=7 + blankDays; i < children.length; i++) {
            if (children[i].firstChild.textContent === activeDay) {
                children[i].classList.add('active');
            } else {
                children[i].classList.remove('active');
            }
        }
        displaySavedEvents();
    }

    for (let i = 1; i <= blankDays + daysInMonth; i++) {
        let dayElementDate = `${year}-${month + 1}-${i - blankDays}`;
        let dayElement = document.createElement('div');
        if (i <= blankDays) {
            dayElement.classList.add('day', 'blank');
        } else {
            let dayNumber = document.createElement('p');
            dayNumber.innerText = i - blankDays;
            dayElement.appendChild(dayNumber);
            if (i - blankDays === currentMonthDay && timeNavigation === 0) {
                dayElement.classList.add('current');
            }
            const eventsForDayElement = savedEvents.filter(event => event.date === dayElementDate);
            if (eventsForDayElement.length > 0) {
                eventsForDayElement.forEach(eventForDay => {
                    const eventOnCalendar = document.createElement('p');
                    eventOnCalendar.innerText = eventForDay.event;
                    dayElement.appendChild(eventOnCalendar);
                })
            }
            dayElement.classList.add('day', 'normal');
            dayElement.addEventListener('click', () => openEvents(dayElementDate, dayElement, blankDays));
        }
        calendar.appendChild(dayElement);
    }
}

const setSelectEvent = (selectedDayEvent) => {
    if(selectedEvent) {
        selectedEvent.classList.remove('active');
    }
    selectedEvent = selectedDayEvent;
    selectedDayEvent.classList.add('active');
}

const displaySavedEvents = () => {
    savedEvents.map(event => {
        if (event.date == selected) {
            let selectedDayEvent = document.createElement('p');
            selectedDayEvent.innerText = event.event;
            selectedDayEvent.addEventListener('click', () => setSelectEvent(selectedDayEvent));
            events.appendChild(selectedDayEvent);
        }
    })
}

const previousMonth = () => {
    timeNavigation--;
    onLoad();
}

const nextMonth = () => {
    timeNavigation++;
    onLoad();
}

const addEvent = () => {
    if (!eventInput.value) return;
    let newEvent = {
        date: selected,
        event: eventInput.value
    }
    savedEvents.push(newEvent);
    localStorage.setItem('events', JSON.stringify(savedEvents));
    eventInput.value = '';
    displaySavedEvents();
}

const deleteEvent = () => {
    if(!selectedEvent) return;

    savedEvents.map((event, i) => {
        if (event.date === selected && event.event.includes(selectedEvent.textContent)) {
            savedEvents.splice(i, 1);
        }
        localStorage.setItem('events', JSON.stringify(savedEvents));
    })
    onLoad();
}

const cancelEvents = () => {
    events.innerHTML = '';
    selected = null;
}

const eventListeners = () => {
    document.getElementById('previousMonth').addEventListener('click', previousMonth);
    document.getElementById('nextMonth').addEventListener('click', nextMonth);
    document.getElementById('addEvent').addEventListener('click', addEvent);
    document.getElementById('deleteEvent').addEventListener('click', deleteEvent);
    document.getElementById('cancelEvents').addEventListener('click', cancelEvents);
}

onLoad();
eventListeners();