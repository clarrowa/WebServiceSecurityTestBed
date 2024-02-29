const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
    }

    // Node.js v16 
    console.log('Testing event: ' + JSON.stringify(event.path));

    // Because we're using a Cognito User Pools authorizer, all of the claims
    // included in the authentication token are provided in the request context.
    // This includes the username as well as other attributes.
    const username = event.requestContext.authorizer.claims['email'];
    const auth = event.requestContext.authorizer.claims['cognito:groups'];
    
    console.log('Authorization: ' + JSON.stringify(event.requestContext.authorizer));

    try {
      switch (event.path) {
        case "/createrecord":
          const requestBody = JSON.parse(event.body);
          const recordId = requestBody.Content.RecordId;
          const recordData = requestBody.Content.RecordData;
          
          createRecord(recordId, username, recordData ).then(() => {
            callback(null, {
                statusCode: 201,
                body: JSON.stringify({
                    RecordId: recordId,
                    UserId: username,
                    Data: recordData,
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            });
          }).catch((err) => {
            console.error(err);
            errorResponse(err.message, context.awsRequestId, callback)
          });
          break;
        case "/getrecords":
          if (auth === 'Admin') {
            //if admin allow user param
            const requestBody = JSON.parse(event.body);
            const userId = requestBody.Content.UserId;

            getRecords(username, userId, auth).then((data) => {
              callback(null, {
                statusCode: 201,
                body: JSON.stringify({
                  UserId: username,
                  RequestedId: userId,
                  Data: data,
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
              });
            }).catch((err) => {
              console.error(err);
              errorResponse(err.message, context.awsRequestId, callback)
            });
          } else {
            getRecords(username, '', auth).then((data) => {
              callback(null, {
                statusCode: 201,
                body: JSON.stringify({
                  UserId: username,
                  Data: data,
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
              });
            }).catch((err) => {
              console.error(err);
              errorResponse(err.message, context.awsRequestId, callback)
            });
          }
          break;
        case "/getactiveusers":
          if (auth === 'Admin') {
            getActiveUsers().then((data) => {
              callback(null, {
                statusCode: 201,
                body: JSON.stringify({
                  Data: data,
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
              });
            }).catch((err) => {
              console.error(err);
              errorResponse(err.message, context.awsRequestId, callback)
            });
          }
          break;
        case "/deleterecords":
          
          // check whats in body to determin if user specific
          break;
        default:
          throw new Error(`Misspelt route: "${event.path}"`);
      }
    } catch (err) {
      console.log('Error Thrown: ' + err.message);
    }

};

function createRecord(recordId, username, recordData) {
    return ddb.put({
        TableName: 'Records',
        Item: {
            RecordId: recordId,
            UserId: username,
            Data: recordData,
            RequestTime: new Date().toISOString(),
        },
    }).promise();
}

function getRecords(username, userId, auth) {
  if (auth === 'Admin' && userId) {
    return ddb.query({
      TableName: 'Records',
      IndexName: 'UserId',
      KeyConditionExpression: 'UserId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();
  } else {
    return ddb.query({
      TableName: 'Records',
      IndexName: 'UserId',
      KeyConditionExpression: 'UserId = :username',
      ExpressionAttributeValues: {
        ':username': username
      }
    }).promise();
  } 
}

function getActiveUsers() {
  return ddb.scan({
    TableName: 'Records',
    ProjectionExpression: 'UserId',
  }).promise();
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}