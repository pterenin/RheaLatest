# Install nvm, node, and Angular CLI

## setting RHEA-API locally in your environment

please refer to [README-API](README-api.md) for more information

## Install nvm. See https://github.com/creationix/nvm

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
export NVM_DIR="${XDG_CONFIG_HOME/:-$HOME/.}nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh" # This loads nvm
source ~/.bashrc
```

## Install node using nvm

```
nvm install node
```

## Install npm

```
sudo apt-get update
sudo apt-get install npm
```

## Install the Angualr CLI

```
sudo npm install -g @angular/cli
```

## Install Visual Studio Code and Prettier

- Install VSCode: https://code.visualstudio.com/download
- In VS Code, click the "Extentions" icon, search for "Prettier - Code formatter", click install.

# Install the modules

The first time you run the app and any time package.json changes, run the following:
`npm install`

# Start the app

`npm start`

# Start the app connecting to the localhost server

`npm run start:local`

# Run the unit tests

`npm test`

# TrustArc - Rhea UI

This project was cloned from the TrustArc Starter project for Angular 7: `https://stash.truste.com/projects/UI/repos/starter`.
It contains the updated front end for Rhea (DFM Next Gen).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Build Docker image

Run `npm run build`.
Then run `docker build -t rhea-ui:v1 .` to build the docker image.

__NOTE:__ You many need change the Host header defined in the /api/ location to make it work:

    proxy_set_header Host rhea.develop.devqa.trustarc-svc.net:4200;

## Run Docker image

Run `docker run -d -e API_ENDPOINT=rhea.develop.devqa.trustarc-svc.net -e AAA_HOST=//aaa-dev.truste-svc.net -p 127.0.0.1:4200:4200/tcp rhea-ui:v1` to start a local server with docker.

Without `-e DFM_API_ENDPOINT=<endpoint>`, this server will point to "dfm-dev.truste-svc.net" as it's API backend.

# Commiting and Pushing Code

This repo has precommit and prepush hooks to ensure a certain level of code quality is maintained.

- The precommit hook checks linting, fixes formatting issues, and verifies the tests pass
- The prepush hook ensures code compilation is possible

## For Developers on Linux and Mac

These hooks work fine for developers on these systems. Developers on Linux and Mac do not need to do anything extra.

## For Developers on Windows

These hooks use a version of husky that does not work correctly on Windows, and will see the following error

```
husky > pre-push (node v12.6.0)
'.' is not recognized as an internal or external command,
operable program or batch file.
husky > pre-push hook failed (add --no-verify to bypass)
error: failed to push some refs to 'ssh://git@stash.truste-svc.net:7999/rhea/rhea-ui.git'
```

To ensure the same code quality as Linux and Mac developers, follow these instructions to commit code.

1 Run `npm run lint && npm run format:fix && npm run test:ci && npm run e2e:ci`
2 Fix all errors reported before committing code.
3 Once all commands pass, then commit the updated code with `git commit --no-verify`

To ensure the same code quality as Linux and Mac developers, follow these instructions to push code.

1 Run `npm run build`
2 Fix all errors reported, and re-commit code using the instructions above.
3 Once the build passes, then push the updated code with `git push --no-verify`

## Running Cypress Tests

please refer to [README-Cypress](README-cypress.md) for more information

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
