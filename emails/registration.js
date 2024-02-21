const keys = require("../keys");

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Succese Registration ",
    html: `
    <h1>Nice to meet you in our shop</h1>
    <p>You have successfully created an account with email - ${email}</p>
    <a href='${keys.BASE_URL}'> Go to our website</a>
    `,
  };
};
