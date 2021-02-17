# Cypress Tests for RHEA

## External dependencies for Cypress in any environment

- Rhea Front-end application must be running
- AAA must be accessible
- Plutus must be accessible

## Configurations

Following configurations must be set according to the environment

### cypress.json

configurations specific to environment [cypress.json](cypress.json)

- `baseUrl` - URL for Rhea-Front end application, change it according to the Local, DEV, QA, Staging environment

### cypress.env.json

configurations specific to environment [cypress.env.json](cypress.env.json)

- `loginUrl` - AAA url for authentication and authorization specific to the environment
- `externalApplication: plutus: baseUrl` - url for accessing the Plutus through API
- `admin` / `user` - Create users( one admin and one general user) attach to the relevant (organization) account,
  update relevant credentials
- `oauth` credentials for `Rhea` api access and `Plutus` api access - AAA team setup and issues the relevant clients to the environment

All other variables in [`cypress.json`](cypress.json) and [`cypress.env.json`](cypress.env.json) variables are optional to configure.

### Installing Cypress

```
$ npm install
```

### Running Cypress

Running in Visual Mode

```
$ npm run e2e
```

Running in CI mode

```
$ npm run e2e:ci
```

For more information visit [Continuous Integration](https://docs.cypress.io/guides/guides/continuous-integration.html#Setting-up-CI)
Environment variable could be configured in CLI as well.

# DEVELOPMENT Guidelines

Following guidelines are recommended to follow for writing cypress tests.

- Test should be specific UI/UX only
- Any prerequisite data must be created before running the test suite
- navigate directly to the UI - avoid navigation from other pieces of UI which are not intended to test in the suite.
- clean all data all test suite completes.
- keep the same coding pattern across the tests as much possible e.g `#regions, naming conventions, exports of strong typings, reusable shared functions`
- avoid dependencies on the external systems at the moment AAA, Plutus are external systems.
- Cypress Tests - Integration folder - define test in appropriate folder structure, make use of Fixture, Custom Commands, Strong Typing.
- Fixtures - JSON - see example of background folder fixtures
  - Data: define the data to fill in the forms, define relevant models for strong typing in support folder
  - UI : define the interaction elements with data-cy tag
  - API: optional - if possible define the API
- Support -
  - Cypress custom commands - most frequent commands, often non-ui, CRUD operation through client credentials, sign-in functionality.
  - Reusable functions - functionality related to shared components of Rhea
  - All fixtures typing are defined here.
