[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# molgenis-app-pipeline-dashboard

Dashboard for following the status of running pipelines. Each run has to go through multiple steps to complete which can take a lot of time. When errors occur you want to know as quickly as possible where the problem lies.

# Setup in MOlGENIS for production:
proxy MOLGENIS pipeline dashboard or @molgenis-experimental in MOLGENIS instance from unpkg
https://unpkg.com/@molgenis-experimental/molgenis-app-pipeline-dashboard/dist/index.html

Menu manager -> add menu item -> plugin select redirect

`query parameter: url=my.domain.nl/@molgenis-experimental/molgenis-app-pipeline-dashboard/dist/index.html`

## Prerequisites
[MOLGENIS](https://github.com/molgenis/docker) docker or a MOLGENIS server is required to run the application

```
git clone https://github.com/molgenis/docker.git

cd docker/molgenis/8.2

docker-compose up
```

## data
Demo data available [Data](docs/demo_data.xlsx) and upload to MOLGENIS docker or other MOLGENIS server using data import

## Project setup
```
yarn install
```

## config for development
Change the proxy settings in vue.config.js to correspond to your molgenis instance:

```javascript
//vue.config.js
proxy: process.env.NODE_ENV === 'production' ? undefined : {
      '^/api': {
        target: 'localhost:8081', //molgenis docker default change to actual
        changeOrigin: true
      },
      '^/login': {
        target: 'localhost:8081', //molgenis docker default change to actual
        changeOrigin: true
      }
    }
```

configure table locations in src/store/state.ts:
```javascript
state = {
  overviewTable: 'status_overview', //status_overview
  projectsTable: 'status_projects', //status_projects
  jobTable: 'status_jobs', //status_jobs
  timingTable: 'status_timing', //status_timing
  sampleTable: 'status_samples', //status_samples
  clusterTable: 'status_clusters', // status_clusters
  ...
}
```
### Compiles and hot-reloads for development
```
yarn run serve

then navigate to localhost:8080
```

### Running unit tests
```
yarn test:unit
```

### Generating code documentation for typescript files
```
yarn typedoc src
```
results can be found at docs/documentation/index.html

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

