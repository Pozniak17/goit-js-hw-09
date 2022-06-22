// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

refs.startBtn.disabled = true;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    dateCheck(selectedDates[0]);
  },
};

const timePicker = flatpickr(refs.input, options);

function dateCheck(date) {
  const currentDate = new Date();

  if (currentDate > date) {
    Notify.failure('Please choose date in the future');
  } else {
    refs.startBtn.disabled = false;
  }
}

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  countdown();
}

function addZero(value) {
  return String(value).padStart(2, '0');
}

function countdown() {
  intervalId = setInterval(() => {
    const convertedTime = convertMs(timePicker.selectedDates[0] - Date.now());
    updateTimerValues(convertedTime);
  }, 1000);
}

function updateTimerValues({ days, hours, minutes, seconds }) {
  refs.days.textContent = addZero(days);
  refs.hours.textContent = addZero(hours);
  refs.minutes.textContent = addZero(minutes);
  refs.seconds.textContent = addZero(seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
