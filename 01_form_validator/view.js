class View {
  form = document.getElementById("form");

  displayMessage(input, errorType, message) {
    const formControl = input.parentElement;
    const displayMessage = formControl.querySelector("small");

    formControl.className = `form__control form__control--${errorType}`;
    if (!message) return;
    displayMessage.innerText = message;
  }

  checkRequired(inputArr) {
    inputArr.forEach((input) => {
      if (input.value === "")
        return this.displayMessage(input, "error", `${input.name} is required`);
      return this.displayMessage(input, "success");
    });
  }

  checkLength = function (input, minLength, maxLength) {
    if (input.value.length < minLength)
      return this.displayMessage(
        input,
        "error",
        `${input.name} is to short (min ${minLength} characters required)`
      );
    if (input.value.length > maxLength)
      return this.displayMessage(
        input,
        "error",
        `${input.name} is to long (max ${maxLength} characters required)`
      );
    return this.displayMessage(input, "success");
  };

  checkEmail(input) {
    const exp = /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,8}[A-Z]{2,63}$/i;
    const result = exp.test(String(input.value).toLowerCase());

    if (!result)
      return this.displayMessage(
        input,
        "error",
        `${input.name} appears to be incorrect`
      );
    return this.displayMessage(input, "success");
  }

  checkPasswordMatch(pwd1, pwd2) {
    if (pwd1.value !== pwd2.value)
      return this.displayMessage(pwd2, "error", `Passwords need to match`);
    return this.displayMessage(pwd2, "success");
  }

  isAllValid(inputArr) {
    const logArr = [];
    const checkArr = (success) => success === true;

    inputArr.forEach((input) => {
      const status = input.parentElement.classList.contains(
        "form__control--success"
      );
      logArr.push(status);
    });
    return logArr.every(checkArr);
  }

  clearInput() {
    const fields = form.querySelectorAll("input");
    fields.forEach((input) => (input.value = ""));
  }

  handleInputSpaces(handler) {
    this.form.addEventListener("keypress", (e) => handler(e));
  }

  handleControlData(handler) {
    this.form.addEventListener("submit", (e) => handler(e));
  }
}

export default new View();
