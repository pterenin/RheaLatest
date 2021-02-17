import { EntityTypePipe } from './entity-type.pipe';

describe('EntityTypePipe', () => {
  it('create an instance', () => {
    const pipe = new EntityTypePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the string itself if the string is null', () => {
    const pipe = new EntityTypePipe();
    const piped = pipe.transform(null);
    expect(piped).toEqual(null);
  });

  it('should handle business process', () => {
    const pipe = new EntityTypePipe();
    expect(pipe.transform('BUSINESS_PROCESS')).toEqual('Business Process');
    expect(pipe.transform('Business_Process')).toEqual('Business Process');
    expect(pipe.transform('BusinesS_ProcesS')).toEqual('Business Process');
    expect(pipe.transform('business_process')).toEqual('Business Process');
    expect(pipe.transform('BUSINESS PROCESS')).toEqual('Business Process');
    expect(pipe.transform('Business Process')).toEqual('Business Process');
    expect(pipe.transform('BusinesS ProcesS')).toEqual('Business Process');
    expect(pipe.transform('business process')).toEqual('Business Process');
  });

  it('should handle company affiliate', () => {
    const pipe = new EntityTypePipe();
    expect(pipe.transform('COMPANY_AFFILIATE')).toEqual('Company Affiliate');
    expect(pipe.transform('Company_Affiliate')).toEqual('Company Affiliate');
    expect(pipe.transform('Company_AffiliATE')).toEqual('Company Affiliate');
    expect(pipe.transform('company_affiliate')).toEqual('Company Affiliate');
    expect(pipe.transform('COMPANY AFFILIATE')).toEqual('Company Affiliate');
    expect(pipe.transform('Company Affiliate')).toEqual('Company Affiliate');
    expect(pipe.transform('Company AffiliATE')).toEqual('Company Affiliate');
    expect(pipe.transform('company affiliate')).toEqual('Company Affiliate');
  });

  it('should handle IT system', () => {
    const pipe = new EntityTypePipe();
    expect(pipe.transform('IT_SYSTEM')).toEqual('System');
    expect(pipe.transform('It_System')).toEqual('System');
    expect(pipe.transform('It_System')).toEqual('System');
    expect(pipe.transform('it_system')).toEqual('System');
    expect(pipe.transform('IT SYSTEM')).toEqual('System');
    expect(pipe.transform('It System')).toEqual('System');
    expect(pipe.transform('It System')).toEqual('System');
    expect(pipe.transform('it system')).toEqual('System');
  });

  it('should handle partner', () => {
    const pipe = new EntityTypePipe();
    expect(pipe.transform('PARTNER')).toEqual('Partner');
    expect(pipe.transform('Partner')).toEqual('Partner');
    expect(pipe.transform('Partner')).toEqual('Partner');
    expect(pipe.transform('partner')).toEqual('Partner');
  });

  it('should handle primary entity', () => {
    const pipe = new EntityTypePipe();
    expect(pipe.transform('PRIMARY_ENTITY')).toEqual('Primary Entity');
    expect(pipe.transform('Primary_Entity')).toEqual('Primary Entity');
    expect(pipe.transform('pRiMaRy_eNtItY')).toEqual('Primary Entity');
    expect(pipe.transform('primary_entity')).toEqual('Primary Entity');
    expect(pipe.transform('PRIMARY ENTITY')).toEqual('Primary Entity');
    expect(pipe.transform('Primary Entity')).toEqual('Primary Entity');
    expect(pipe.transform('PrImArY EnTiTy')).toEqual('Primary Entity');
    expect(pipe.transform('primary entity')).toEqual('Primary Entity');
  });

  it('should handle vendor', () => {
    const pipe = new EntityTypePipe();
    expect(pipe.transform('VENDOR')).toEqual('Vendor');
    expect(pipe.transform('Vendor')).toEqual('Vendor');
    expect(pipe.transform('Vendor')).toEqual('Vendor');
    expect(pipe.transform('vendor')).toEqual('Vendor');
  });
});
