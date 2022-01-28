#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
// Here we go
import fs from "fs";
const fsPromises = fs.promises;

let projectName;
let projectPath;
let userReponses = [];

// All the server based calls can be their own promises function just like the one below
// Let's start by creating an endpoint that simply returns a response after a delay
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// Common CLI methods below
// const spinner = createSpinner("Processing...").start();
async function setupProjectDirectory(path) {
  try {
    await fsPromises.mkdir(path);

    // Copy the .env.example file in the project directory
    await fsPromises.copyFile( `.env.example`, `${path}/.env`);
  }
  catch(err) {
    console.log(`Error creating the project directory. Please try with a different name: ${err}`)
    process.exit(1)
  }
}

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    'Create Blox App \n'
  );

  await sleep();
  rainbowTitle.stop();

  console.log(`
    ${chalk.bgBlue('Start with a skeleton SaaS or an E2E project')}
  `);
}

async function handleAnswer(isCorrect) {
  const spinner = createSpinner('Processing...').start();
  await sleep();

  if (isCorrect) {
    spinner.success({ text: `Nice work ${projectName}. That's a legit answer` });
  } else {
    spinner.error({ text: `💀💀💀 Game over, you lose ${projectName}!` });
    process.exit(1);
  }
}

async function handleUserReponse(input) {
  //const spinner = createSpinner("Processing...").start();
  
  userReponses.push(input);
  console.clear();
}

async function askProjectName() {
  const answers = await inquirer.prompt({
    name: 'project_name',
    type: 'input',
    // Make this question more cool
    message: 'What is your project name?',
    default() {
      return 'blox-saas-example';
    },
  });

  projectName = answers.project_name;
  projectPath = `${process.cwd()}/${projectName}`;

  //Create a new directory below and keep the path in a variable
  await setupProjectDirectory(projectPath);
}

async function askProjectType() {
  const userReponse = await inquirer.prompt({
    name: "PROJECT_TYPE",
    type: "list",
    message: `Select project type:\n`,
    choices: [
      "SaaS skeleton project",
      "Single digital download project",
      "Multiple digital download project",
      "Single subscription based project",
      "Multiple subscriptions based project",
    ]
  });
  await handleUserReponse(userReponse);
}

async function askUserAuth() {
  const userReponse = await inquirer.prompt({
    name: "USER_AUTH_PROVIDER",
    type: "list",
    message: `Select user authentication provider\n`,
    choices: [
      "No Auth",
      "Firebase",
      "AWS Cognito",
      "Auth0"
    ],
  });
  await handleUserReponse(userReponse);
}

async function askPaymentProcessor() {
  const userReponse = await inquirer.prompt({
    name: "PAYMENT_PROCESSOR",
    type: "list",
    message: `Select product listing and payment processing service\n`,
    choices: ["Paypal", "Stripe"],
  });
  await handleUserReponse(userReponse);
}

async function askEmailProvider() {
  const userReponse = await inquirer.prompt({
    name: "EMAIL_PROVIDER",
    type: "list",
    message: `Select email service\n`,
    choices: ["Sendgrid", "Mailgun", "Mandrill", "Mailchimp"],
  });
  await handleUserReponse(userReponse);
}

async function askDeploymentProvider() {
  const userReponse = await inquirer.prompt({
    name: "DEPLOYMENT_PROVIDER",
    type: "list",
    message: `Select deployment provider\n`,
    choices: ["Vercel", "AWS", "GCP"],
  });
  await handleUserReponse(userReponse);
}

async function finishSetup(inputs) {
  console.clear();
  figlet(`Congrats , ${projectName} !\n $ 1 , 0 0 0 , 0 0 0`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + "\n");

    console.log(inputs);
    process.exit(0);
  });
}

// Run it with top-level await
console.clear();
await welcome();
await askProjectName();
await askProjectType();
await askUserAuth();
await askPaymentProcessor();
await askEmailProvider();
await askDeploymentProvider();

await finishSetup(userReponses);