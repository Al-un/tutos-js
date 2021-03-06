const inquirer = require("inquirer");
const files = require("./files");

module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        name: "username",
        type: "input",
        message: " Enter your Github username or e-mail address",
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your Github username or e-mail address";
          }
        }
      },
      {
        name: "password",
        type: "password",
        message: "Enter your password",
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your password!";
          }
        }
      }
    ];

    return inquirer.prompt(questions);
  },

  askRepoDetails: () => {
    const argv = require("minimist")(process.argv.slice(2));

    const questions = [
      {
        type: "input",
        name: "name",
        message: "Enter a name for the repository",
        default: argv._[0] || files.getCurrentDirectoryBase(),
        // default: files.getCurrentDirectoryBase(),
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter a name for the repository";
          }
        }
      },
      {
        type: "input",
        name: "description",
        default: argv._[1] || null,
        // default: null,
        message: "Optionally enter a description of the repository"
      },
      {
        type: "list",
        name: "visibility",
        message: "Public or private",
        choices: ["public", "private"],
        default: "public"
      }
    ];

    return inquirer.prompt(questions);
  },

  askIgnoreFiles: filesList => {
    const questions = [
      {
        type: "checkbox",
        name: "ignore",
        messages: "Select the files and/or folders you wish to ignore:",
        choices: filesList,
        default: ["node_modules", "bower_components"]
      }
    ];

    return inquirer.prompt(questions);
  }
};
