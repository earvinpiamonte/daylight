import { goBack } from "./helper.js";
import { chromeGetData, chromeSetData } from "./chrome.js";

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
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $saveNotes = document.querySelector("#app-save-notes");
  const doSaveNotes = $saveNotes.checked;

  chromeSetData("notesTemplate", $notesTemplate.value);
  chromeSetData("saveNotes", doSaveNotes);

  alert("Options successfully saved.");
}

function restoreOptions() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $saveNotes = document.querySelector("#app-save-notes");

  chromeGetData("notesTemplate", (data) => {
    $notesTemplate.value = data;
  });

  chromeGetData("saveNotes", (data) => {
    $saveNotes.checked = data;
  });
}
