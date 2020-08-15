// DOM elements variables.
// Calendar
const element_calendar_days          = document.getElementById('calendar_days');
const element_next_button            = document.getElementById('next_month_button');
const element_previous_button        = document.getElementById('previous_month_button');
const element_current_month_and_year = document.getElementById('current_month_and_year');

element_next_button.addEventListener('click', displayNextCalendarDays);
element_previous_button.addEventListener('click', displayPreviousCalendarDays);

// Notes
const element_main_modal         = document.getElementById('main_modal');
const element_title_current_date = document.getElementById('title_current_date');
const element_modal_close_button = document.getElementById('modal_close_button');
const element_notes_list         = document.getElementById('notes_list');
const element_add_note_button    = document.getElementById('add_note_button');
const element_new_note           = document.getElementById('add_new_note');
const element_tools_new_note     = document.getElementById('tools_new_note');
const element_clear_button       = document.getElementById('clear_button');
const element_save_new_note      = document.getElementById('save_new_note');

const input_title = document.getElementById('input_title_note');
const input_note = document.getElementById('input_note');

let added_notes = ''; 
let current_date_new_note;

element_modal_close_button.addEventListener('click', closeModal);
element_add_note_button.addEventListener('click', showNewNote);
element_clear_button.addEventListener('click', clearAll);
element_save_new_note.addEventListener('click', registerNewNote);


// Variables for the functions
let current_date = new Date();

let current_day = current_date.getDay();
let current_month = current_date.getMonth() + 1; // 1 to 12;
let current_year = current_date.getFullYear();
let list_months_days = setCalendarMonthsDays(current_year);
const list_months_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

displayCalendarDays(current_month);

// Functions

// Calendar Functions
function displayPreviousCalendarDays() {
    current_month = current_month - 1;

    if (current_month <= 0) {
        current_month = 12;
        current_year -= 1;
        list_months_days = setCalendarMonthsDays(current_year);
    }

    displayCalendarDays(current_month);
    displayCurrentMonthAndYear();
}

function displayNextCalendarDays() {
    current_month = current_month + 1;
    
    if (current_month >= 13) {
        current_month = 1;
        current_year += 1;
        list_months_days = setCalendarMonthsDays(current_year);
    }

    displayCalendarDays(current_month);
    displayCurrentMonthAndYear();
}

function displayCalendarDays(current_month) {

    let month_max_day = list_months_days[current_month - 1];

    let first_week_day = new Date('2020-08-01T00:00:00');
    first_week_day = first_week_day.getDay() - 1;
    let last_week_day = new Date('2020-08-31T00:00:00');
    last_week_day = last_week_day.getDay() - 1;

    let total_rendered_days = 0;

    let result = '';
    if (first_week_day > 0) {
        let last_month = current_month - 2;
        let last_month_max_day = list_months_days[last_month];

        for (let day = last_month_max_day - first_week_day; day <= last_month_max_day; day++) {
            result += `<div class="other_month_day" onclick="displayNoteModal(${day}, ${last_month})">${day}</div>`;
            total_rendered_days++;
        }
        
    }

    for (let day = 1; day <= month_max_day; day++) {

        result += `<div onclick="displayNoteModal(${day}, ${current_month - 1})">${day}</div>`;
        total_rendered_days++;

    }

    for (let day = 1; total_rendered_days < 42; day++) {
        let next_month = current_month;
        result += `<div class="other_month_day" onclick="displayNoteModal(${day}, ${next_month})">${day}</div>`;
        total_rendered_days++;
    }

    element_calendar_days.innerHTML = result;
    
}

function displayCurrentMonthAndYear() {
    element_current_month_and_year.innerHTML = `${list_months_name[current_month - 1]} ${current_year}`;
}

function setCalendarMonthsDays(year) {
    const february_days = (year % 4) === 0 ? 29 : 28;
    const monthDays = [31, february_days, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    return monthDays;
}

// Notes functions
function displayNoteModal(selected_day, selected_month) {
    element_title_current_date.innerText = `${selected_day}/${selected_month + 1}/${current_year}`;
    element_main_modal.setAttribute('class', 'modal active');
    current_date_new_note = `${current_year}-${selected_month + 1}-${selected_day}`;

    console.log(current_date_new_note);
    
    fetch(`server/fetch_notes.php?date=${current_date_new_note}`)
    .then(response => response.json())
    .then(data => {
        
        if (data.response === null) {
            notes_list_html = `
            Oh... Looks like you don't have any notes yet!
            `
        } else {
            let content = JSON.parse(data.response.content);

            notes_list_html = `
            <ul>
                <h3 class="note-title">${content.title}</h3>
                <li>${content.text}</li>
                <a href="#" class="notes-read-more">Read More</a>
            </ul>
            `;

        }

        element_notes_list.innerHTML = notes_list_html;
    });
}

function closeModal() {
    element_main_modal.setAttribute('class', 'modal');
}

function showNewNote() {
    element_notes_list.setAttribute('class', 'notes-list hide');
    element_new_note.setAttribute('class', 'add-new-note');

    element_add_note_button.setAttribute('class', 'add-note-button hide')
    element_tools_new_note.setAttribute('class', 'tools-container');
}

function clearAll() {
    element_new_note.setAttribute('class', 'add-new-note hide');
    element_notes_list.setAttribute('class', 'notes-list');

    element_tools_new_note.setAttribute('class', 'tools-container hide');
    element_add_note_button.setAttribute('class', 'add-note-button');

    input_title.value = '';
    input_note.value = '';
}

function registerNewNote() {
    let title = input_title.value;
    let note = input_note.value;

    fetch('server/add_note.php', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(
            { 
                date: current_date_new_note,
                content: {
                    title: `${title}`,
                    text: `${note}`
                }
            }
        )
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        clearAll();
        closeModal();
    })  
    .catch(error => {
        console.error(error);
    })
}