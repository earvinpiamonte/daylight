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
  chromeSetData("notes", $notes.value, () => {
    console.log("Saved");
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

  chromeGetData("notes", (data) => {
    $notes.value = data;
  });
}
