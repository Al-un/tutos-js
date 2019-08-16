const _ = require("lodash");
const fs = require("fs");
const git = require("simple-git")();
const CLI = require("clui");
const Spinner = CLI.Spinner;

const inquirer = require("./inquirer");
const gh = require("./github");

module.exports = {
  createRemoteRepo: async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: answers.description,
      private: answers.visibility === "private"
    };

    const status = new Spinner("Creating remote repository...");
    status.start();

    try {
      const response = await github.repos.createForAuthenticatedUser(data);
      return response.data.ssh_url;
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  }
};
