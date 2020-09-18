/* I don't care if you moved on */

import {
  copyToClipboard,
  getCurrentFullDate,
  getTimestamp,
  newLine,
} from "./helper.js";
import { chromeGetData, chromeSetData } from "./chrome.js";

(function () {
  console.info("I'm not laying in bed with a fucked up head");

  loadUserInfo();
  restoreOptions();
  loadEventListeners();
})();

function loadEventListeners() {
  const $copyToClipboard = document.querySelector(".app-copy-to-clipboard");
  const $notes = document.querySelector("#app-notes");

  $copyToClipboard.addEventListener("click", function () {
    copyToClipboard(document.querySelector("#app-notes"), function () {
      console.log("Copied!");
    });
  });

  $notes.addEventListener("keyup", (event) => {
    saveNotes();
  });

  window.addEventListener("cut", () => {
    setTimeout(() => {
      saveNotes();
    }, 300);
  });
}

function saveNotes() {
  const $notes = document.querySelector("#app-notes");

  let now = new Date();

  chromeSetData("notes", $notes.value, () => {
    chromeSetData("lastUpdated", now, () => {
      console.log("Saved: " + now);
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

function restoreOptions() {
  const $notes = document.querySelector("#app-notes");

  chromeGetData("resetNotes", (resetNotes) => {
    if (resetNotes) {
      console.log("Reset notes is enabled.");
      chromeGetData("lastUpdated", (lastUpdated) => {
        let today = new Date();
        today.setHours(0, 0, 0, 0); // Set today's time to 0

        const lastUpdatedPresise = new Date(lastUpdated);
        const isToday = lastUpdatedPresise > today;

        // If last updated is not today, then reset notes to template
        if (!isToday) {
          chromeGetData("notesTemplate", (data) => {
            $notes.value = data;
            saveNotes();
          });

          return;
        }

        // Else just get the previously saved notes
        chromeGetData("notes", (data) => {
          $notes.value = data;
        });
      });

      return;
    }

    // If resetNotes is not enabled just get the previously saved notes
    chromeGetData("notes", (data) => {
      console.log("Reset notes is disabled. Displaying recently saved notes.");
      $notes.value = data;
    });
  });
}
