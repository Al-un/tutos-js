#!/usr/bin/env node

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

// --- Handle Github credentials
const getGithubToken = async () => {
  // Fetch token from config store
  let token = github.getStoredGithubToken();
  if (token) {
    return token;
  }

  // No token found, use credentials to access Github account
  await github.setGithubCredentials();

  // register new token
  try {
    token = await github.registerNewToken();
  } catch (err) {
    console.error(`Error during Github authentication. Exiting`, err);
    process.exit(1);
  }
  return token;
};

// --- Ask Github crendentials
const run = async () => {
  try {
    // Retrieve Github token
    let token = await getGithubToken();
    github.githubAuth(token);

    // Create remote repo
    const url = await repo.createRemoteRepo();

    // Create .gitignore file
    await repo.createGitignore();

    // Setup local repo and push to remote
    const done = await repo.setupRepo(url);
    if (done) {
      console.log(chalk.green("All done!"));
    }
  } catch (err) {
    if (err) {
      switch (err.code) {
        case 401:
          console.log(
            chalk.red("Couldn't log you in. Please provide correct credentials")
          );
          break;
        case 422:
          console.log(
            chalk.red("There is already a remote repository with the same name")
          );
          break;
        default:
          console.log(err);
      }
    }
  }
};

run();
