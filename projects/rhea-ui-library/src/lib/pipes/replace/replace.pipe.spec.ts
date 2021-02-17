import { ReplacePipe } from './replace.pipe';

describe('ReplacePipe', () => {
  it('create an instance', () => {
    const pipe = new ReplacePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the string itself if the string is null', () => {
    const pipe = new ReplacePipe();
    const piped = pipe.transform(null, '_', ' ');
    expect(piped).toEqual(null);
  });

  it('should return the string itself if the regular expression is null', () => {
    const pipe = new ReplacePipe();
    const piped = pipe.transform('COMPANY_AFFILIATE', null, ' ');
    expect(piped).toEqual('COMPANY_AFFILIATE');
  });

  it('should return the string itself if the string does not have the search text', () => {
    const pipe = new ReplacePipe();
    const piped = pipe.transform('CompanyAffiliate', '_', ' ');
    expect(piped).toEqual('CompanyAffiliate');
  });

  it('should return the string with replacements', () => {
    const pipe = new ReplacePipe();
    const piped = pipe.transform('COMPANY_AFFILIATE', '_', ' ');
    expect(piped).toEqual('COMPANY AFFILIATE');
  });
});
