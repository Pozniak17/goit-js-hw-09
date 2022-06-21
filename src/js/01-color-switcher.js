const refs = {
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
  body: document.querySelector('body'),
};

// console.log(refs.startBtn);
// console.log(refs.stopBtn);
let timerId = null;

refs.startBtn.addEventListener('click', handleClickStart);
refs.stopBtn.addEventListener('click', handleClickStop);

function handleClickStart() {
  timerId = setInterval(() => {
    refs.body.style.background = getRandomHexColor();
  }, 1000);
  if (timerId) {
    refs.startBtn.disabled = true;
    refs.stopBtn.disabled = false;
  }
}

function handleClickStop() {
  if (timerId) {
    refs.startBtn.disabled = false;
    refs.stopBtn.disabled = true;
  }
  clearInterval(timerId);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
