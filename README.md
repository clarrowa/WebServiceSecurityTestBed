# Project Synopsis

A test bed for investigating security solutions that can be applied to existing web services.

Git Repository: https://github.com/clarrowa/WebServiceSecurityTestBed

This Web Application consists of a frontend React.js application and a backend serverless Node.js REST API, hosted on AWS Amplify using AWS services Cognito, IAM, Lambda, DynamoDB, API Gateway.

This application facilitates two types of user, regular and Admin. 

A regular user can retrieve their DynamoDB table records, create new records and update existing records.

An Admin user has additional capabilities, they can get the usernames(emails) of users that have records in the DynamoDB table, they can get the records specific to each user listed and delete specific individual records by their RecordId and the UserID at their disposal.

Authentication is performed through the use of Amplify Authenticator in conjunction with a Cognito userpool access tokens.

## OWASP Vulnerabilities targeted in this project

OWASP list: https://www.hacksplaining.com/owasp

1. Broken Access Control - Users acting outside of their intended permissions. 

2. Cryptographic Failures - Unprotected sensitive data that can be used credit card fraud, identity theft, or other crimes.

3. Injection -  Untrusted data sent to an interpreter as part of a command or query that is then unintentionally executed.

### Broken Access Control

The type of access control most prevalent within this web application is vertical access control, mechanisms that restrict access to sensitive functionality to specific types of users, a regular user can not access the Admin page. If a user is able to then this is an example of vertical access escalation, a critical vulnerability if said Admin page facilitates delete actions.

In this web application Cognito access tokens are utlilised in authentication and they are stored in local storage, users are authenticated on page render and navigated away from the Admin page if they are not sufficiently authorised. This is an example of Parameter-based access control, wherein access data is stored in a user accessible location, in this case local storage. Therefore there is a vulnerability, a user could change their parameter's in an attempt to access the Admin page.

Access tokens are specific to individual users registered in Cognito, therefore even if a users was able to acquire an Admin token they will not be able to access they will not be able to bypass access control without both the username and the password, both of which are encrypted and hidden from the user via Amplify authenticator communicating with the Cognito userpool.

The test case: can a user email gain admin access using an Admin token. To perform this test I will be utilising Burp suite, a freely available application for web application penetration testing, wherein I will be replacing a user access token returned by Cognito with an Admin authentication token. The user's false token will be revoked and they will be unable to access the Admin page as they will revert back to their assigned token.

Test execution is viewable in the OWASPBurpSuiteTests.mp4 at /owasp, wherein the user attempting to alter their access token is returned an error and subsequently logged out.

Storing session tokens in local storage: https://portswigger.net/research/web-storage-the-lesser-evil-for-session-tokens
https://portswigger.net/web-security/access-control#vertical-privilege-escalation

### Cryptographic Failures

The sensitive data specific to this web application are the user credentials stored in the Cognito userpool, obtaining a valid username is all that is required for an attacker to setup a specific brute force attack designed to gain access to the user account. 

To protect this data one can implement functionality that obfuscates any API response that would disclose valid user data, in this instance a valid username. AWS Cognito provides such functionality, through the 'Prevent User existence' tag that has been applied to this web applications userpool. It is an option that can be set during the initial configuratio of a Cognito userpool and is set by default, when configuring Cognito in CDK using a IaC(Infrastructure as Code) model it is default to off, a security configuration that can be easy to miss. 

Given this funtionality is implemented a brute force attack against the login attempting to validate a user input for further attacks should fail, this is the test case for this OWASP vulnerability. To perform this test I will be utilising Burp Suite, specifically following a variation of this tutorial: https://portswigger.net/support/using-burp-to-brute-force-a-login-page.

Test execution is viewable in the OWASPBurpSuiteTests.mp4 at /owasp, wherein the proctection of data is displayed given the response returns 'Incorrect username or password' rather than 'Incorrect password' for the correct username user1@gmail.com.

### Injection



## Frontend

The frontend web application is a basic React App utilising the Shopify Polaris component library, jQuery for AJAX API calls, react-dom for page routing, Amplify for Amplify integration and authentication to provide a test bed for OWASP vulnerability testing.

### Amplify

