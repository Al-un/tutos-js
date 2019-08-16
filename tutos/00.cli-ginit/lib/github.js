const Octokit = require("@octokit/rest");
const Configstore = require("configstore");
const pkg = require("../package.json");
const _ = require("lodash");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const chalk = require("chalk");

const inquirer = require("./inquirer");
const conf = new Configstore(pkg.name);

let octokit = new Octokit();
const KEY_GITHUB_TOKEN = "github.token";

module.exports = {
  getInstance: () => {
    return octokit;
  },

  loadToken(token) {
    octokit = new Octokit({ auth: token });
  },

  getStoredGithubToken: () => {
    return conf.get(KEY_GITHUB_TOKEN);
  },

  setGithubCredentials: async () => {
    const credentials = await inquirer.askGithubCredentials();

    octokit = new Octokit({
      auth: {
        ...credentials,
        async on2fa() {
          console.error("2FA authentication not handled yetu");
        }
      }
    });
  },

  /**
   * https://stackoverflow.com/a/55363685/4906586
   */
  registerNewToken: async () => {
    const status = new Spinner("Authenticating you, please wait...");
    status.start();

    try {
      const response = await octokit.oauthAuthorizations.createAuthorization({
        scopes: ["user", "public_repo", "repo", "repo:status"],
        note: "ginits, the command line tool for initializing Git repos"
      });

      const token = response.data.token;
      if (token) {
        conf.set(KEY_GITHUB_TOKEN, token);
        return token;
      } else {
        throw new Error(
          "Missing token",
          "Github token was not found in the response",
          response
        );
      }
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  }
};

/*
{ Deprecation: [@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.
    at authenticate (/home/al-un/git/tuto-js/packages/00.cli-ginit/node_modules/@octokit/rest/plugins/authentication-deprecated/authenticate.js:9:44)
    at Object.setGithubCredentials (/home/al-un/git/tuto-js/packages/00.cli-ginit/lib/github.js:26:13)
    at processTicksAndRejections (internal/process/task_queues.js:86:5) name: 'Deprecation' }
(node:17167) UnhandledPromiseRejectionWarning: TypeError: octokit.authorization.create is not a function
    at Object.registerNewToken (/home/al-un/git/tuto-js/packages/00.cli-ginit/lib/github.js:34:52)
    at run (/home/al-un/git/tuto-js/packages/00.cli-ginit/index.js:28:26)
    at processTicksAndRejections (internal/process/task_queues.js:86:5)
(node:17167) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
(node:17167) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
*/
// octokit.authenticate(_.extend({ type: "basic" }, credentials));

/*
Deprecated as well
*/
// const response = await octokit.authorization.create({
