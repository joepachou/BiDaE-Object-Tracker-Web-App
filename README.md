# BOT-user-interface

This repository includes both the UI interface and the web server.

## Getting Started

### Installing

Follow the below command to build the environment.

First, clone this repository to your local environment and change directoy to the file:
```
$ git clone https://github.com/OpenISDM/BOT-user-interface.git && cd BOT-user-interface
```

Install all the dependency in package.
```
$ npm i
```

copy the `.env.example` and reset the name `.env`. Reset the environment variable in `.env`.
```
$ cp .env.example .env
```

Buidling is almost done. Run the following to initiate the web server:
```
$ npm run server
```
If these are any revise, please run below before initation.
```
$ npm build
```
