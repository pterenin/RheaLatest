/**
 * generate a guid
 */
export function utilGenerateUUID() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

/**
 * returns current-date-time as string
 */
export function utilGetDateTimeString() {
  return `${new Date()
    .toLocaleDateString()
    .split('/')
    .join('-')}-${new Date().toLocaleTimeString().toString()}`;
}

export function getCyName(jsonProperty: string) {
  const fieldName = jsonProperty
    .replace(/\.?([A-Z]+)/g, function(x, y) {
      return '_' + y.toLowerCase();
    })
    .replace(/^_/, '');
  return `[data-cy="${fieldName}]`;
}

/**
 * removes '@' character in string
 * @param arg string with @ in beginning
 */
export function delAt(arg: string) {
  return arg.replace('@', '');
}

export function isNullOrUndefinedOrEmpty(value: string) {
  return value === undefined || value === null || value === '' ? true : false;
}
