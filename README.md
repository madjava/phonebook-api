# Phonebook API

The Phoobook API is a simple web serivce to find contact details from a phonebook database.

It supports `create`, `read`, `update` and `delete` operations.

It sits behind [JWT](https://jwt.io/) authentication, this has been implemented in a simple way for easy review and understanding using basic authentication.

## Setup

Check or download the project files from [Phonebook API](https://github.com/madjava/phonebook-api.git) on Github. [Node.js](https://nodejs.org/en/) must have been installed on the machine. I developed this on `v11.8.0`

In the root folder run

```bash
npm install
```

This will download all the requireed libraies from [NPM](https://www.npmjs.com/)

## Test

[Jest](https://jestjs.io/) was used are the test runner for this project.

To run all test cases run

```bash
npm test
```

## Start up

To start the service run

```bash
npm start
```

This will start the service on port `9002`. To use a different port run

```bash
PORT=<your port> npm start
```

Or update the **`PORT`** environment variable in the `.env` file in the root folder

## Database

On startup the service will attempt to load some default data for use after the service is up and runnning. Data generation was done with the help of [Faker](https://www.npmjs.com/package/faker).

The default database is an in-memory [MongoDb](https://www.mongodb.com/what-is-mongodb) database and was made possible by the use of the [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) library.

It loads by default `100` records. If you want more data generated then start the server with the environment variable like so or update the `MAX_RECORDS` environment variable in the `.env` file

```bash
MAX_RECORDS=<your option> npm start
```

`NOTE:` If you set a realy large number, give the process some time to finish, there is a log to the console when done to that effect.

## Authentication

All endpoints sit behind [JWT](https://jwt.io/) authentication and would require a valid token to fill user request.

This token is requested by sending a `x-phonebook-requester` in the header with a specific super secrete key to the `/auth` endpoint. For demo reasons only, your `x-phonebook-requester` key is logged to console on application startup. You can also find this value in the `.env` file. Idealy this would be passed via the host server environment variables.

Futher request would require the valid token to be present in the header. Token is valid for 12 hours so you can keep a referrence to it while having a play.

## Authentication Endpoints

`GET: /auth`

`HEADER:` **x-phonebook-requester**: **`cGhvbmVib29rYXBp`**

`RESPONSE:` A valid JWT token

## Data Endpoints

`GET: /api/phonebook`

`HEADER:` x-phonebook-token: `<valid-token>`

`RESPONSE:` All the phone contact details

--

`GET: /api/phonebook/:phonenumber`

`HEADER:` x-phonebook-token: `<valid-token>`

`RESPONSE:` Details for the record by phone number. e.g

```json
{
    "_id": "5e172227e4b5ca4b3658e094",
    "firstName": "Paolo",
    "lastName": "Crist",
    "phoneNumber": "026 4782 4373",
    "city": "Willhaven",
    "postCode": "EI2 5IF"
}
```

--

`PUT: /api/phonebook`

`HEADER:` x-phonebook-token: `<valid-token>`

`PAYLOAD:` The new record to create

```json
 {
    "firstName": "Victor",
    "lastName": "Huel",
    "phoneNumber": "0391 004 1888",
    "city": "South Cassiemouth",
    "postCode": "FP1 8ED"
}
```

`RESPONSE:` The newly create record, this data would have an `_id` property.

--

`DELETE: /api/phonebook/:id`

`HEADER:` x-phonebook-token: `<valid-token>`

`RESPONSE:` 200 OK status or relevant status on error

--

`GET: /api/phonebook/cities`

`HEADER:` x-phonebook-token: `<valid-token>`

`RESPONSE:` A list of all cities in the database

--

`GET: /api/phonebook/postcodes`

`HEADER:` x-phonebook-token: `<valid-token>`

`RESPONSE:` A list of all postcodes in the database

--

`GET: /api/phonebook/:city/:postcode`

`HEADER:` x-phonebook-token: `<valid-token>`

`RESPONSE:` A list of all records with city and postcode in the database

```json
[
    {
    "_id": "5e17788de925872185a6807f",
    "firstName": "Jacinthe",
    "lastName": "Hirthe",
    "phoneNumber": "0117 115 5142",
    "city": "Doloresstad",
    "postCode": "FL9 8EN"
},
{...}
]
```

--

## Environment Variables

You will find some environent variable is the `.env` file in the root folder. [env-cmd](https://www.npmjs.com/package/env-cmd) is used to manage this for local development and testing

## Comments on the project

* Other authenication techniques such as oAuth can be used, opted in to use a simpler JWT authentication process via simple authorisation process for this project to simplify for technical discussions.

* Database is in-memory, this is not how it should be in production. Idealy should be using another running mongodb instance or a service such as [MongoDB Atlas](https://www.mongodb.com/) if MongoDb is you Db of choice. This project aims to simplify so anyone setting up would not have to worry about data/database.

* Environment variable are either harcoded or passed when running the application. Idealy this would come from the environmet the application is runing in in a live environment.

* Limits on josn response and data pagination have to be enhanced in a production ready app. Data set is small in the project and would not clog the pipe.
