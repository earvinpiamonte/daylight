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

  $copyToClipboard.addEventListener("click", function () {
    copyToClipboard(document.querySelector("#app-notes"), function () {
      console.log("Copied!");
    });
  });

  $notes.addEventListener("keyup", () => {
    saveNotes();
  });

  window.addEventListener("cut", () => {
    setTimeout(() => {
      saveNotes();
    }, 300);
  });

  $openSettingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage
      ? chrome.runtime.openOptionsPage()
      : window.open(chrome.runtime.getURL("options.html"));
  });
}

async function saveNotes() {
  const $notes = document.querySelector("#app-notes");

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
      saveNotes(); // Save currently loaded template as notes
      return;
    }

    // Else if last updated is within today -> load recently saved notes
    $notes.value = notes;
    return;
  }

  console.log("Reset notes is disabled. Displaying recently saved notes.");

  // If automatic reset of notes is disabled -> load recently saved notes
  $notes.value = notes;
}
