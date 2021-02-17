import { CapitalizeCasePipe } from './string.pipe';

describe('CapitalizeCasePipe', () => {
  it('Create an instance', () => {
    const pipe = new CapitalizeCasePipe();
    expect(pipe).toBeTruthy();
  });
});
