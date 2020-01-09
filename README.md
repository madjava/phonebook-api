# Phonebook API

The Phoobook API is a simple web serivce to find contact details.

It supports `create`, `read`, `update` and `delete` operations.

It also sits behind JWT authentication, this has been implemented in a simple way for easy review and understanding using baisc authentication.

## Setup

Check or download the project files from [Phonebook API](https://github.com/madjava/phonebook-api.git) on Github. `Note:` [Node.js](https://nodejs.org/en/) must have been installed on the machine

In the rook folder run

```bash
npm i
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

## Database

On startup the service will attempt to load some default data for use in the application. Data generation was done with the help of [Faker](https://www.npmjs.com/package/faker).

The default database is an in-memory [MongoDb](https://www.mongodb.com/what-is-mongodb) database and was made possible by the use of the [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) library.

It loads by default 100 records. If you want more data generated then start the server with the environment variable like so

```bash
MAX_RECORDS=<your option> npm start
```

`NOTE:` If you set a realy large number, give the process some time to finish, there is a log to the console when done to that effect.

## Authentication

All endpoints sit behind [JWT](https://jwt.io/) authentication and would require a valid token to fill user request.

This token can is requested by sending a `x-phonebook-requester` header to the /auth endpoint. For demo reasons only, your x-phonebook-requester key is logged to console on application startup

Futher request would require the valid token tp be present in the header. Token is valid for 12 hours so you can keep a referrence to it while having a play.

### Authentication Endpoints

`GET: /auth`

`HEADER:` **x-phonebook-requester**: **`cGhvbmVib29rYXBp`**

`RESPONSE:` A valid JWT token

## Data Endpoints

`GET: /api/contacts`

`HEADER:` x-phonebook-token: `<valid-token>`

`RESPONSE:` All the phone contact details

--

`GET: /api/contact/:phonenumber`

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

`PUT: /api/contact`

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

`DELETE: /api/contact/:id`

`HEADER:` x-phonebook-token: `<valid-token>`

`RESPONSE:` 200 OK status or relevant status on error

--

## Comments on the project

* Authenication could have been implemented with oAuth, opted in to use a simpler process via baisic authorication for this project to simplyfy technical discussions around authentication

* Database in in memory, this is not how it should be in production. Idealy should be using another runing mongodb instace. THis project aims to simplefy so anyone setting up would not have to worry about data/database

* Environment variable are either harcoded or passed when running the application. Idealy this would come from the environmet the application is runing in in a live environment.
