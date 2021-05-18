## [1.1.5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/compare/v1.1.4...v1.1.5) (2021-05-18)


### Bug Fixes

* trigger release ([9f5ce4d](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/9f5ce4d8172b19018303d7cb60af07d07d12616c))

## [1.1.4](https://github.com/molgenis/molgenis-app-pipeline-dashboard/compare/v1.1.3...v1.1.4) (2020-03-27)


### Bug Fixes

* **warning-calculation-error:** warnings were triggering too early due to a calculation error ([a492048](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/a492048ec4a6b3c32cc33ba2c30e73ecbb84a3b9))

## [1.1.3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/compare/v1.1.2...v1.1.3) (2020-02-17)


### Bug Fixes

* **updated config:** restored default status_clusters location ([704dd96](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/704dd96d88330dcb6a28fce70a6e48dd66489070))

## [1.1.2](https://github.com/molgenis/molgenis-app-pipeline-dashboard/compare/v1.1.1...v1.1.2) (2020-01-27)


### Bug Fixes

* **1 pixel difference:** foxed 1 pixel difference between runTable and RunStatusTable ([f925e68](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/f925e684729edc11129518d361c85b47b880ee02))
* **fixed graph height goin out of view:** fixed graph going out of view by merging graphs into one ([92846a9](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/92846a9baa3f7231e5f71c395191e8a7479ddbb3))
* **status icon wrong:** fixed status icon showing warnig when project has not, but the run has ([cf5ad32](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/cf5ad3209359155c18d298961da71cf456dc03a3))

## [1.1.1](https://github.com/molgenis/molgenis-app-pipeline-dashboard/compare/v1.1.0...v1.1.1) (2020-01-15)


### Bug Fixes

* **fix date calculations:** date calculations now done using JS Date, instead of milliseconds ([c1d3f89](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/c1d3f89ed45f8c50d8033c908c6a83ac84640dd3))

# [1.1.0](https://github.com/molgenis/molgenis-app-pipeline-dashboard/compare/v1.0.0...v1.1.0) (2020-01-14)


### Bug Fixes

* **bug:** fixed parsegender not parsing gender correctly ([16d61fd](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/16d61fd75e17ae77c0508dc810aba5e625d9f7a3))
* **build:** fixed typescript errors that prevented project build ([f799b8b](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/f799b8bb339f9683c97699479d912e77f40cdaf3))
* **comment fix:** fixed comments not working with new data oriantation ([8d693bd](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/8d693bddc2e14ee0fa1117c5febe2b50f24ed5ef))
* **fix empty projects:** when no runs are retrieved, projectData won't be called ([a62bbf1](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/a62bbf10510d5f9544600d321518d340beebb55e))
* **grid and flex:** grid and flex changes to fit more elements ([8d887f9](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/8d887f9d51b8d0da8f225ea628dcc40ea5741be4))
* **legend:** legend is now also visible when only one series is displayed ([c5174e5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/c5174e557672948c0b78151d6cf3f47c4121bd33))
* **timer runnning after finish:** fixed timer running when no finished date was uploaded ([6841a96](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/6841a9679c710a0a4892ce9feb7a512b3e27e6cd))
* **timing statistics:** fixed overlapping border, added documetnation to methods and properties ([1434c0c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/1434c0ca35f1fe8ec2bb9b98c159f441b9d5b2a3))
* **total sample counts:** fixed total sample counts size and location ([8f72f4f](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/8f72f4f5bdaec291e0c26855426037cb8b4ab2ae))
* **user comments:** fixed user comments ([789abf1](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/789abf1401afc102eeda976ce7fa27ea22675b2b))
* **warnings:** fixed warnings not being shown in RunStatusTable.vue ([0af58a8](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/0af58a86461e934984c5e9b83a84604a2c65edcc))


### Features

* **cluster status:** added small display that shows if the clusters are online or offline ([e718b55](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/e718b55387fb270bee70e5a17ec0f7956f00e42a))
* **data object:** implemented new data objects ([7bc8040](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/7bc804018960645f4778bb1d3dab4aa1a9fbd4c7))
* **fitting:** made fonts and sizes more responsive ([34e9178](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/34e917811407ccba1d53c8f7673bf16c9fa83e33))
* **interactive mode:** made interactive mode centrally controlled ([f0e8d18](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/f0e8d1873a17dfc4efcc86e046a88262b8b0d610))
* **navigation tabs:** added navigation tabs to runtime statistics charts ([f9f5407](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/f9f54070953bb7f420b855f07e7920a437c753d5))
* **runtimes:** added a timed series, based on dates for pipelines ([635fc18](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/635fc1856993775b327eca67c6d941e13d325269))
* **runtimes area:** added area graph for pipeline runtimes ([914428e](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/914428e00586eb8aa3e7b8b8e88d53dae5896b40))
* **runtimestatistics:** added a new graph to dashboard ([f06de51](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/f06de51a40a60d16dbe90edd576d035d15de46e5))
* **server status:** added server status column ([e582726](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/e58272673534775cbf39fd9973b770c74463f4db))
* **server status:** fitted server status using bootstrap vue table-lite ([eafa7ee](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/eafa7eeec113c5df1721c5c0d3b12bc7584c88a3))
* **statemapping:** added statemapping to component ([2dc94a5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/2dc94a51dc6f4a259e4048578ec7369565594305))
* **storage objects:** added new standardised storage objects ([549cf56](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/549cf5623e01d70f790b840b8e26597eaecbb064))


