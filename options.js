(function () {
  restoreOptions();
  loadEventListeners();
})();

function loadEventListeners() {
  const $closeWindowBtn = document.querySelector(".app-close-window");
  const $submitOptionsBtn = document.querySelector(".app-submit-options");

  $closeWindowBtn.addEventListener("click", goBack);
  $submitOptionsBtn.addEventListener("click", submitOptions);
}

function submitOptions() {
  const $notes = document.querySelector("#app-notes");
  const $saveNotes = document.querySelector("#app-save-notes");
  const doSaveNotes = $saveNotes.checked;

  chromeSetData("notes", $notes.value);
  chromeSetData("saveNotes", doSaveNotes);

  alert("Options successfully saved.");
}

function restoreOptions() {
  const $notes = document.querySelector("#app-notes");
  const $saveNotes = document.querySelector("#app-save-notes");

  chromeGetData("notes", (data) => {
    $notes.value = data;
  });

  chromeGetData("saveNotes", (data) => {
    $saveNotes.checked = data;
  });
}

function chromeSetData(key, data, callback = null) {
  let obj = {};
  obj[key] = JSON.stringify(data);
  chrome.storage.sync.set(obj, callback);
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

function closeWindow() {
  window.close();
}

function goBack() {
  window.history.back();
}
