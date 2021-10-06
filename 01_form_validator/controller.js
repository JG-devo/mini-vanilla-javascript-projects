"use strict";

import * as model from "./model.js";
import view from "./view.js";

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");

const trimSpace = function (e) {
  if (e.target.type === "password") return;
  if (e.code === "Space") return e.preventDefault();
};

const controlData = function (e) {
  e.preventDefault();
  view.checkRequired([username, email, password, passwordConfirm]);
  view.checkLength(username, 3, 12);
  view.checkLength(password, 6, 25);
  view.checkEmail(email);
  view.checkPasswordMatch(password, passwordConfirm);

  if (view.isAllValid([username, email, password, passwordConfirm])) {
    model.updateState(username, email, password);
    view.clearInput();
    return console.log(model.state);
  }
  return;
};

const init = function () {
  view.handleInputSpaces((e) => trimSpace(e));
  view.handleControlData((e) => controlData(e));
};
init();
