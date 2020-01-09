[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# molgenis-app-pipeline-dashboard

Dashboard for following the status of running pipelines. Each run has to go through multiple steps to complete which can take a lot of time. When errors occeur you want to know as quickly as possible where the problem lies.

## Prerequisites
For testing right now you'll need to setup a [MOLGENIS](https://github.com/molgenis/docker) docker running at localhost:8081 and setup a admin token with the name 'admin-test-token'

```
git clone https://github.com/molgenis/docker.git

cd docker/molgenis/8.1

docker-compose up
```

### Setup test token in molgenis

Navgate to localhost:8081 and login as admin with password admin.

Select Navigator > System > Security > Token

then add row with '+' and create a token with user admin, token name 'admin-test-token' and save

Great now you can start testing the dashboard/application

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Running unit tests
```
yarn test:unit
```

### Generating code documentation for typescript files
```
yarn typedoc src
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
