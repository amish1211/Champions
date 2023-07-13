import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champions-97458-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementInDB = ref(database, "endorsement");

const endorsementTextEl = document.getElementById("endorsement-text");
const publishBtn = document.getElementById("publish-btn");
const endorsementListEl = document.getElementById("endorsement-list");

publishBtn.addEventListener("click", function () {
  const endorsementText = endorsementTextEl.value;
  push(endorsementInDB, endorsementText);
  clearEndorsementTextEl();
});

onValue(endorsementInDB, function (snapshot) {
  if (snapshot.exists()) {
    clearEndorsementListEl();
    const endorsementsArray = Object.values(snapshot.val());
    endorsementsArray.forEach(appendToEndorsementList);
  } else {
    clearEndorsementListEl();
  }
});

function clearEndorsementTextEl() {
  endorsementTextEl.value = "";
}

function clearEndorsementListEl() {
  endorsementListEl.innerHTML = "";
}

function appendToEndorsementList(endorsement) {
  endorsementListEl.innerHTML += `<li>${endorsement}</li>`;
}
