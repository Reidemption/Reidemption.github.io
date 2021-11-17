var complimentContainer = document.querySelector("#compliment-container");
var insertPersonalities = document.querySelector("#submission");
var ULContainer = document.querySelector("#storage");
let showPersonalities = document.querySelector("#new-compliment");
let OpennessField = document.querySelector("#OpennessField");
let ConscientiousnessField = document.querySelector("#ConscientiousnessField");
let ExtraversionField = document.querySelector("#ExtraversionField");
let AgreeablenessField = document.querySelector("#AgreeablenessField");
let NeuroticismField = document.querySelector("#NeuroticismField");
let editPersonalities = document.querySelector("#gEditButton");
var logInModal = document.getElementById("login-modal");
var userModal = document.getElementById("user-modal");
var cBtn = document.getElementById("createAccount");
var lBtn = document.getElementById("logInButton");
var span0 = document.getElementsByClassName("close")[0];
let fName = document.querySelector("#first-name");
let lName = document.querySelector("#last-name");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
var butts = document.querySelectorAll(".button-looks");
let entire_project = document.querySelector("#log-in-only");
let accountResponse = document.querySelector(".warning");
let accountSubmitBtn = document.querySelector("#create-account-button");
let accountLoginBtn = document.querySelector("#log-in-button");
let fNameField = document.querySelector("#first-name-field");
let lNameField = document.querySelector("#last-name-field");
let emailField = document.querySelector("#email-field");
let passwordField = document.querySelector("#password-field");
let gPersonalityID = 0;
let personalities = [];

lBtn.onclick = function () {
  userModal.style.display = "block";
  accountSubmitBtn.style.display = "none";
  fName.style.display = "none";
  lName.style.display = "none";
  accountLoginBtn.style.display = "block";
  userModal.classList.add("logInModal");
};
cBtn.onclick = function () {
  userModal.style.display = "block";
  fName.style.display = "block";
  lName.style.display = "block";
  accountSubmitBtn.style.display = "block";
  accountLoginBtn.style.display = "none";
  userModal.classList.add("create-modal");
};
span0.onclick = function () {
  userModal.style.display = "none";
  userModal.classList.remove("create-modal", "logInModal");
};
window.onclick = function (event) {
  if (event.target == userModal) {
    userModal.style.display = "none";
    userModal.classList.remove("create-modal", "logInModal");
  }
};
accountSubmitBtn.onclick = function () {
  console.log(
    fNameField.value,
    lNameField.value,
    emailField.value,
    passwordField.value
  );
  createUserOnServer(
    fNameField.value,
    lNameField.value,
    emailField.value,
    passwordField.value
  );
  fNameField.value = "";
  lNameField.value = "";
  emailField.value = "";
  passwordField.value = "";
};

accountLoginBtn.onclick = function () {
  console.log(emailField.value, passwordField.value);
  createSessionFromServer(emailField.value, passwordField.value);
  emailField.value = "";
  passwordField.value = "";
};
insertPersonalities.onclick = function () {
  createPersonalitiesOnServer(
    OpennessField.value,
    ConscientiousnessField.value,
    ExtraversionField.value,
    AgreeablenessField.value,
    NeuroticismField.value
  );
  OpennessField.value = "";
  ConscientiousnessField.value = "";
  ExtraversionField.value = "";
  AgreeablenessField.value = "";
  NeuroticismField.value = "";
};

gEditButton.onclick = function (id) {
  updatePersonalitiesFromServer(
    gPersonalityID,
    OpennessField.value,
    ConscientiousnessField.value,
    ExtraversionField.value,
    AgreeablenessField.value,
    NeuroticismField.value
  );
  insertPersonalities.style.display = "block";
  gEditButton.style.display = "none";
  OpennessField.value = "";
  ConscientiousnessField.value = "";
  ExtraversionField.value = "";
  AgreeablenessField.value = "";
  NeuroticismField.value = "";
};

