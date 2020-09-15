/* I don't care if you moved on */

(function () {
  console.info("I'm not laying in bed with a fucked up head");

  loadUserInfo();
  loadContent();
  loadEventListeners();
})();

function loadEventListeners() {
  const $copyToClipboard = document.querySelector(".copy-to-clipboard");

  $copyToClipboard.addEventListener("click", function () {
    const content = document.querySelector("#app-content").value;

    copyToClipboard(content, function () {
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

function loadContent() {
  document.querySelector("#app-content").value =
    getCurrentFullDate() + newLine(2);
}

function getCurrentFullDate() {
  const now = new Date();
  const currentDate = Intl.DateTimeFormat("en-us", {
    dateStyle: "long",
  }).format(now);

  return currentDate;
}

function newLine($multiplier = 1) {
  let newLine = "";

  for (let index = 0; index < $multiplier; index++) {
    newLine = newLine + "\n";
  }
  return newLine;
}

function copyToClipboard(textToCopy, callback) {
  let temporaryInput = document.createElement("input");

  temporaryInput.value = textToCopy;

  temporaryInput.setAttribute("readonly", "");

  temporaryInput.style = { display: "none" };

  document.body.appendChild(temporaryInput);

  temporaryInput.select();

  document.execCommand("copy");

  document.body.removeChild(temporaryInput);

  temporaryInput = undefined;

  if (typeof callback == "function") {
    callback();
  }
}
