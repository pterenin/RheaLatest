# Rhea API - Local environment setup

## Prerequisites of API environment

These must be must be installed in order to compile and run the API

- Docker & Docker Compose
- Open JDK 8 - if you have multiple JDK version make sure your profile pointing to 8
- Maven

```
$ docker --version
$ docker-compose --version
$ java -version
$ mvn -v
```

## Compiling API

ensure system environment with above prerequisites installed.

- connect to the VPN
- must have access to the `stash.truste-svc.net`and `rhea-api` repository
- docker and docker-compose services must be running

```
$ git clone ssh://git@stash.truste-svc.net:7999/rhea/rhea-api.git
```

open terminal in the `rhea-api` folder

```
$ git checkout develop
$ git pull
$ ./compile.sh
```

this will create the output of API runtime in dim-app/target` folder

## Running API

Run following command in terminal opened in the directory of `rhea-api`

```
$ docker-compose up // -d (optional to run in background)
```

Above command will result in running following containers, you can see in docker desktop dashboard or docker containers list through docker CLI

- dim-rabbitmq
- dim-postgres
- dim-elasticsearch

As above containers are running successfully, run following command in new terminal opened in `rhea-api` folder

```
$ ./e2e.sh
```

This will create necessary data to run the API.

## Verification of the API

In order to verify navigate to url : http://localhost:3001/swagger-ui.html
you will see the swagger-ui.

Authorize yourself and check the controller `feature-flag/all` must return valid JSON.

## Running Front-end Locally

open terminal in `rhea-ui` folder and run following command

```
$ npm run start:local
```
