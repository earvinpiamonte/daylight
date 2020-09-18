import { goBack } from "./helper.js";
import { chromeGetData, chromeSetData } from "./chrome.js";

(function () {
  restoreOptions();
  loadEventListeners();
})();

function loadEventListeners() {
  const $closeWindowBtn = document.querySelector(".app-close-window");
  const $submitOptionsBtn = document.querySelector(".app-submit-options");

  const $resetNotes = document.querySelector("#app-reset-notes");
  const $notesTemplate = document.querySelector("#app-notes-template");

  $closeWindowBtn.addEventListener("click", goBack);
  $submitOptionsBtn.addEventListener("click", submitOptions);

  /* $resetNotes.addEventListener("input", () => {
    $notesTemplate.toggleAttribute("readonly");
  }); */
}

function submitOptions() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");

  chromeSetData("notesTemplate", $notesTemplate.value);
  chromeSetData("resetNotes", $resetNotes.checked);

  alert("Options successfully saved.");
}

function restoreOptions() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");

  chromeGetData("notesTemplate", (data) => {
    $notesTemplate.value = data;
  });

  chromeGetData("resetNotes", (data) => {
    $resetNotes.checked = data;

    /* if (!$resetNotes.checked) {
      $notesTemplate.setAttribute("readonly", $resetNotes.checked);
    } */
  });
}
