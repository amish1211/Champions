import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champions-180d2-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementInDB = ref(database, "endorsement");

const endorsementTextEl = document.getElementById("endorsement-text");
const endorsementFromEl = document.getElementById("from");
const endorsementToEl = document.getElementById("to");
const publishBtn = document.getElementById("publish-btn");
const endorsementListEl = document.getElementById("endorsement-list");

publishBtn.addEventListener("click", function () {
  const endorsementObj = {
    from: endorsementFromEl.value,
    to: endorsementToEl.value,
    text: endorsementTextEl.value,
    likeCount: 0,
    isLiked: false,
  };
  push(endorsementInDB, endorsementObj);
  clearEndorsementInputEls();
});

onValue(endorsementInDB, function (snapshot) {
  if (snapshot.exists()) {
    clearEndorsementListEl();
    const endorsementObjectsArray = Object.values(snapshot.val());
    const endorsementKeysArray = Object.keys(snapshot.val());

    appendToEndorsementList(endorsementObjectsArray, endorsementKeysArray);
  } else {
    clearEndorsementListEl();
  }
});

function clearEndorsementInputEls() {
  endorsementFromEl.value = "";
  endorsementToEl.value = "";
  endorsementTextEl.value = "";
}

function clearEndorsementListEl() {
  endorsementListEl.innerHTML = "";
}

function appendToEndorsementList(endorsementsArray, endorsementKeysArray) {
  for (let i = 0; i < endorsementsArray.length; i++) {
    const endorsementObj = endorsementsArray[i];
    const endorsementId = endorsementKeysArray[i];

    const endorsementLi = document.createElement("li");
    endorsementLi.innerHTML += `<p class="from-text">From ${endorsementObj.from}</p> <p>${endorsementObj.text}</p>`;
    const endorsementFooter = document.createElement("div");
    endorsementFooter.classList.add("endorsement-footer");
    endorsementFooter.innerHTML += `<p class="to-text">To ${endorsementObj.to}</p>`;
    const likeHTML = document.createElement("div");
    likeHTML.classList.add("like");
    likeHTML.innerHTML += `&hearts;`;
    likeHTML.style.color = endorsementObj.isLiked ? "red" : "black";
    const likeCountHTML = document.createElement("span");
    likeCountHTML.classList.add("like-count");
    likeCountHTML.dataset.id = endorsementId;
    likeCountHTML.textContent = endorsementObj.likeCount;
    likeHTML.addEventListener("click", function () {
      const likeCountRef = ref(
        database,
        `endorsement/${endorsementId}/likeCount`
      );

      const isLikedRef = ref(database, `endorsement/${endorsementId}/isLiked`);

      get(isLikedRef).then(function (snapshot) {
        const isLiked = snapshot.val();
        get(likeCountRef).then(function (snapshot) {
          const likeCount = snapshot.val();
          if (isLiked) {
            update(ref(database, `endorsement/${endorsementId}`), {
              likeCount: likeCount - 1,
              isLiked: false,
            });
          } else {
            update(ref(database, `endorsement/${endorsementId}`), {
              likeCount: likeCount + 1,
              isLiked: true,
            });
          }
        });
      });
    });
    likeHTML.append(likeCountHTML);
    endorsementFooter.append(likeHTML);
    endorsementLi.append(endorsementFooter);
    endorsementListEl.append(endorsementLi);
  }
}
