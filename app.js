/* I don't care if you moved on */

import { copyToClipboard } from "./helper.js";
import { chromeGetData, chromeSetData } from "./chrome.js";

(function () {
  console.info("I'm not laying in bed with a fucked up head");

  loadUserInfo();
  restoreSettings();
  loadEventListeners();
})();

function loadEventListeners() {
  const $copyToClipboard = document.querySelector(".app-copy-to-clipboard");
  const $notes = document.querySelector("#app-notes");
  const $openSettingsBtn = document.querySelector(".app-open-settings");
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  const saveTimeout = 500;
  let typingTimer;

  autosize($notes);

  $copyToClipboard.addEventListener("click", function () {
    copyToClipboard(document.querySelector("#app-notes"), function () {
      console.log("Copied!");
    });
  });

  $notes.addEventListener("input", () => {
    clearInterval(typingTimer);
    typingTimer = setTimeout(saveNotes, saveTimeout);

    $notesCurrentChars.innerHTML = $notes.value.length;
  });

  $openSettingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage
      ? chrome.runtime.openOptionsPage()
      : window.open(chrome.runtime.getURL("options.html"));
  });
}

async function saveNotes() {
  const $notes = document.querySelector("#app-notes");
  const maxNotesChars = 999;

  // Do not save if notes length is greater than 999
  if ($notes.value.length > maxNotesChars) {
    console.log("I'm not laying in bed with a fucked up");
    return;
  }

  let now = new Date();

  const notesSaved = await chromeSetData("notes", $notes.value);
  const lastUpdated = await chromeSetData("lastUpdated", now);

  if (notesSaved && lastUpdated) {
    console.log("Notes saved.");
  }
}

function loadUserInfo() {
  chrome.identity.getProfileUserInfo(function (userInfo) {
    console.log(userInfo);
    document.querySelector(".app-user").innerHTML = userInfo.email;
  });
}

async function restoreSettings() {
  const $notes = document.querySelector("#app-notes");
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  let today = new Date();

  const resetNotes = await chromeGetData("resetNotes", false);
  const lastUpdated = await chromeGetData("lastUpdated", today);
  const notesTemplate = await chromeGetData("notesTemplate", "");
  const notes = await chromeGetData("notes", "");

  const lastUpdatedPresise = new Date(lastUpdated);

  today.setHours(0, 0, 0, 0); // Set today's time to 0

  const withinToday = lastUpdatedPresise > today;

  // Check if automatic reset notes is enabled
  if (resetNotes) {
    console.log("Reset notes is enabled.");

    // If last updated is not within today -> load template
    if (!withinToday) {
      $notes.value = notesTemplate;
      $notesCurrentChars.innerHTML = $notes.value.length;

      autosize.update($notes);
      saveNotes(); // Save currently loaded template as notes
      return;
    }

    // Else if last updated is within today -> load recently saved notes
    $notes.value = notes;
    $notesCurrentChars.innerHTML = $notes.value.length;

    autosize.update($notes);
    return;
  }

  console.log("Reset notes is disabled. Displaying recently saved notes.");

  // If automatic reset of notes is disabled -> load recently saved notes
  $notes.value = notes;
  $notesCurrentChars.innerHTML = $notes.value.length;

  autosize.update($notes);
}
