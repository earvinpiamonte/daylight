/* I don't care if you moved on */

import { copyToClipboard, getCurrentFullDate, newLine } from "./helper.js";
import { chromeGetData } from "./chrome.js";

(function () {
  console.info("I'm not laying in bed with a fucked up head");

  loadUserInfo();
  restoreOptions();
  loadEventListeners();
})();

function loadEventListeners() {
  const $copyToClipboard = document.querySelector(".app-copy-to-clipboard");

  $copyToClipboard.addEventListener("click", function () {
    const notes = document.querySelector("#app-notes").value;

    copyToClipboard(function () {
      console.log("Copied!");
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

  chromeGetData("notes", (data) => {
    $notes.value = data;
  });
}
