const _ = require("lodash");
const fs = require("fs");
const git = require("simple-git")();
const CLI = require("clui");
const Spinner = CLI.Spinner;
const touch = require("touch");

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
      // console.debug("Created repo response", response);
      return response.data.clone_url;
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  },

  createGitignore: async () => {
    const filesList = _.without(fs.readdirSync("."), ".git", ".gitignore");

    if (filesList.length) {
      const answers = await inquirer.askIgnoreFiles(filesList);
      if (answers.ignore.length) {
        fs.writeFileSync(".gitignore", answers.ignore.join("\n"));
      } else {
        touch(".gitignore");
      }
    } else {
      touch(".gitignore");
    }
  },

  setupRepo: async url => {
    const status = new Spinner(
      `Initialising local repository and pushing to remote ${url}`
    );
    status.start();

    try {
      // await git.init();
      // await git.add(".gitignore");
      // await git.add("./*");
      // await git.commit("Initial commit");
      // await git.addRemote("origin", url);
      // await git.push("origin", "master");
      await git
        .init()
        .add(".gitignore")
        .add("./*")
        .commit("Initial commit")
        .addRemote("origin", url);
      // .push("origin", "master") // authentication required for that part

      return true;
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  }
};
