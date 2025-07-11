import {
  goBack,
  dialog,
  autoResizeTextarea,
  setCopyrightYear,
} from "./helper.js";
import { getChromeData, setChromeData } from "./chrome.js";
import { MAX_NOTES_CHARS, SETTINGS_KEY } from "./config.js";

(function () {
  restoreSettings();
  loadEventListeners();
  setCopyrightYear();
})();

function loadEventListeners() {
  const $submitSettingsBtn = document.querySelector(".app-submit-settings");

  const $notesTemplate = document.querySelector("#app-notes-template");
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  const $darkModeToggle = document.querySelector("#app-dark-mode");
  const $html = document.querySelector("html");

  autoResizeTextarea($notesTemplate);

  $submitSettingsBtn.addEventListener("click", submitSettings);

  $notesTemplate.addEventListener("input", () => {
    $notesCurrentChars.innerHTML = MAX_NOTES_CHARS - $notesTemplate.value.length;
  });

  $darkModeToggle.addEventListener("input", () => {
    $html.dataset.theme = $darkModeToggle.checked ? "dark" : "light";
  });
}

async function submitSettings() {
  const $notesTemplate = document.querySelector("#app-notes-template");
  const $resetNotes = document.querySelector("#app-reset-notes");
  const $darkModeToggle = document.querySelector("#app-dark-mode");

  // Get only MAX_NOTES_CHARS characters from notes before save
  if ($notesTemplate.value.length > MAX_NOTES_CHARS) {
    console.log("I'm not laying in bed with a fucked up");
    $notesTemplate.value = $notesTemplate.value.substring(0, MAX_NOTES_CHARS);
  }

  setChromeData(SETTINGS_KEY.NOTES_TEMPLATE, $notesTemplate.value);
  setChromeData(SETTINGS_KEY.RESET_NOTES, $resetNotes.checked);
  setChromeData(SETTINGS_KEY.ENABLE_DARK_MODE, $darkModeToggle.checked);

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
    ".app-notes-current-chars-count",
  );

  const notesTemplate = await getChromeData(SETTINGS_KEY.NOTES_TEMPLATE);
  const resetNotes = await getChromeData(SETTINGS_KEY.RESET_NOTES);
  const enableDarkMode = await getChromeData(SETTINGS_KEY.ENABLE_DARK_MODE);

  $notesTemplate.value = notesTemplate;
  $resetNotes.checked = resetNotes;
  $darkModeToggle.checked = enableDarkMode;

  $notesCurrentChars.innerHTML = MAX_NOTES_CHARS - $notesTemplate.value.length;

  autoResizeTextarea($notesTemplate);

  // If dark mode is enabled
  $html.dataset.theme = enableDarkMode ? "dark" : "light";
}
