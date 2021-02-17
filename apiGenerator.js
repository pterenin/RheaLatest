let _ = require('lodash');
let fs = require('fs');
let axios = require('axios');
let R = require('ramda');

/**
 * Authors: Aaron Harrington, David Lewton, Harpreet Singh
 * Created: 21 June 2017
 *
 * Purpose: This file generates code for the api.js file and automatically generates and
 *          replaces the fixtures for each endpoint as well as the api.js file.
 *          It is also currently reading the swagger file from a hardcoded location.
 *          This should be changed in the future to take an argument.
 */

console.log('Starting node applicaiton ');

let swaggerJson;

const defaultUrl =
  process.env.USE_LOCAL_API_SERVER === 'true'
    ? 'http://localhost:3001'
    : 'http://52.41.220.184:8080/api';

const apiBaseUrl = process.env.API_BASE_URL || defaultUrl;
const apiUrl = `${apiBaseUrl}/v2/api-docs?group=/*`;
const timeout = process.env.API_REQUEST_TIMEOUT_MILLIS || 15000;

const maxContentLength =
  process.env.API_MAX_CONTENT_LENGTH_BYTES || 5 * 1000 * 1000;

console.log(`Generating api from docs at: ${apiUrl}`);

axios({
  method: 'GET',
  url: apiUrl,
  timeout,
  maxContentLength
})
  .then(res => {
    if (res.status === 200) {
      console.log('got 200 resp');
      swaggerJson = res.data;
      generateResponseJson();
      console.log(`Success.`);
    } else {
      throw new Error(`[${res.status}] Failed to fetch the API spec.`);
    }
  })
  .catch(e => {
    console.error('Error fetching data from locally running server', e);
  });

