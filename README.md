# CraftTurf - Senior Backend Engineering Test

You are required to complete as much as you can of the following tasks below.

## Prerequisites

- `"node": ">=12"`
- Install `yarn` globally
- Install `mongod` version `4.4.10`
- Add `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` npm token to your path.

## Task 1: Setup

Setup the repo on your system.

```sh
# Install the node modules
$ yarn
# Start the api server
$ yarn dev
# Health check - running the command below should give you "OK" response
$ curl -X 'GET' 'http://127.0.0.1:4090/monitoring/healthz' -H 'accept: application/json'
```

## Task 2: Data Modelling of FHIR `Medication`

Study the FHIR [Medication](https://www.hl7.org/fhir/medication.html) (UML) model and its relationship with `Ingredient` and `Batch`.

- Translate the model to codebase in `src/persistence/Medication/model.ts`.
- The relationships should be maintained in the `MedicationSchema` as embedded collections.
- In `/doc/Test.md`, add comments on your design implementation and suggests ways it can be improved if any.

### NOTE

- The `manufacturer` (brand name) attribute should be a text type field.

## Task 3: Querying `Medication`

Study the existing files `queries.ts` and `queries.test.ts` in `Medication` directory.

```sh
# Run the tests: 1 Test Suite, 2 Tests passing...
$ yarn test queries.test.ts
```

1. Complete the test coverage for the remaining operations:

 - `findAll`
 - `findById`
 - `removeById`
 - `updateById`


2. Modify the `findAll` operation to query as follows:

 - sorted text search (in ascending order) for medication by `manufacturer` (brand name);
 - update test for sufficient coverage.


3. Create a new operation; `findByExpirationDate`.


## Task 4: Optimisation (BONUS)

To test the performance of your `Medication` data structure, populate with large dataset.

1. You can follow the example [here](https://docs.mongodb.com/v2.6/tutorial/generate-test-data/).
 - Load 10,000 or more records.
 - Create samples from this online [drug](https://www.drugs.com/drug_information.html) database
 - You can write your script in a language of your choice.
 - Save your script in `/scripts` directory.


2. Run the following search operations usinf your favourite mongodb client tool (i.e. MongoDB compass) and make comments of your observations in terms of performance in `/doc/Test.md`:

 - `findById`
 - `findAll`
 - `findByExpirationDate`

3. Make optimisation adjustments to `model.ts` where necessary and add comments.
