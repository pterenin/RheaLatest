import { AutoUnsubscribe } from './auto-unsubscribe.decorator';
import { OnDestroy } from '@angular/core';

const mockSubscription1$ = {
  unsubscribe: new Function()
};
const mockSubscription2$ = {
  unsubscribe: new Function()
};

describe('@AutoUnsubscribe', () => {
  it('should return error if ngOnDestroy is not present', () => {
    const throwError = () => {
      @AutoUnsubscribe(['sub1$', 'sub2$'])
      class TestComponent {
        sub1$ = mockSubscription1$;
        sub2$ = mockSubscription2$;
        constructor() {}
      }
    };

    expect(() => throwError()).toThrow(
      new Error(
        'TestComponent is using @AutoUnsubscribe but does not implement ngOnDestroy()'
      )
    );
  });

  it('should call unsubscribe on ngOnDestroy', () => {
    @AutoUnsubscribe(['sub1$', 'sub2$'])
    class TestComponent implements OnDestroy {
      sub1$ = mockSubscription1$;
      sub2$ = mockSubscription2$;
      constructor() {}
      ngOnDestroy() {}
    }
    const testComponent = new TestComponent();
    testComponent.ngOnDestroy();
    expect(mockSubscription1$.unsubscribe.call.length).toBe(1);
    expect(mockSubscription2$.unsubscribe.call.length).toBe(1);
  });
});
