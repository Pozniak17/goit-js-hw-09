// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix';

// const refs = {
//   input: document.querySelector('#datetime-picker'),
//   startBtn: document.querySelector('button[data-start]'),
//   days: document.querySelector('span[data-days]'),
//   hours: document.querySelector('span[data-hours]'),
//   minutes: document.querySelector('span[data-minutes]'),
//   seconds: document.querySelector('span[data-seconds]'),
//   output: document.querySelector('.timer'),
// };

// refs.output.style.display = 'flex';

// const isDisabled = true;
// refs.startBtn.disabled = isDisabled;
// let intervalId = null;

// const options = {
//   enableTime: true,
//   time_24hr: true,
//   defaultDate: new Date(),
//   minuteIncrement: 1,
//   onClose(selectedDates) {
//     dateCheck(selectedDates[0]);
//   },
// };

// const timePicker = flatpickr(refs.input, options);

// function dateCheck(date) {
//   const currentDate = new Date();

//   if (currentDate > date) {
//     Notify.failure('Please choose date in the future');
//   } else {
//     refs.startBtn.disabled = !isDisabled;
//   }
// }

// refs.startBtn.addEventListener('click', onStart);

// function onStart() {
//   refs.startBtn.disabled = isDisabled;
//   refs.input.disabled = isDisabled;
//   countdown();
// }

// function countdown() {
//   intervalId = setInterval(() => {
//     const diff = timePicker.selectedDates[0] - Date.now();
//     const convertedTime = convertMs(timePicker.selectedDates[0] - Date.now());
//     updateTimerValues(convertedTime);

//     if (diff < 1000) {
//       clearInterval(intervalId);

//       Notify.success('Ура!');
//     }
//   }, 1000);
// }

// function addZero(value) {
//   return String(value).padStart(2, '0');
// }

// function convertMs(ms) {
//   // Number of milliseconds per unit of time
//   const second = 1000;
//   const minute = second * 60;
//   const hour = minute * 60;
//   const day = hour * 24;

//   // Remaining days
//   const days = Math.floor(ms / day);
//   // Remaining hours
//   const hours = Math.floor((ms % day) / hour);
//   // Remaining minutes
//   const minutes = Math.floor(((ms % day) % hour) / minute);
//   // Remaining seconds
//   const seconds = Math.floor((((ms % day) % hour) % minute) / second);

//   return { days, hours, minutes, seconds };
// }

// function updateTimerValues({ days, hours, minutes, seconds }) {
//   refs.days.textContent = addZero(days);
//   refs.hours.textContent = addZero(hours);
//   refs.minutes.textContent = addZero(minutes);
//   refs.seconds.textContent = addZero(seconds);
// }
const refs = {
  buttonStart: document.querySelector('[data-start]'),
  input: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.buttonStart.setAttribute('disabled', 'disabled');

let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0].getTime();

    if (selectedDate < Date.now()) {
      return Notify.failure('Please choose a date in the future');
    }

    Notify.success('Date is valid, click to Start button');
    refs.buttonStart.removeAttribute('disabled');
  },
};

flatpickr('#datetime-picker', options);

class Timer {
  constructor({ onShow }) {
    this.delay = 1000;
    this.intervalID = null;
    this.onShow = onShow;
  }

  start() {
    this.intervalID = setInterval(() => {
      if (selectedDate - Date.now() <= 0) {
        clearInterval(this.intervalID);
        refs.input.removeAttribute('disabled');
        return Report.success('SALE STARTED!!!', 'LET`S GO', 'Okay');
      }
      const deltaTime = selectedDate - Date.now();
      const formatedDate = this.convertMs(deltaTime);
      this.onShow(formatedDate);
    }, this.delay);

    refs.buttonStart.setAttribute('disabled', 'disabled');
    refs.input.setAttribute('disabled', 'disabled');
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }
}

const timer = new Timer({
  onShow: updateTimerInterface,
});

refs.buttonStart.addEventListener('click', timer.start.bind(timer));

function updateTimerInterface({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minutes.textContent = `${minutes}`;
  refs.seconds.textContent = `${seconds}`;
}