### Performance Improvements

* **state:** removed duplicate saving steps, made State smaller ([a9b14b6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/a9b14b69db7a37eb44c482f66be4c7bcec9b6182))

# 1.0.0 (2020-01-09)


### Bug Fixes

* **actions.ts:** removed deleted mutation from actions that triggered an error ([2d27003](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/2d27003))
* **all:** fixed types, memory hog ([e46407b](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/e46407b))
* **axios > molgenis-api-client:** moved axios fetch requests to molgenis-api-client ([deeaf9d](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/deeaf9d))
* **comment modal:** error messages are now show correctly ([9639f7c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/9639f7c)), closes [#7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/7) [#16](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/16)
* **comment modal:** fixed bug that prevented a new comment when the project had a undefined comment ([261b5a6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/261b5a6))
* **comment modal spec:** fixed test failing because 'Headers' was not defined while testing ([7f98e60](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/7f98e60))
* **fetch-mock:** removed fetch mock ([8bbde2d](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/8bbde2d))
* **formatted dates:** removed duplicicate implmentation of formatDate. fixed formatDate ([c4784af](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/c4784af))
* **graph cycle:** typo fix that caused 1 blank graph in cycle ([3413e76](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/3413e76))
* **Jenkinsfile:** update container to dubnium ([70f464a](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/70f464a))
* **job progress:** job progress is finished when done copying ([212d007](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/212d007)), closes [#14](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/14)
* **jobs-storage:** removed some jobs and exlpored more types of job storage ([b7376fb](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/b7376fb))
* **last years statistics:** made aggregate query more specific, improving performance significantly ([aca3eed](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/aca3eed))
* **layout:** removed placeholder areas ([5e282b8](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/5e282b8))
* **main.ts:** fixed bootstrap-vue.css import ([083c476](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/083c476))
* **progress color:** fixed progress bar color for the correct status ([de63614](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/de63614))
* **project timer:** fixed timer not displaying when waiting ([af1b8a3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/af1b8a3))
* **projecttimer.vue:** fixed project timer not showing ([1d759d5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/1d759d5))
* **run status table:** removed v-for/v-if/v-show use with eachother ([98e8c84](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/98e8c84)), closes [#18](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/18)
* **run status table:** run cycler now skips hidden runs ([bbb27cc](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/bbb27cc))
* **run status table size:** made run status table take all space when only a few runs are displayed ([11701c5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/11701c5))
* **run table:** fixed warning status when no warning was present ([eb7e997](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/eb7e997))
* **runobjects:** fixed the usage of the new runobject ([6ff255c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/6ff255c))
* **runstatustable:** fixed runs visible runs after maximum index not being shown ([fa9c3c0](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/fa9c3c0))
* **runstatustable.vue:** fixed cursor flickering when hovering over the different runs ([7c912a3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/7c912a3))
* **runstatustable.vue:** fixed runs cycling through hidden runs ([bda2f84](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/bda2f84))
* **runtable:** demultiplexing did not fit screen ([8f0afa1](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/8f0afa1)), closes [#4](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/4)
* **statistics graph:** added graph title ([b8f4291](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/b8f4291))
* **statistics graph:** gave graph more room ([5e96e61](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/5e96e61))
* **step tracker:** fixed error view in steptracker ([a8b86f6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/a8b86f6))
* **stepsindication:** hotfix for incorrect steps being shown when an error occeurs ([0be30fb](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/0be30fb))
* **thresholds:** fixed thresholds not being sent to other components ([fd07262](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/fd07262))
* **time errro:** fixed error being thrown when hours exeeded 60 ([48ec3ce](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/48ec3ce))
* **timer:** updated format time function changes into timer ([d4a9f8e](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/d4a9f8e))
* **title on grapg:** added title to display on graph ([19dbb54](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/19dbb54))
* **track and trace:** added check for addStatistics ([53bbc0a](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/53bbc0a)), closes [#20](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/20)
* **trackandtrace:** run shows step 0/5 when waiting ([6ca1cc5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/6ca1cc5)), closes [#2](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/2)
* **typescript errors:** fixed small typescript typing errors ([a41e633](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/a41e633))
* **undefined week,month,year:** fixed week,month,year being undefined on startup ([2a5de9a](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/2a5de9a))


### Features

* **added timer for projects:** added timer for projects ([abf0893](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/abf0893))
* **app, track&trace, runitem:** moved automatic table generation to custom table ([c6767fd](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/c6767fd))
* **comment box:** added a single comment box per project ([59090ee](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/59090ee)), closes [#7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/7)
* **comment box:** added security measure to prevent duplicate data inserts ([695ee9c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/695ee9c)), closes [#16](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/16) [#7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/7)
* **comment icon:** updated comment icon location ([6e56b19](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/6e56b19))
* **comment modal:** added a comment modal ([87c50b8](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/87c50b8)), closes [#7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/7)
* **comment modal:** modal now shows when a project is clicked ([66a0368](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/66a0368)), closes [#7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/7)
* **comment modal api requests:** added comment modal api request functions to actions ([e5df7f8](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/e5df7f8))
* **comment validation:** added validation for comments ([5174589](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/5174589))
* **comments:** added comment icons ([91cc387](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/91cc387)), closes [#5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/5) [#7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/7)
* **comments:** reversed comment insert ([fa72d68](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/fa72d68)), closes [#7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/7)
* **track and trace:** implemented runtimestatistics class support ([78e3dcd](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/78e3dcd)), closes [#3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/3) [#6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/6)
* use accept for data ([647c7ae](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/647c7ae))
* **concept statistics:** added a concept view for statistics ([dbfa802](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/dbfa802)), closes [#8](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/8)
* **count graph:** moved year,month & day counts to single component ([e4d9a4e](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/e4d9a4e))
* **dashboard:** added raw copy status indicator and renamed copying to result copy ([16ac5ef](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/16ac5ef))
* **dashboard:** added Run Table display ([da7b231](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/da7b231))
* **dashboard:** added sample statistics placeholder ([1d27d84](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/1d27d84))
* **dashboard:** added threshold data variable ([aa18c28](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/aa18c28))
* **dashboard:** made basic layout for other components ([dcd6981](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/dcd6981))
* **datatypes.ts:** added status type enum ([101def4](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/101def4))
* **emit comment update:** added emit chain for a comment update ([e2c322a](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/e2c322a))
* **error toast:** added error toast to comment modal ([f2d3a27](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/f2d3a27))
* **getdata:** tracker data fetch requests now contained in store ([c495d5e](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/c495d5e))
* **graph display:** added simple cycler ([8cb57ad](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/8cb57ad))
* **helpmodalcontent.vue:** added informational modal that contains helpful info for the user ([af98fc3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/af98fc3))
* **hidden runs:** implemented togglable hidden runs ([63d90cb](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/63d90cb))
* **icons and scss:** added fontawesome icons and scss support ([cd4f268](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/cd4f268))
* **loading overlay:** added simple loading overlay ([40ff1f9](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/40ff1f9))
* **machine series:** added new action for getting a series for runtimes Per Machine ([5ee98eb](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/5ee98eb))
* **multiple graphs:** implemented working graph tabs/dropdowns for selection of said graph ([4fa94de](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/4fa94de))
* **optional graph cycler:** started work on optional statistics cycle ([ec4beef](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/ec4beef))
* **past year data:** implemented fetch of past year data ([ac7bed6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/ac7bed6)), closes [#8](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/8)
* **pipeline statistics:** implemented separated pipline statistics ([1b97296](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/1b97296)), closes [#3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/3) [#6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/6)
* **progressbar:** added project progress bar ([179e56f](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/179e56f))
* **progressbar.vue:** added progressbar component ([6934c7f](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/6934c7f))
* **project display:** added project display component ([68f55eb](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/68f55eb))
* **project table:** reimplemented warning indicators ([e46fd30](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/e46fd30))
* **projectobject class:** added project type function ([8cf3cce](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/8cf3cce)), closes [#3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/3) [#5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/5) [#6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/6)
* **projectrow:** changed status calculation to data based ([839bf6a](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/839bf6a))
* **projectrow:** moved each project to seperate component ([560660d](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/560660d))
* **run statistics:** added annotation for outliers, pending implementation ([f5f6e9c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/f5f6e9c))
* **run statistics:** added run statistics graph using apexgraphs ([4474d3c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/4474d3c))
* **run status & display cycke:** implemented run step display and display cycle ([4000b5e](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/4000b5e))
* **run status table:** added show attribute ([1c535d0](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/1c535d0)), closes [#22](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/22)
* **run status table:** added shown run computed ([2fc9afd](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/2fc9afd))
* **run step table:** added status colors to run step table ([dce1bec](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/dce1bec))
* **run table:** added checkboxes to hide runs ([fc6fd15](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/fc6fd15)), closes [#5](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/5)
* **run table project:** added warning emit ([5d6d96f](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/5d6d96f))
* **runitem.vue:** component added that builds a run's table data ([651654f](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/651654f))
* **runstatustable.vue:** hide/unhide arrow now only visible when there are hidden runs ([80887c1](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/80887c1))
* **runstatustablerow.vue:** hidden runs are now unchecked, visible runs are checked ([af15948](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/af15948))
* **runstatustablerow.vue:** run ID is now fully shown in status table row when selected ([8aac565](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/8aac565))
* **runtable:** added timeThreshold parameter ([3bc9e4d](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/3bc9e4d))
* **runtable:** added timeThreshold parameter ([79292e7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/79292e7))
* **runtable:** added warning parameter ([a57828b](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/a57828b))
* **runtable:** dashboard now hides job progress bar when not running ([480be1a](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/480be1a)), closes [#4](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/4)
* **runtablecommentmodal.vue:** moved toast to bottom right of the dashboard ([2483c77](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/2483c77))
* **runtime graph:** separated machine runtime per prepKit type ([0a6350d](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/0a6350d))
* **runtime statistics:** added emit for new threshold ([c56ca71](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/c56ca71))
* **runtime statistics:** added runtime per project graph, using vuex actions for data fetching ([9198a6c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/9198a6c))
* **runtime statistics:** added runtime statistics class ([d2eb9e3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/d2eb9e3)), closes [#3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/3) [#6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/6)
* **runtime statistics:** added runtime statistics data class ([3bb136a](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/3bb136a)), closes [#3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/3) [#6](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/6)
* **runtime statistics:** changes view based on maximum value ([7997c0b](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/7997c0b))
* **runtime statistics:** implemented outlier annotation if it surpasses threshold ([3bc8db7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/3bc8db7))
* **runtime statistics:** started vuex merge of runtime statistics graph to use status_timing table ([a9ed1ce](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/a9ed1ce))
* **runtimestatistics:** implemented outlier calculation using SD ([5f02f45](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/5f02f45))
* **runtimestatistics.vue:** actions now serves graph data filled to equal lenghts ([26131f7](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/26131f7))
* **runtimestatistics.vue:** datapoints now show their project ID in graph when hovered over ([0925e16](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/0925e16))
* **sample counts:** added concept sample counts over timeline for year and week ([eca9f05](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/eca9f05))
* **sample counts graph:** connected week and month counts to database ([db51657](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/db51657))
* **sample statistics:** connected Sample statistics to MOLGENIS database api ([2908bb9](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/2908bb9)), closes [#8](https://github.com/molgenis/molgenis-app-pipeline-dashboard/issues/8)
* **samplecountsgraph:** added Sequenced samples summed up counter ([b6ad050](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/b6ad050))
* **samplestatistics:** added yearly sample count ([5777f27](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/5777f27))
* **status icons:** added status icons ([6389b0a](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/6389b0a))
* **status table:** added hiding of Runs ([1a98d7c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/1a98d7c))
* **step tracker:** added run step tracker ([b237852](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/b237852))
* **step tracker:** moved steptracker alingment to bootstrap ([53ff78c](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/53ff78c))
* **steptracker:** added warning icon and color ([567ac29](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/567ac29))
* **steptracker rework:** reworked steptracker component ([844e318](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/844e318))
* **threshholds:** thresholds are now calculated per pipeline type ([086aba2](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/086aba2))
* **track and trace refresh:** added data refresh ([c573c7b](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/c573c7b))
* **trackandtrace:** added timer for expected finish time ([25609a4](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/25609a4))
* **trackandtrace:** implemented new components ([ac2ede3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/ac2ede3))
* **trackandtrace.vue:** added error and success toasts when updating track and trace data ([754b636](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/754b636))
* **trackandtracke.vue:** added icons to edit mode, fixed copystate step not being shown ([2907b6f](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/2907b6f))
* **typedoc:** added TypeDoc generation to project ([575ef49](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/575ef49))
* **vuex:** added basic vuex structure ([b5dbdab](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/b5dbdab))


### Performance Improvements

* **app:** moved root url to root app ([2a57cf3](https://github.com/molgenis/molgenis-app-pipeline-dashboard/commit/2a57cf3))
