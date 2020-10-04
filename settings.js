import { goBack, dialog } from "./helper.js";
import { chromeGetData, chromeSetData } from "./chrome.js";

const maxNotesChars = 999;

(function () {
  restoreSettings();
  loadEventListeners();
})();

function loadEventListeners() {
  const $submitSettingsBtn = document.querySelector(".app-submit-settings");

  const $notesTemplate = document.querySelector("#app-notes-template");
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  const $darkModeToggle = document.querySelector("#app-dark-mode");
  const $html = document.querySelector("html");

  autosize($notesTemplate);

  $submitSettingsBtn.addEventListener("click", submitSettings);

  $notesTemplate.addEventListener("input", () => {
    $notesCurrentChars.innerHTML = maxNotesChars - $notesTemplate.value.length;
  });

  $darkModeToggle.addEventListener("input", () => {
    $html.dataset.theme = $darkModeToggle.checked ? "dark" : "light";
  });
}

async function submitSettings() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");
  const $darkModeToggle = document.querySelector("#app-dark-mode");

  // Get only 999 characters from notes before save
  if ($notesTemplate.value.length > maxNotesChars) {
    console.log("I'm not laying in bed with a fucked up");
    $notesTemplate.value = $notesTemplate.value.substring(0, maxNotesChars);
  }

  chromeSetData("notesTemplate", $notesTemplate.value);
  chromeSetData("resetNotes", $resetNotes.checked);
  chromeSetData("enableDarkMode", $darkModeToggle.checked);

  dialog({
    content: "Your settings have been saved.",
    type: "alert",
    confirmCallback: () => {
      goBack();
    },
  });
}

async function restoreSettings() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");
  const $darkModeToggle = document.querySelector("#app-dark-mode");
  const $html = document.querySelector("html");
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  const notesTemplate = await chromeGetData("notesTemplate");
  const resetNotes = await chromeGetData("resetNotes");
  const enableDarkMode = await chromeGetData("enableDarkMode");

  $notesTemplate.value = notesTemplate;
  $resetNotes.checked = resetNotes;
  $darkModeToggle.checked = enableDarkMode;

  $notesCurrentChars.innerHTML = maxNotesChars - $notesTemplate.value.length;

  autosize.update($notesTemplate);

  // If dark mode is enabled
  $html.dataset.theme = enableDarkMode ? "dark" : "light";
}