function generateResponseJson() {
  console.log('generateResponseJson : ' + swaggerJson.paths);
  let filesToCreate = {};
  let functionsToCreate = [];
  let fixtureFunctionsToCreate = [];
  let functionNames = [];

  // const cacheBustingString = '?d=${Date.now()}';
  const cacheBustingString = '';

  _.forEach(swaggerJson.paths, (path, pathString) => {
    _.forEach(path, (methodDef, methodName) => {
      let pathParts = pathString.split('/').filter(p => !_.isEmpty(p.trim()));

      // These endpoints are desired, but the names are too long and cause the generator to crash
      if (pathParts[0] === 'data-flows') {
        return;
      }

      console.log('method', methodName);
      const functionName = generateFunctionName(methodName, pathString);

      if (functionNames.includes(functionName)) {
        throw new Error(
          `There are multiple functions named "${functionName}".`
        );
      }

      filesToCreate[functionName] = generateSchemaObject(methodDef);

      // --- Start Building Function Generation ---
      const headerString =
        (methodDef.produces || []).length > 0
          ? ` headers : { 'Accept': '${R.join(',', methodDef.produces)}'} `
          : 'undefined';

      const jsPathStr = R.replace(/{/g, '${', pathString);
      const pathGenCode = '`' + `/api${jsPathStr}${cacheBustingString}` + '`';
      const methodCall = `this.http.${methodName}`;

      if (!R.isNil(methodDef.parameters)) {
        const { bodyParameters, funcParams } = setupParamStrings(
          methodName,
          methodDef.parameters
        );

        const functionBody =
          methodName === 'get' || methodName === 'delete'
            ? `  return ${methodCall}(\n` +
              `      ${pathGenCode},\n` +
              `      { ${headerString}, params: ${bodyParameters} }\n` +
              `    );`
            : `  return ${methodCall}(\n` +
              `      ${pathGenCode},\n` +
              `      ${bodyParameters},\n` +
              `      { ${headerString} }\n` +
              `    );`;

        functionsToCreate.push(
          `` +
            `${functionName}(${funcParams}): Observable<any> {\n` +
            `  ${functionBody}\n` +
            `  }\n`
        );
      } else {
        const functionBody =
          `  return ${methodCall}(\n` +
          `      ${pathGenCode},\n` +
          `      { ${headerString} }\n` +
          `    );`;

        functionsToCreate.push(
          `` +
            `${functionName}(): Observable<any> {\n` +
            `  ${functionBody}\n` +
            `  }\n`
        );
      }
      // --- End Building Function Generation ---

      functionNames.push(functionName);
    });
  });

  console.log('completed for each');
  _.forEach(filesToCreate, (content, name) => {
    fs.writeFileSync(
      `./src/assets/fixtures/${name}.json`,
      JSON.stringify(content, null, 2)
    );

    fixtureFunctionsToCreate.push(
      `` +
        `${name}: () => {\n` +
        `    return _.cloneDeep(require('../../../../assets/fixtures/${name}.json'));\n` +
        `  },\n`
    );
  });

  console.log('creating api-create.service.ts');
  fs.writeFileSync(
    './src/app/shared/services/api/api.service.ts',
    createApiJs(
      R.join('\n  ', functionsToCreate),
      R.join(',\n    ', functionNames)
    )
  );

  console.log('created ...');
  fs.writeFileSync(
    './src/app/shared/services/api/fixtureApi.service.ts',
    createFixtureApi(R.join('\n  ', fixtureFunctionsToCreate))
  );
}

function setupParamStrings(methodName, parameters) {
  const paramStringFor = testFn =>
    R.join(
      ', ',
      _(parameters)
        .filter(testFn)
        .map(p => p.name)
        .value()
    );

  let formDataParameters = paramStringFor(
    p => p.in === 'formData' || p.in === 'file'
  );

  let bodyParameters = paramStringFor(p => p.in === 'body' || p.in === 'query');
  let pathParameters = paramStringFor(p => p.in === 'path');
  let funcParams = paramStringFor(p => p);

  const hasRequestBody = _.filter(parameters, p => p.in === 'body').length > 0;
  const isGetWithBody = !_.isEmpty(bodyParameters) && methodName === 'get';
  const isFormPost = !_.isEmpty(formDataParameters) && methodName === 'post';
  const isMultiDelete = hasRequestBody && methodName === 'delete';

  const hasNoPushParams =
    _.isEmpty(bodyParameters) && _.isEmpty(formDataParameters);

  if (isGetWithBody) {
    // Result: { name1, name2, name3 }
    bodyParameters = '{ ' + bodyParameters + ' }';
  } else if (hasNoPushParams) {
    // Result: {}
    bodyParameters = '{}';
  } else if (isFormPost) {
    // FormData needs to be passed in as a FormData Object - push everything into "data"
    // Add in a parameter for directly passing values to axios, along with the form data params

    // Result: pathParam1, pathParam2, pathParam3, data /* param1, param2 */, axiosParams
    const pathParamString = !_.isEmpty(pathParameters)
      ? pathParameters + ', '
      : '';

    funcParams = `${pathParamString}data /* ${funcParams} */, axiosParams`;

    // Result: { data, ...axiosParams }
    bodyParameters = '{ data, ...axiosParams }';
  } else if (isMultiDelete) {
    // super hack to get axios config to alter delete behavior
    // apiSauce will by default set the params in the query string for deletes
    // there should be a more general way of doing this

    // Result: { data: bodyParam1, bodyParam2 }
    bodyParameters = `{ data: ${bodyParameters} }`;
  }

  return { bodyParameters, funcParams };
}

function generateFunctionName(httpMethod, apiPath) {
  let functionPrefix = httpMethod;

  if (functionPrefix === 'post') {
    functionPrefix = 'create';
  } else if (functionPrefix === 'put') {
    functionPrefix = 'update';
  }

  // _.camelCase function removes spaces
  return _.camelCase(functionPrefix + ' ' + apiPath);
}

// ------------------- START FIXTURE VALUE CREATION FUNCTIONS -------------------
function generateSchemaObject(methodDef) {
  const schemaRefExists =
    !R.isNil(methodDef.responses['200'].schema) &&
    !R.isNil(methodDef.responses['200'].schema['$ref']);

  if (!schemaRefExists) {
    return {};
  }

  return {
    data: convertDefinition(
      resolveDefinition(methodDef.responses['200'].schema['$ref'])
    ),
    status: 200,
    ok: true
  };
}

function resolveDefinition(ref) {
  let path = ref.split('/')[2];
  //console.log('path : ' + path);
  return swaggerJson.definitions[path];
}

function convertDefinition(definition) {
  //console.log('convertDefinition')
  return _(definition.properties)
    .mapValues((prop, propName) => {
      // console.log('key : ' + propName);

      if (
        propName === 'parentOrganization' ||
        propName === 'absoluteFile' ||
        propName === 'parentFile' ||
        propName === 'canonicalFile' ||
        propName === 'legalEntity' ||
        propName === 'country' ||
        propName === 'globalRegion' ||
        propName === 'stateOrProvince'
      ) {
        console.log('convertDefinition : if');
        return {};
      }

      switch (prop.type) {
        case 'string':
          return generateString();

        case 'integer':
          return generateInteger();

        case 'boolean':
          return generateBoolean();

        case 'array':
          return generateArray(prop);

        case 'object':
          return convertObject(prop);

        default:
          return convertDefinition(resolveDefinition(prop['$ref']));
      }
    })
    .value();
}

function convertObject(prop) {
  if (R.isNil(prop.properties)) {
    return {};
  }

  convertDefinition(prop);
}

function generateString() {
  return 'string';
}

function generateInteger() {
  return 1;
}

function generateBoolean() {
  return true;
}

function generateArray(prop) {
  if (!R.isNil(prop.items)) {
    if (R.isNil(prop.items.type)) {
      return '';
      // return [convertDefinition(resolveDefinition(prop.items['$ref']))];
    }

    switch (prop.items.type) {
      case 'string':
        return [generateString()];
      case 'integer':
        return [generateInteger()];
      case 'boolean':
        return [generateBoolean()];
    }
  }
}
// ------------------- END FIXTURE VALUE CREATION FUNCTIONS -------------------

function createApiJs(functions, functionNames) {
  console.log('creating api-create.service.ts');
  return `
 /**
  * This code is automatically generated. Do not modify.
  * Author: N/A
  * Created: April 04 2019
  *
  * Purpose: Provides functions to interact with the backend API.
  *          This code is automatically generated from the Swagger
  *          definitions. It can be generated from running the apiGenerator.js
  *          script located in the root of the repository.
  */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  ${functions}
}

`;
}

function createFixtureApi(functions) {
  return `
/**
 * This code is automatically generated. Do not modify.
 * Author: N/A
 * Created: June 21 2017
 *
 * Purpose: Provides functions to stub the interaction with the backend API.
 *          This code is automatically generated from the Swagger definitions.
 *          It can be generated from running the apiGenerator.js
 *          script located in the root of the repository. It also uses the
 *          fixtures to mock the responses received from the API.
 */

declare const _: any;

export default {
  apiCallWithDelay: (ms, apiCall, ...args) => {
    return apiCall(...args);
  },

  ${functions}
};

`;
}
