/*
 * Automatically unsubscribes from subscriptions in your component on ngOnDestroy event
 * Use example:
 * In your component where subscription is used import this decorator file as AutoUnsubscribe
 * Add @AutoUnsubscribe(['sub1$', 'sub2$']) decorator annotation anywhere outside of compomnent class scope
 * where you pass array of strings that represent names of subscriptions you would like to destroy in component
 * Also make sure ngOnDestroy() {} is present (required)
 */

export function AutoUnsubscribe(subscriptions: string[]): ClassDecorator {
  return function(constructor: Function) {
    const onDestroy = constructor.prototype.ngOnDestroy;

    if (typeof onDestroy !== 'function') {
      throw new Error(
        `${constructor.name} is using @AutoUnsubscribe but does not implement ngOnDestroy()`
      );
    }

    constructor.prototype.ngOnDestroy = function() {
      for (const sub of subscriptions) {
        const subscription = this[sub];
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        }
      }
      return (
        onDestroy &&
        typeof onDestroy === 'function' &&
        onDestroy.apply(this, arguments)
      );
    };
  };
}
