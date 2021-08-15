# solita-vaccination-exercise

Below are the instructions for setting up, building and running the web. The instructions are intended for Mac/Linux.

## Running the application

1. [Install PostgreSQL.](https://www.postgresql.org/download/)

  * Please note that by default the installation of PostgreSQL creates a user and a database with the same name. Depending on the platform and method of installation, the names will differ. For example on Mac and Postgres.app, the user name and the database name will be the same as that of the current user, and there will be no password. On Ubuntu, the default name will be 'postgres', and a password needs to be set:

```
sudo -u postgres psql postgres
\password
\q
```

  * Please refer to your preferred method of installation on the necessary steps to create a user, a database and possibly a password.

2. [Install Node.js.](https://nodejs.org/en/download/)

3. Copy or clone the repository:

```git clone https://github.com/maarila/solita-vaccine-exercise.git```

4. Change directory to the copied repository:

```cd solita-vaccine-exercise/```

5. Restore the database. Replace the DBNAME with the username used when installing PostgreSQL (see 1). 

Mac and Postgres.app:

```psql DBNAME < orders_and_vaccinations.sql```

Ubuntu:

```sudo -u postgres psql postgres < orders_and_vaccinations.sql```

Alternatively see section 'The original method of initialising the database' for instuctions how to initialise the database directly from the source files (ending in the same state as by restoring the dump).

6. Edit the file utils/config.js and replace the 'user' and 'database' entries with correct information. The replacement operation can be made, for instance, with sed:

Ubuntu:

```sed -i "s/dev/postgres/g" utils/config.js```

Mac:

```sed -i '' "s/dev/$(USER)/g" utils/config.js```

7. Install backend dependencies:

```npm install```

8. Install frontend dependencies:

```
cd front-end-for-vaccine-exercise
npm install
```

9. Start up another terminal, change directory to solita-vaccine-exercise and run the backend with:

```npm start```

10. Run the frontend from the other terminal with:

```npm start```

11. The browser should open automatically at 'http://localhost:3000'.

## Building the app

1. Change directory to solita-vaccine-exercise.

2. Run npm script to build the app:

```npm run build:ui```

## Running tests

### Backend integration tests:

1. Make sure your current directory is the root directory of the app, i.e. solita-vaccine-exercise.

2. Run tests with:

```npm run test```

### End-to-end tests:

NOTE: the end-to-end tests expect that both the backend and frontend are running! In other words, before running the tests start the backend with ```npm start``` and then from another terminal change to frontend-for-vaccine-exercise and start the frontend with ```npm start```. The tests are run from the root directory solita-vaccine-exercise.

Running the tests with a graphical interface:

```npm run cypress:open```

Running the tests from the command line:

```npm run cypress:e2e```

### Frontend unit tests:

Change directory to frontend-for-vaccine-exercise:

```cd frontend-for-vaccine-exercise```

Run the tests:

```CI=true npm test```

## The original method of initialising the database

After installing the PostgreSQL database, the database can also be initialised with the following steps:

1. Change directory to the repository root:

```cd solita-vaccine-exercise```

1. Run the Python script to convert the original source files (located in /original-source-data) into CSV files (saved at /resources).

```python3 convert-source-data-to-csv.py```

2. Login to the database:

```psql```

(depending on the platform)

3. Create the necessary tables with the following commands:

```CREATE TABLE orders (
    id varchar(255) PRIMARY KEY,
    order_number integer,
    responsible_person varchar(255),
    healthcare_district varchar(255),
    vaccine varchar(255),
    injections integer,
    arrived timestamp
)```

and

```CREATE TABLE vaccinations (
    vaccination_id varchar(255) PRIMARY KEY,
    source_bottle varchar(255) REFERENCES orders (id),
    gender varchar(255),
    vaccination_date timestamp
)```

4. Run the following commands to copy data from the CSV files to the tables that were just created. **Please note: replace the file path with the path to the solita-vaccine-exercise directory.**

```
COPY orders(id, order_number, responsible_person, healthcare_district, vaccine, injections, arrived)
FROM '/path/to/solita-vaccine-exercise/resources/orders.csv'
DELIMITER ';'
CSV HEADER;
```

```
COPY vaccinations(vaccination_id, source_bottle, gender, vaccination_date)
FROM '/path/to/solita-vaccine-exercise/resources/vaccinations.csv'
DELIMITER ';'
CSV HEADER;
```

5. Exit the database interface:

```\q```

## Features to be implemented

* implement further statistics:
  * data by day
  * data by healthcare district (with filtering)  
  * data by individual order / vaccination
* improve error handling (by a lot)
* enable logging
* improve test coverage (by a lot)
* improve HTML semantic tagging
* improve the view responding poorly to resizing
* default datetime picker needs replacing - works ok-ish on Chrome, poorly on Firefox, weirdly on Safari

