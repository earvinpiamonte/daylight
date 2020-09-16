/* I don't care if you moved on */

(function () {
  console.info("I'm not laying in bed with a fucked up head");

  loadUserInfo();
  restoreOptions();
  loadEventListeners();
})();

function loadEventListeners() {
  const $copyToClipboard = document.querySelector(".app-copy-to-clipboard");

  $copyToClipboard.addEventListener("click", function () {
    const notes = document.querySelector("#app-notes").value;

    copyToClipboard(notes, function () {
      console.log("Copied!");
    });
  });
}

function loadUserInfo() {
  chrome.identity.getProfileUserInfo(function (userInfo) {
    console.log(userInfo);
    document.querySelector(".app-user").innerHTML = userInfo.email;
  });
}

function loadNotes() {
  document.querySelector("#app-notes").value =
    getCurrentFullDate() + newLine(2);
}

function getCurrentFullDate() {
  const now = new Date();
  const currentDate = Intl.DateTimeFormat("en-us", {
    dateStyle: "long",
  }).format(now);

  return currentDate;
}

function newLine(multiplier = 1) {
  let newLine = "";

  for (let index = 0; index < multiplier; index++) {
    newLine = newLine + "\n";
  }
  return newLine;
}

function copyToClipboard(textToCopy, callback) {
  let temporaryInput = document.createElement("input");

  temporaryInput.value = textToCopy;

  temporaryInput.setAttribute("readonly", "");

  temporaryInput.style = { display: "none" };

  document.body.appendChild(temporaryInput);

  temporaryInput.select();

  document.execCommand("copy");

  document.body.removeChild(temporaryInput);

  temporaryInput = undefined;

  if (typeof callback == "function") {
    callback();
  }
}

function restoreOptions() {
  const $notes = document.querySelector("#app-notes");

  chromeGetData("notes", (data) => {
    $notes.value = data;
  });
}

function chromeGetData(key, callback) {
  chrome.storage.sync.get(key, function (result) {
    let data = null;
    if (result[key]) {
      data = JSON.parse(result[key]);
    }

    callback(data);
  });
}
