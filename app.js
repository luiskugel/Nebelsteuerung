const fetch = require("node-fetch");

async function turnOn() {
  await fetch("http://192.168.1.196/relay/0?turn=on");
  console.log("ON");
}

async function turnOff() {
  await fetch("http://192.168.1.196/relay/0?turn=off");
  console.log("OFF");
}

async function getPower() {
  const response = await fetch("http://192.168.1.196/meter/0");
  const result = await response.json();
  return result.power;
}

// ----------------------- CONSTANTS -----------------------

const POWER_THRESHOLD = 300;
const CYCLE_TIME = 180;
const ACTIVE_TIME = 5;

// -------------------- MAIN FUNCTION --------------------

let activeSecsInCycle = 0;
let active = false;

setInterval(() => {
  activeSecsInCycle = 0;
}, CYCLE_TIME * 1000);

setInterval(async () => {
  const power = await getPower();
  console.log({ power, active, activeSecsInCycle });
  if (power < POWER_THRESHOLD && active) {
    activeSecsInCycle++;
  }
  if (activeSecsInCycle > ACTIVE_TIME && active) {
    turnOff();
    active = false;
  }
  if (activeSecsInCycle < ACTIVE_TIME && !active) {
    turnOn();
    active = true;
  }
}, 1000);