function createUserOnServer(fName, lName, email, password) {
  var data =
    "fname=" +
    encodeURIComponent(fName) +
    "&lname=" +
    encodeURIComponent(lName) +
    "&email=" +
    encodeURIComponent(email) +
    "&password=" +
    encodeURIComponent(password);
  fetch("https://sleepy-castle-10072.herokuapp.com/users", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  }).then(function (response) {
    if (response.status == 201) {
      console.log(`Thank you for making an account ${fName}`);
      accountResponse.innerHTML = "Please log-in.";
      alert(`Thanks for making an account ${fName} ${lName}. Please log in!`);
    } else if (response.status == 422) {
      accountResponse.innerHTML =
        "This email is linked to a different account.";
      alert("This email is linked to a different account.");
      return;
    } else {
      console.log(response.status, "Unknown error");
      alert("Unknown error.. Please try again.");
    }
  });
}
function createSessionFromServer(email, password) {
  var data =
    "email=" +
    encodeURIComponent(email) +
    "&password=" +
    encodeURIComponent(password);
  fetch("https://sleepy-castle-10072.herokuapp.com/sessions", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  }).then(function (response) {
    if (response.status == 201) {
      console.log("Signing in user.");
      loadPersonalitiesFromServer();
    } else {
      accountResponse.innerHTML = "Email or password was incorrect.";
      alert(`Login Failed. Email or password was incorrect.`);
      return;
    }
  });
}
function createPersonalitiesOnServer(
  opennessField,
  conscientiousnessField,
  extraversionField,
  agreeablenessField,
  neuroticismField
) {
  var data =
    "openness=" +
    encodeURIComponent(opennessField) +
    "&conscientiousness=" +
    encodeURIComponent(conscientiousnessField) +
    "&extraversion=" +
    encodeURIComponent(extraversionField) +
    "&agreeableness=" +
    encodeURIComponent(agreeablenessField) +
    "&neuroticism=" +
    encodeURIComponent(neuroticismField);
  fetch("https://sleepy-castle-10072.herokuapp.com/personalities", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  }).then(function (response) {
    loadPersonalitiesFromServer();
  });
}
function deletePersonalitiesFromServer(id) {
  fetch(`https://sleepy-castle-10072.herokuapp.com/personalities/${id}`, {
    method: "DELETE",
    credentials: "include",
  }).then(function (response) {
    loadPersonalitiesFromServer();
  });
}
function updatePersonalitiesFromServer(
  id,
  opennessField,
  conscientiousnessField,
  extraversionField,
  agreeablenessField,
  neuroticismField
) {
  var data =
    "openness=" +
    encodeURIComponent(opennessField) +
    "&conscientiousness=" +
    encodeURIComponent(conscientiousnessField) +
    "&extraversion=" +
    encodeURIComponent(extraversionField) +
    "&agreeableness=" +
    encodeURIComponent(agreeablenessField) +
    "&neuroticism=" +
    encodeURIComponent(neuroticismField);
  fetch(`https://sleepy-castle-10072.herokuapp.com/personalities/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  }).then(function (response) {
    loadPersonalitiesFromServer();
  });
}

function loadPersonalitiesFromServer() {
  fetch("https://sleepy-castle-10072.herokuapp.com/personalities", {
    credentials: "include",
  }).then(function (response) {
    console.log(response.status);
    if (response.status == 401) {
      for (var i = 0; i < butts.length; i++) {
        butts[i].style.display = "block";
      }
      // show login/register divs
      // hide resource list/divs/etc
      return;
    } else {
      // show resource list/divs/etc
      // hide login/register divs
      for (var i = 0; i < butts.length; i++) {
        butts[i].style.display = "none";
      }
      entire_project.style.display = "block";
      userModal.style.display = "none";

      response.json().then(function (data) {
        personalities = data;
        ULContainer.innerHTML = "";
        personalities.forEach((personality) => {
          let ULItem = document.createElement("li");
          ULItem.className = "person";
          console.log(personality);

          var opennessDiv = document.createElement("div");
          opennessDiv.innerHTML = "Openness: " + personality.openness;
          opennessDiv.classList.add("opennessC");
          ULItem.appendChild(opennessDiv);

          var ConscientiousnessDiv = document.createElement("div");
          ConscientiousnessDiv.innerHTML =
            "Conscientiousness: " + personality.conscientiousness;
          ConscientiousnessDiv.classList.add("ConscientiousnessC");
          ULItem.appendChild(ConscientiousnessDiv);

          var ExtraversionDiv = document.createElement("div");
          ExtraversionDiv.innerHTML =
            "Extraversion: " + personality.extraversion;
          ExtraversionDiv.classList.add("extraversionC");
          ULItem.appendChild(ExtraversionDiv);

          var AgreeablenessDiv = document.createElement("div");
          AgreeablenessDiv.innerHTML =
            "Agreeableness: " + personality.agreeableness;
          AgreeablenessDiv.classList.add("agreeablenessC");
          ULItem.appendChild(AgreeablenessDiv);

          var NeuroticismDiv = document.createElement("div");
          NeuroticismDiv.innerHTML = "Neuroticism: " + personality.neuroticism;
          NeuroticismDiv.classList.add("neuroticismC");
          ULItem.appendChild(NeuroticismDiv);

          var deleteButton = document.createElement("button");
          deleteButton.innerHTML = "Delete Personality";
          deleteButton.onclick = function () {
            console.log("Please delete this.", personality.id);
            if (confirm("Are you sure you want to delete this?")) {
              deletePersonalitiesFromServer(personality.id);
            }
            // pass place.id to this function for context
          };
          ULItem.appendChild(deleteButton);

          var editButton = document.createElement("button");
          editButton.innerHTML = "Edit Personality";
          editButton.onclick = function () {
            console.log("Wanting to edit.", personality.id);
            insertPersonalities.style.display = "none";
            gEditButton.style.display = "block";
            gPersonalityID = personality.id;
            OpennessField.value = personality.openness;
            ConscientiousnessField.value = personality.conscientiousness;
            ExtraversionField.value = personality.extraversion;
            AgreeablenessField.value = personality.agreeableness;
            NeuroticismField.value = personality.neuroticism;

            // updatePersonalitiesFromServer(
            //   personality.id,
            //   OpennessField.value,
            //   ConscientiousnessField.value,
            //   ExtraversionField.value,
            //   AgreeablenessField.value,
            //   NeuroticismField.value
            // );
          };
          ULItem.appendChild(editButton);

          ULContainer.appendChild(ULItem);
        });
      });
    }
  });
}

loadPersonalitiesFromServer();

// myDiv.style.display="none";
// myInput.value = "____";
// editPieID = 0; //global variable
