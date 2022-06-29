// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix';
import { Report } from 'notiflix/build/notiflix-report-aio';

const refs = {
  buttonStart: document.querySelector('[data-start]'),
  input: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  timer: document.querySelector('.timer'),
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

    Report.success('Date is valid, click to Start button');
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
        return Notify.success('SALE STARTED!!!', 'LET`S GO', 'Okay');
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
