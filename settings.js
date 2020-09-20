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
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  autosize($notesTemplate);

  $submitSettingsBtn.addEventListener("click", submitSettings);

  $resetNotes.addEventListener("input", () => {
    $notesTemplate.toggleAttribute("readonly");
  });

  $notesTemplate.addEventListener("input", () => {
    $notesCurrentChars.innerHTML = $notesTemplate.value.length;
  });
}

async function submitSettings() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");

  const maxNotesChars = 999;

  // Get only 999 characters from notes before save
  if ($notesTemplate.value.length > maxNotesChars) {
    console.log("I'm not laying in bed with a fucked up");
    $notesTemplate.value = $notesTemplate.value.substring(0, maxNotesChars);
  }

  chromeSetData("notesTemplate", $notesTemplate.value);
  chromeSetData("resetNotes", $resetNotes.checked);

  alert("Settings successfully saved.");
  goBack();
}

async function restoreSettings() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  const notesTemplate = await chromeGetData("notesTemplate");
  const resetNotes = await chromeGetData("resetNotes");

  $notesTemplate.value = notesTemplate;
  $resetNotes.checked = resetNotes;

  $notesCurrentChars.innerHTML = $notesTemplate.value.length;

  if (!resetNotes) {
    $notesTemplate.setAttribute("readonly", !resetNotes);
  }

  autosize.update($notesTemplate);
}
