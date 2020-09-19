import { goBack } from "./helper.js";
import { chromeGetData, chromeSetData } from "./chrome.js";

(function () {
  restoreSettings();
  loadEventListeners();
})();

function loadEventListeners() {
  const $submitSettingsBtn = document.querySelector(".app-submit-settings");

  const $resetNotes = document.querySelector("#app-reset-notes");
  const $notesTemplate = document.querySelector("#app-notes-template");

  $submitSettingsBtn.addEventListener("click", submitSettings);

  $resetNotes.addEventListener("input", () => {
    $notesTemplate.toggleAttribute("readonly");
  });
}

async function submitSettings() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");

  chromeSetData("notesTemplate", $notesTemplate.value);
  chromeSetData("resetNotes", $resetNotes.checked);

  alert("Settings successfully saved.");
  goBack();
}

async function restoreSettings() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");

  const notesTemplate = await chromeGetData("notesTemplate");
  const resetNotes = await chromeGetData("resetNotes");

  $notesTemplate.value = notesTemplate;
  $resetNotes.checked = resetNotes;

  if (!resetNotes) {
    $notesTemplate.setAttribute("readonly", !resetNotes);
  }
}
