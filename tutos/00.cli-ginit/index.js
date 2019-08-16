const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

const files = require("./lib/files");
const inquirer = require("./lib/inquirer");
const github = require("./lib/github");
const repo = require("./lib/repo");

// --- Check if current dir is a git repo
clear();
console.log(
  chalk.yellow(figlet.textSync("Ginit", { horizontalLayout: "full" }))
);

if (files.directoryExists(".git")) {
  console.log(chalk.red("Already a git repostoryu"));
  // process.exit();
}

// --- Ask Github crendentials
const run = async () => {
  // const crendentials = await inquirer.askGithubCredentials();
  // console.log(crendentials);

  let token = github.getStoredGithubToken();
  if (!token) {
    await github.setGithubCredentials();
    token = await github.registerNewToken();
  } else {
    github.loadToken(token);
  }

  const url = await repo.createRemoteRepo();
  console.log("Created", url);
};

run();
