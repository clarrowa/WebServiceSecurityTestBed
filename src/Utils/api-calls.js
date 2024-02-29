import { useState, useCallback } from 'react';

// Amplify
import { fetchAuthSession } from "aws-amplify/auth";

import jQuery from 'jquery';
import { amplifyConfig } from "./aws-exports";

async function createRecord(recordId, recordData) {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};

      jQuery.ajax({
        method: 'POST',
        url: amplifyConfig.api.invokeUrl + '/createrecord',
        headers: {
            Authorization: idToken
        },
        data: JSON.stringify({
            Content: {
                RecordId: recordId,
                RecordData: recordData
            }
        }),
        contentType: 'application/json',
        success: completeReturn,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            console.error('Error creating record: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR.responseText);
            alert('An error occured when creating record:\n' + jqXHR.responseText);
        }
        });
    } catch (err) {
      console.log(err);
    }
}

function completeReturn(result) {

    return (
        result
    );
}

export {
    createRecord
};