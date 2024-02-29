// AWS cognito user pool region, id, and app client id details
export const amplifyConfig = {
    Auth : {
        Cognito: {
            userPoolId: 'us-east-1_yGdNyZwuc',
            userPoolClientId: '5t5jqvhob03ha245l9o4r6tbgm',
            region: 'us-east-1',
        }
    },
    api: {
        invokeUrl: 'https://rxunioy1y1.execute-api.us-east-1.amazonaws.com/prod',
    }
}

// https://ui.docs.amplify.aws/react/connected-components/authenticator/advanced#access-authenticated-user