AWS Amplify provides fully managed CI/CD for both frontend and backend application development, in this case it has been used to host and deploy the GIT repository, through a pipeline consisting of build and deploy. 

Amplify authentication interconnects with AWS Cognito resources to facilitate user management, the Authenticator component has been used to manage login and account registration.

### Index.js

The root of the project, the Amplify Authenticator provider wraps the main react Shopify Polaris application, enabling the Authenticators use throughout the application.

### App.js

Defines the routing of the application, wrapped in the Amplify Authenticator. Its implementation in this file enables authentication on every page, assessing the existence of Cognito auth tokens to allow general access.

### Components

File location for custom react components that can be used across the application.

#### common.js

Common components for use across the application, base react application only contains a custom dropdown menu functional component that is used for general page navigation and logging out, clearing cached access tokens. This component utilises Amplify useAuthenticator function that enables signout of specific user(current user).

### Pages

File location for page components, base application consisting of Home, Search and Admin.

#### Home.js

Application landing page following a successful login, it displays the current user taken from the Amplify authSession propogated by the Authenticator. This page can be extended in the future to include account management but for the default application it only displays the current username and uses the dropdownmenu component to traverse the application.

#### Search.js

General service page, through this page both Admin and regular users can make Create, Read and Update API calls, specifically creating, viewing and updating their database records. Users have to be authenticated to make these API calls, the backend AWS Lambda function verifies authentication.

#### Admin.js

On page render the authentication of a user is assessed, the page only renders if the user is a member of the specific Admin Cognito user group, a group that can only be applied to a user on the AWS console, there is no way for a regular user to add themselves to the Admin group through the web application.

### Utils

Folder containing non-react component functions and constants, for modularisation.

#### aws-exports.js

Defines Amplify and AWS configuration, the Cognito user pool and API invokation url.

## Backend

AWS services facilitate infrastructure as code(IaC) implementations, through the uses of CDK and other such tools. IaC would be a future desired state for this web application as then both frontend and backend could be deployed via the Amplify pipeline, through the build and deploy stages, even a test stage for the Lambda tests that exist in this application.

That being said I have used the Infrastructure as a Service(IaaS) model to provision the backend resources for this application, using the AWS console. IaaS has enabled the backend stack to be quickly generated with secure stock configurations, in comparison to an IaC implementation there is less manual configuration which reduces the chances of vulnerabilities from security misconfiguration or cryptographic failures.

### Cognito

AWWS Cognito provides access management services that can freely scale and integrates with other AWS services. 

WebServiceSecurityTestBed-UserPool is the userpool that has been configured for this application, the user directory for access control. This userpool is configured to enable email sign-in, the username required is an email and the user has to verfiy via their emaill to access the application. Users in a userpool can be assigned to groups that can be used to dictate authentication considerations, in this case there is a single Admin group that a user has to be assigned to in the AWS console.

The userpool could be but is not currently configured to require MFA as an additional layer of security, however the Cognito Prevent User existence function is configured, which triggers Cognito to return non-specific information when a response may disclose that a valid user exists. This is relevant for the OWASP cryptographic failures, protecting sensitive data that could be leveraged by bad actors, for instance a valid username would indicate that said user account could be brute forced.

### Lambda 

AWS Lambda provides the serverless backend, enabling the backend service to run without server provision or management and for tests to be run against the service. 

#### lambda/webLambda.js

The webLambda file contains the Lambda function that is run, it contains the CRUD operations to be performed on the DynamoDB table and performs the required authentication for said operations.

The function throws an error if the request event does not contain the required Cognito authentication tokens, the error is logged and the function returns null, blocking the attempt at unauthorised API calls.

User data and authentication is lifted from the request event to be utilised throughout the function.

A switch statement dictates the functions called depending on the event.path, the specific API calls. For each API call different request event data is extracted from and used by module functions that perform CRUD operations on the NoSQL DynamoDB table specific to the user and their level of authentication. For example, delete operations and the Admin get operation that returns confidential user data(the email usernames present in the table) are protected by authentication checks and in the case of missing authentication their request data is either ignored or an error is thrown.

The getRecords function is specialised to the extent that only an authenticated Admin user can pass request data in the GET request to retrieve user records other than their own, a non Admin user could make the request with a payload but the payload will never be utilised or accessed due to the lack of Admin authentication in the request.

