export const state = [];

export const updateState = function (username, email, password) {
  this.state.push({
    id: _generateID(),
    username: username.value,
    email: email.value,
    password: password.value,
  });
};

const _generateID = function () {
  const id = Date.now();
  const tag = Math.floor(Math.random() * 1000);
  return +`${String(id).slice(-4)}${String(tag)}`;
};
