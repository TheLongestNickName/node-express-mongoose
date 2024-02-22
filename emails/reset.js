const keys = require("../keys");

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Mail recovery",
    html: `
    <h1>Have you forgotten your password?</h1>
    <p>If not, ignore this message</p>
    <p>Otherwise click on the link before</p>
    <p><a href="${keys.BASE_URL}/auth/password/${token}">Access recovery </a></p>
    <a href='${keys.BASE_URL}'> Go to our website</a>
    `,
  };
};
