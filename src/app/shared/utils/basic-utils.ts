import { HttpResponse } from '@angular/common/http';

declare const _: any;

export const emailPatternValidator =
  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

export function isNullOrUndefined(data) {
  return data === null || data === undefined;
}

export function exists(data) {
  return !isNullOrUndefined(data);
}

export function defaultTo(defaultValue, desiredValue) {
  return isNullOrUndefined(desiredValue) ? defaultValue : desiredValue;
}

export function toCaptalizedCase(str: String) {
  return _.startCase(_.toLower(str));
}

function danishToEnglishgetString(danishString: string) {
  return danishString
    .toLowerCase()
    .replace('å', 'a')
    .replace('ø', 'o');
}

export function sortDanishStringArray(array: string[], key = '') {
  array.sort(function(a, b) {
    const stringA = key
      ? danishToEnglishgetString(a[key])
      : danishToEnglishgetString(a);
    const stringB = key
      ? danishToEnglishgetString(b[key])
      : danishToEnglishgetString(b);

    return stringA.localeCompare(stringB);
  });
  return array;
}

export function formatCategoryLabel(str: String) {
  // Add space between Purpose Categories name
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function highlightText(mainText: string, highlightTerm: string) {
  // Search strings need to be at least 2 characters long; any less will clear the search
  if (!exists(highlightTerm) || highlightTerm.length < 2) {
    return mainText;
  }

  const searchResults = mainText.match(new RegExp(highlightTerm, 'gi'));

  if (!searchResults || searchResults.length <= 0) {
    return mainText;
  }

  let finalHighlights = mainText;

  searchResults.forEach(result => {
    const textToReplace = new RegExp(result, 'g');

    finalHighlights = finalHighlights.replace(
      textToReplace,
      `<strong>${result}</strong>`
    );
  });

  return finalHighlights;
}

export function isIdParameterInvalid(idParameter: String): boolean {
  if (isNullOrUndefined(idParameter) || 0 === idParameter.length) {
    return false;
  }

  const decodedParameter = idParameter.replace(/&#(\d+);/g, function(
    match,
    dec
  ) {
    return String.fromCharCode(dec);
  });

  return !decodedParameter.match(/^[0-9a-zA-Z\-]+$/);
}

export function isEllipsisActive(e) {
  return e.offsetWidth < e.scrollWidth;
}

export function downloadReturnedFile(response: HttpResponse<Blob>) {
  const downloadElement = document.createElement('a');
  const contentDisposition = response.headers.get('Content-Disposition');
  const filenameStart = contentDisposition.indexOf('=') + 1;
  const filename = contentDisposition.substr(filenameStart);
  const blob = new Blob([response.body], {
    type: 'application/octet-stream'
  });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    downloadElement.href = window.URL.createObjectURL(blob);
    downloadElement.download = filename;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    // Potential race condtion could occur as descirbed in RHEA-1036, currently has not been confrimed
    window.URL.revokeObjectURL(downloadElement.href);
  }
}

/**
 * Checks if null or empty array.
 *
 * @param - any array
 */
export const isEmpty = (array: any[]): boolean => {
  return isNullOrUndefined(array) || array.length === 0;
};
