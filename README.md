# BOT-user-interface

This repository includes both the UI interface and the web server.

## Getting Started

### Installing

Please follow the below steps to build the environment.

Clone this repository to your local environment and change directoy to the file:
```
$ git clone https://github.com/OpenISDM/BOT-user-interface.git && cd BOT-user-interface
```

Install all the dependency in package.
```
$ npm i
```

Copy the `.env.example` and rename the to `.env`. Reset your local environment variable in `.env`.
```
$ cp .env.example .env
```

Buidling is almost done. Run the following to use webpack bundling:
```
$ npm run build
```
To initiate the web server, execute below:
```
$ npm run server
```
