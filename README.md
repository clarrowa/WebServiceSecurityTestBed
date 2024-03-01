# Project Synopsis

A test bed for investigating security solutions that can be applied to existing web services.

Git Repository: https://github.com/clarrowa/WebServiceSecurityTestBed

This Web Application consists of a frontend React.js application and a backend serverless Node.js REST API, hosted on AWS Amplify using AWS services Cognito, IAM, Lambda, DynamoDB, API Gateway.

This application facilitates two types of user, regular and Admin. 

A regular user can retrieve their DynamoDB table records, create new records and update existing records.

An Admin user has additional capabilities, they can get the usernames(emails) of users that have records in the DynamoDB table, they can get the records specific to each user listed and delete specific individual records by their RecordId and the UserID at their disposal.

Authentication is performed through the use of Amplify Authenticator in conjunction with a Cognito userpool access tokens.

## OWASP Vulnerabilities targeted in this project

1.

2.

3.

## Frontend

The frontend web application is a basic React App utilising the Polaris component library, jQuery for AJAX API calls, react-dom for page routing, Amplify for Amplify integration and authentication to provide a test bed for OWASP vulnerability testing.

### Amplify



### Index.js


### App.js


### Components


#### common.js


### Pages


#### Home.js


#### Search.js


#### Admin.js


### Utils

#### aws-exports.js



## Backend

Infrastructure as code - future goal

### Cognito



### Lambda 

#### lambda/webLambda.js

#### test

createRecordTest.json -

deleteRecordTest.json -

getActiveUsersTest.json -

getRecordsAdminTest.json -

getRecordsNonAdminPayloadTest.json -

getRecordsNonAdminTest.json -


### DynamoDB

DynamoDB Tables are schemaless but we can get the table structure through the use of the DescribeTable action. 

(Note, authorization for this action was briefly configured in one of the IAM roles and then promptly removed, there is no standard authorization that would allow any user to access this schema.)

'Records' table structure:

{
    "Table": {
        "AttributeDefinitions": [
            {
                "AttributeName": "RecordId",
                "AttributeType": "S"
            },
            {
                "AttributeName": "UserId",
                "AttributeType": "S"
            }
        ],
        "TableName": "Records",
        "KeySchema": [
            {
                "AttributeName": "RecordId",
                "KeyType": "HASH"
            },
            {
                "AttributeName": "UserId",
                "KeyType": "RANGE"
            }
        ],
        "TableStatus": "ACTIVE",
        "CreationDateTime": "2024-02-28T16:38:51.505Z",
        "ProvisionedThroughput": {
            "LastDecreaseDateTime": "2024-02-28T16:49:12.389Z",
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 1,
            "WriteCapacityUnits": 1
        },
        "TableSizeBytes": 544,
        "ItemCount": 6,
        "TableArn": "TABLE_ARN/Records",
        "TableId": "b191b544-5941-4a00-af68-d27af4f4fb87",
        "GlobalSecondaryIndexes": [
            {
                "IndexName": "UserId",
                "KeySchema": [
                    {
                        "AttributeName": "UserId",
                        "KeyType": "HASH"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "IndexStatus": "ACTIVE",
                "ProvisionedThroughput": {
                    "NumberOfDecreasesToday": 0,
                    "ReadCapacityUnits": 1,
                    "WriteCapacityUnits": 1
                },
                "IndexSizeBytes": 544,
                "ItemCount": 6,
                "IndexArn": "SECONDARY_INDEX_ARN/Records/index/UserId"
            }
        ],
        "TableClassSummary": {
            "TableClass": "STANDARD"
        },
        "DeletionProtectionEnabled": false
    }
}

The primary key is RecordId, the sort key is UserId. This is so that the table can be queried by UserId to get records per user. I created a global secondary index UserId for this purpose, required for the DynamoDB.DocumentClient query call. 

DynamoDB maintains unique records, a primary key and a sort key form a complex key that allows different users to have records with the same RecordId but different UserIds (taken from cognito auth tokens, a regular user cannot enter UserId as a param or manipulate its value).


### IAM Roles


### API Gateway




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