The DynamoBD document client methods query and scan are both used but have different functions, query returns the values of a specific search given a specific index and value, whereas scan returns all values that fit a given expression without any expected input. Query is used to get records created by a specific user and scan is used to get a list of all the records' users.

https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

#### test

AWS Lambda enabled the development of test events that can be run directly on the Lambda function. The tests are recorded in the /backend/test folder and are run against the Lambda function within the IaaS AWS console. At point of writing these tests are uptodate and execute with successful 201 responses.

createRecordTest.json - The test evaluates an autheticated payload can store an item in the DynamoDB table.

deleteRecordTest.json - The test event evaluates an authenticated Admin with payload, a user with the cognito group Admin present within their authentication tokens.

getActiveUsersTest.json - The test event ensures an authenticated Admin can make the API call to retrieve a list of usernames(emails) that have created records. 

getRecordsAdminTest.json - The test event asserts that an Admin can retrieve the records of a specific user contained in the payload.

getRecordsNonAdminPayloadTest.json - The test event asserts that regardless of payload the non Admin user only receives their own records, the payload is disregarded and the response is identical to a request made without a payload. This is visible in the successful responses detailed in the two files.

getRecordsNonAdminTest.json - The test event  asserts that any user can retrieve their own records with an empty payload.

### DynamoDB

AWS DynamoDB is a NoSQL database service that enables item querying through the use of key-value pairs. The use of a NoSQL database service neutralises any potential SQL attacks given the lack of SQL in use, there are no queries to subvert, but does risk NoSQL threats of similar standing.

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

The primary key is RecordId, the sort key is UserId. This is so that the table can be queried by UserId to get records per user. There is a global secondary index UserId for this purpose, required for the DynamoDB.DocumentClient query call. 

DynamoDB maintains unique records, a primary key and a sort key form a complex key that allows different users to have records with the same RecordId but different UserIds (taken from cognito auth tokens, a regular user cannot enter UserId as a param or manipulate its value).

### IAM Roles

AWS Identity and Access Management(IAM) enables the configuration of different identities facilitating secure access control, to this end this full stack web application has a configured identity enabling secure communication between the different elements of the backend stack. 

The SecurityTestBedBackendRole is configured with three permission policies, AWSLambdaBasicExecutionRole, DynamoDBLimitedReadAndDelete and DynamoDBWriteAccess, enabling the required functions of the Lambda function, defining its authorised actions with other services.

AWSLambdaBasicExecutionRole - The policy enables the Lambda function to make CloudWatch log actions, CreateLogGroup, CreateLogStream and PutLogEvents. This facilitates the logging of errors, it does not allow any Lambda function call to delete log groups.

DynamoDBLimitedReadAndDelete - The policy enables the Lambda function to perform defined DynamoDB actions, DeleteItem, GetItem, Scan and Query only on a specific table, the Records table created for this web application referenced specifically by AWS resource arn. There are many more potential actions that are not enabled by this policy, such as batchWriteItem that can be used to delete records in groups of 25 that could be misused to wipe to table.

DynamoDBWriteAccess - The policy enables the Lambda function to perform defined DynamoDB actions, PutItem and DescribeTable on the specified table. 

### API Gateway

AWS API Gateway enables API creation, configuration and deployment, in the case of this backend stack it provides CORS support and Cognito authentication with Lambda integration.

WebSecurityAPI is a REST API created in API Gateway that is integrated with Lambda and facilites the requests and respones, defining the API Call routes and authorisation.

To enable authentication an Authorizor named WebSecurityAuth configures the userpool WebServiceSecurityTestBed-UserPool as the source of tokens and the request header that contains the authorization token, in this cast the header is Authorization, it is present in the test request used against the Lambda function.

This Authorizor is applied to each route defined in the REST API:

POST /createRecord - Post request that can be used for either create or update actions.

DELETE /deleterecords - Delete request that is used to pass data configuring delete operations.

GET /getactiveusers - Get request that doesn't require a payload, performs a scan of the DynamoDB table in the Lambda function to return a list of users.

POST /getusers - Post request that can contain payload data, the risk of misuse is negated by the authentication performed in the Lambda function, making any non Admin payload data null and void.


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
