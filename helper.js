const copyToClipboard = (callback) => {
  const $notes = document.querySelector("#app-notes");

  $notes.select();

  document.execCommand("copy");

  $notes.blur();

  if (typeof callback == "function") {
    callback();
  }
};

const getCurrentFullDate = () => {
  const now = new Date();
  const currentDate = Intl.DateTimeFormat("en-us", {
    dateStyle: "long",
  }).format(now);

  return currentDate;
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

export { copyToClipboard, getCurrentFullDate, newLine, closeWindow, goBack };
