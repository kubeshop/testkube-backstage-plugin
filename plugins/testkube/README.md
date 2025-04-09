# Testkube plugin

Welcome to the Testkube plugin!

_This plugin was created through the Backstage CLI_

## Prerequisites

* Testkube OSS running, check here the instructions to [install](https://docs.testkube.io/articles/install/standalone-agent).
* Port forward the Testkube API using the following command: `kubectl port-forward svc/testkube-api-server -n testkube 8088:8088`.

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/testkube](http://localhost:3000/testkube).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
