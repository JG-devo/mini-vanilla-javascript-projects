"use strict";

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");

const formData = [];

const displayMessage = function (input, errorType, message) {
  const formControl = input.parentElement;
  const displayMessage = formControl.querySelector("small");

  formControl.className = `form__control form__control--${errorType}`;
  if (!message) return;
  displayMessage.innerText = message;
};

const clearInput = function () {
  const fields = form.querySelectorAll("input");
  fields.forEach((input) => (input.value = ""));
};

const checkEmail = function (input) {
  // needs pattern between / /, the i at the end makes it case-insensitive
  // https://www.regular-expressions.info/email.html
  const exp = /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,8}[A-Z]{2,63}$/i;
  const result = exp.test(String(input.value).toLowerCase());

  if (!result)
    return displayMessage(
      input,
      "error",
      `${input.name} appears to be incorrect`
    );
  return displayMessage(input, "success");
};

const checkRequired = function (inputArr) {
  inputArr.forEach((input) => {
    if (input.value === "")
      return displayMessage(input, "error", `${input.name} is required`);
    return displayMessage(input, "success");
  });
};

const checkLength = function (input, minLength, maxLength) {
  if (input.value.length < minLength)
    return displayMessage(
      input,
      "error",
      `${input.name} is to short (min ${minLength} characters required)`
    );
  if (input.value.length > maxLength)
    return displayMessage(
      input,
      "error",
      `${input.name} is to long (max ${maxLength} characters required)`
    );
  return displayMessage(input, "success");
};

const checkPasswordMatch = function (pwd1, pwd2) {
  if (pwd1.value !== pwd2.value)
    return displayMessage(pwd2, "error", `Passwords need to match`);
  return displayMessage(pwd2, "success");
};

const isAllValid = function (inputArr) {
  const logArr = [];
  const checkArr = (success) => success === true;

  inputArr.forEach((input) => {
    const status = input.parentElement.classList.contains(
      "form__control--success"
    );
    logArr.push(status);
  });
  return logArr.every(checkArr);
};

const generateID = function () {
  const id = Date.now();
  const tag = Math.floor(Math.random() * 1000);
  return +`${String(id).slice(-4)}${String(tag)}`;
};

// Event listeners for form

form.addEventListener("submit", function (e) {
  e.preventDefault();
  checkRequired([username, email, password, passwordConfirm]);
  checkLength(username, 3, 12);
  checkLength(password, 6, 25);
  checkEmail(email);
  checkPasswordMatch(password, passwordConfirm);

  if (isAllValid([username, email, password, passwordConfirm])) {
    formData.push({
      id: generateID(),
      username: username.value,
      email: email.value,
      password: password.value,
    });
    clearInput();
    return console.log(formData);
  }
  return;
});

form.addEventListener("keypress", function (e) {
  if (e.target.type === "password") return;
  if (e.code === "Space") e.preventDefault();
});
