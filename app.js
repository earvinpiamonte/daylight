/* I don't care if you moved on */

import {
  copyToClipboard,
  decodeVariable,
  downloadAsTextFile,
  dialog,
} from "./helper.js";
import { chromeGetData, chromeSetData } from "./chrome.js";

const maxNotesChars = 999;

(function () {
  console.info("I'm not laying in bed with a fucked up head");

  restoreSettings();
  loadEventListeners();
})();

function loadEventListeners() {
  const $copyToClipboard = document.querySelector(".app-copy-to-clipboard");
  const $notes = document.querySelector("#app-notes");
  const $openSettingsBtn = document.querySelector(".app-open-settings");
  const $downloadTextFile = document.querySelector(
    ".app-download-as-text-file"
  );
  const $useTemplateBtn = document.querySelector(".app-trigger-use-template");
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  const $dialog = document.querySelector("#dialog");
  const $dialogTrigger = document.querySelector(".app-dialog-trigger");

  const saveTimeout = 500;
  let typingTimer;

  autosize($notes);

  $copyToClipboard.addEventListener("click", function () {
    if ($notes.value.length < 1) {
      dialog({
        content:
          "There's nothing to copy at the moment. Please write something at least.",
        type: "alert",
      });
      return;
    }
    copyToClipboard($notes, function () {
      dialog({
        content: "Copied, you're all set to send it anywhere you want!",
        type: "alert",
      });
      console.log("Copied!");
    });
  });

  $notes.addEventListener("input", () => {
    clearInterval(typingTimer);
    typingTimer = setTimeout(saveNotes, saveTimeout);

    $notesCurrentChars.innerHTML = maxNotesChars - $notes.value.length;
  });

  $openSettingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage
      ? chrome.runtime.openOptionsPage()
      : window.open(chrome.runtime.getURL("options.html"));
  });

  $useTemplateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    dialog({
      content: `
          Are you sure you want to use your template for your notes now? This will override your current notes.
      `,
      confirmCallback: () => {
        loadNotesTemplate();

        console.log("Template notes loaded.");
      },
    });
  });

  $downloadTextFile.addEventListener("click", () => {
    if ($notes.value.length < 1) {
      dialog({
        content: `
          Your notes are empty. Nothing to download.
        `,
        type: "alert",
      });
      return;
    }

    downloadAsTextFile($notes.value);
  });

  $dialogTrigger.addEventListener("click", () => {
    dialog({
      content: `
          Great! Your notes have been copied to clipboard. You may now send it anywhere you want.
        `,
      confirmCallback: () => {
        alert("Confirmed sisz!");
      },
      cancelCallback: () => {
        alert("Cancelled. WTF!");
      },
    });
  });
}

async function loadNotesTemplate() {
  const $notes = document.querySelector("#app-notes");

  const notesTemplate = await chromeGetData("notesTemplate");

  if (notesTemplate) {
    $notes.value = decodeVariable(notesTemplate);

    autosize.update($notes);

    saveNotes();

    console.log("I won't feel a thing");
  }
}

async function saveNotes() {
  const $notes = document.querySelector("#app-notes");

  // Do not save if notes length is greater than maxNotesChars
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

function toggleElementDisplay(selector = null, display) {
  if (typeof selector != "string" || typeof display != "string") {
    return;
  }

  const $selector = document.querySelector(selector);

  if (display == "show") {
    if ($selector.classList.contains("display-none")) {
      $selector.classList.remove("display-none");
    }
  } else if (display == "hide") {
    $selector.classList.add("display-none");
  }
}

async function restoreSettings() {
  const $notes = document.querySelector("#app-notes");
  const $html = document.querySelector("html");
  const $notesCurrentChars = document.querySelector(
    ".app-notes-current-chars-count"
  );

  let today = new Date();

  const resetNotes = await chromeGetData("resetNotes", false);
  const lastUpdated = await chromeGetData("lastUpdated", today);
  let notesTemplate = await chromeGetData("notesTemplate", "");
  const notes = await chromeGetData("notes", "");
  const enableDarkMode = await chromeGetData("enableDarkMode", false);

  // If dark mode is enabled
  $html.dataset.theme = enableDarkMode ? "dark" : "light";

  const lastUpdatedPresise = new Date(lastUpdated);

  today.setHours(0, 0, 0, 0); // Set today's time to 0

  const withinToday = lastUpdatedPresise > today;

  notesTemplate = decodeVariable(notesTemplate);

  // Check if notes template is set to toggle trigger button
  if (notesTemplate.length > 0) {
    toggleElementDisplay(".app-trigger-use-template", "show");
  } else {
    toggleElementDisplay(".app-trigger-use-template", "hide");
  }

  // Check if automatic reset notes is enabled
  if (resetNotes) {
    console.log("Reset notes is enabled.");

    // If last updated is not within today -> load template
    if (!withinToday) {
      $notes.value = notesTemplate;
      $notesCurrentChars.innerHTML = maxNotesChars - $notes.value.length;

      autosize.update($notes);
      saveNotes(); // Save currently loaded template as notes
      return;
    }

    // Else if last updated is within today -> load recently saved notes
    $notes.value = notes;
    $notesCurrentChars.innerHTML = maxNotesChars - $notes.value.length;

    autosize.update($notes);
    return;
  }

  console.log("Reset notes is disabled. Displaying recently saved notes.");

  // If automatic reset of notes is disabled -> load recently saved notes
  $notes.value = notes;
  $notesCurrentChars.innerHTML = maxNotesChars - $notes.value.length;

  autosize.update($notes);
}
