const copyToClipboard = async ($selector, callback) => {
  try {
    await navigator.clipboard.writeText($selector.value);

    if (typeof callback == "function") {
      callback();
    }
  } catch (err) {
    $selector.select();
    document.execCommand("copy");
    $selector.blur();

    if (typeof callback == "function") {
      callback();
    }
  }
};

const getCurrentFullDate = () => {
  const now = new Date();
  const currentDate = Intl.DateTimeFormat("en-us", {
    dateStyle: "long",
  }).format(now);

  return currentDate;
};

const getTimestamp = () => {
  const now = new Date();
  return now.getTime();
};

const getDateTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let time = hours + ":" + minutes + " " + ampm;
  return time.toUpperCase();
};

const newLine = (multiplier = 1) => {
  let newLine = "";

  for (let index = 0; index < multiplier; index++) {
    newLine = newLine + "\n";
  }
  return newLine;
};

const closeWindow = () => {
  window.close();
};

const goBack = () => {
  window.history.back();
};

const daylightLyrics = [
  "Wide awake, getting half past zero",
  "It's getting heated so I leave the windows open (leave the windows open)",
  "Preoccupied with a late night B-roll",
  "Right now, laying here alone is heaven (here alone is heaven)",
  "And I've been a hero",
  "Helpless",
  "I'm in hell",
  "And I've cried",
  "Up and down in these hallways",
  "Blamed myself",
  "Bad luck, I don't wanna be home at midnight",
  "Sun's up, I don't really wanna fight the daylight",
  "I don't care if you moved on",
  "I'm not laying in bed with a fucked up head",
  "I'm not laying in bed with a fucked up",
  "Sun-dried on the backyard patio",
  "Drunk eyes",
  "'Cause I didn't give it a home run",
  "Yeah, yeah",
  "You're hiding on the FM radio",
  "I sing along just to sing my thoughts at someone",
  "Yeah, yeah",
  "And I've been a hero",
  "Helpless",
  "I'm in hell",
  "And I've cried",
  "Up and down in these hallways",
  "Blamed myself",
  "Bad luck, I don't wanna be home at midnight",
  "Sun's up, I don't really wanna fight the daylight",
  "I don't care if you moved on",
  "I'm not laying in bed with a fucked up head",
  "I'm not laying in bed with a fucked up",
];

const decodeVariable = (string) => {
  if (typeof string !== "string") {
    return;
  }

  const randomNumber = Math.floor(Math.random() * daylightLyrics.length);
  const today = new Date();
  const currentTime = getDateTime(today);

  string = string.replaceAll("[current_date]", getCurrentFullDate());
  string = string.replaceAll("[current_time]", currentTime);
  string = string.replaceAll("[daylight]", daylightLyrics[randomNumber]);

  return string;
};

const downloadAsTextFile = (
  contents,
  fileName = "daylight - " + getCurrentFullDate()
) => {
  if (contents.length < 1) {
    return;
  }

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(contents)
  );
  element.setAttribute("download", fileName);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const dialog = (
  options = {
    content: "",
    type: "alert",
    confirmCallback: null,
    cancelCallback: null,
  }
) => {
  const $dialog = document.querySelector("#dialog");
  const $dialogBody = document.querySelector("#dialog-body");

  const $dialogConfirm = document.querySelector("#dialog-confirm");
  const $dialogCancel = document.querySelector("#dialog-cancel");

  showElement($dialogCancel);

  if (options.type == "alert") {
    hideElement($dialogCancel);
  }

  const confirmHandler = () => {
    console.log("Confirmed.");

    if (typeof options.confirmCallback == "function") {
      options.confirmCallback();
    }

    removeDialogActionsEventListeners();
  };

  const cancelHandler = () => {
    console.log("Cancelled.");

    if (typeof options.cancelCallback == "function") {
      options.cancelCallback();
    }

    removeDialogActionsEventListeners();
  };

  const removeDialogActionsEventListeners = () => {
    $dialogConfirm.removeEventListener("click", confirmHandler, false);
    $dialogCancel.removeEventListener("click", cancelHandler, false);
  };

  $dialogBody.innerHTML = options.content;
  $dialog.showModal();

  $dialogConfirm.addEventListener("click", confirmHandler);
  $dialogCancel.addEventListener("click", cancelHandler);
};

const hideElement = ($element) => {
  $element.style.display = "none";
};

const showElement = ($element) => {
  $element.style.display = "";
};

const resizeTextareaHandler = (e) => {
  const $this = e.target ?? e;

  $this.style.height = `auto`;
  $this.style.height = `${$this.scrollHeight}px`;
  $this.style.resize = `none`;
};

const autoResizeTextarea = ($textarea) => {
  resizeTextareaHandler($textarea);

  $textarea.addEventListener("input", resizeTextareaHandler, false);
};

export {
  copyToClipboard,
  getCurrentFullDate,
  getTimestamp,
  newLine,
  closeWindow,
  goBack,
  decodeVariable,
  downloadAsTextFile,
  dialog,
  autoResizeTextarea,
};
