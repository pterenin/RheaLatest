import { DebounceClickDirective } from './debounce-click.directive';

describe('DebounceClickDirective', () => {
  it('should create an instance', () => {
    const directive = new DebounceClickDirective();
    expect(directive).toBeTruthy();
  });

  it('should debounce a click', done => {
    const directive = new DebounceClickDirective();

    const event = {
      preventDefault: () => {},
      stopPropagation: () => {}
    };

    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');

    directive.clicks.subscribe(e => {
      expect(e).toEqual(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
      done();
    });

    directive.clickEvent(event);
  });
});
