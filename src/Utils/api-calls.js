// authToken = session.getIdToken().getJwtToken()

// idToken is jwttoken https://docs.amplify.aws/javascript/build-a-backend/restapi/customize-authz/#pageMain

//AXIOS FOR AJAX REQUESTS - with headers https://stackoverflow.com/questions/44617825/passing-headers-with-axios-post-request

// function requestUnicorn(pickupLocation) {
//     $.ajax({
//         method: 'POST',
//         url: _config.api.invokeUrl + '/ride',
//         headers: {
//             Authorization: authToken
//         },
//         data: JSON.stringify({
//             PickupLocation: {
//                 Latitude: pickupLocation.latitude,
//                 Longitude: pickupLocation.longitude
//             }
//         }),
//         contentType: 'application/json',
//         success: completeRequest,
//         error: function ajaxError(jqXHR, textStatus, errorThrown) {
//             console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
//             console.error('Response: ', jqXHR.responseText);
//             alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
//         }
//     });
// }


// PUT /putrecord/{recordid}/{userid}/{content}
// DELETE /recordsbyuser/{userid}
// GET /recordsbyuser/{userid}

// https://stackoverflow.com/questions/59596722/aws-cognito-integration-with-a-beta-http-api-in-api-gateway - authorizer