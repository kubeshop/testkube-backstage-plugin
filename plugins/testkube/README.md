# Testkube plugin

Welcome to the Testkube plugin!

> **IMPORTANT!**
>
> This plugin only supports Testkube OSS version, we are planning a future integration with Testkube Enterprise.

El plugin permite centralizar dentro de Backstage la información específica de las pruebas automatizadas que son gestionadas desde la plataforma Testkube, de esa forma hacer visible desde un perspectiva general como también por entidad.

Dispone de las siguientes funcionalidades:

* Testkube Dashboard: página que contiene una vista general de las últimas ejecuciones de pruebas automatizadas. Incluye un panel con 3 métricas: Rango de Éxitos/Fallos, Ejecuciones Fallidas, y el Total de Ejecuciones, bajo las métricas se listan las ejecuciones con su respectivo indentificador, tiempo de ejecución, fecha de ejecución, estado, y nombre de flujo de pruebas.

* Testkube Entity Page: página que contiene una vista de los flujos de pruebas automatizadas relacionadas a una Entidad a partir de anotaciones. Incluye un panel con 3 métricas: Rango de Éxitos/Fallos, Ejecuciones Fallidas, y el Total de Ejecuciones, todo respetando el filtro por Entidad. Luego, bajo las métricas, se listan los fujos de prueba automatizada con indentificador de la última ejecución, tiempo  de la última ejecución, fecha  de la última ejecución, estado de la última ejecución, y nombre de flujo de pruebas, la tabla además permite realizar 4 diferentes acciones:
  * Ver la definición del flujo de pruebas en formato YAML.
  * Ver los logs de la última ejecución.
  * Ver historial de las últimas ejecuciones. Este historial también ofrece la opción de ver el log de cada ejecución.
  * Ejecutar flujo de pruebas automatizadas.

_This plugin was created through the Backstage CLI_

## Develop

### Prepare local environment

* Testkube OSS running, check here the instructions to [install](https://docs.testkube.io/articles/install/standalone-agent).
* Port forward the Testkube API using the following command: `kubectl port-forward svc/testkube-api-server -n testkube 8088:8088`.
* Pre-load data using the following command:

    ```bash
    ./example/testkube/load-data.sh
    ```

### Run the plugin

From Backstage root directory:

```bash
yarn install
yarn dev
```

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/testkube](http://localhost:3000/testkube).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
