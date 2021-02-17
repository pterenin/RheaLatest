import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInventoryFooterComponent } from './data-inventory-footer.component';
import { PageFooterModule } from '../page-footer-nav/page-footer-nav.module';
import { DataInventoryService } from 'src/app/data-inventory/data-inventory.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DataInventoryFooterComponent', () => {
  let component: DataInventoryFooterComponent;
  let fixture: ComponentFixture<DataInventoryFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataInventoryFooterComponent],
      imports: [PageFooterModule, HttpClientTestingModule, RouterTestingModule],
      providers: [DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataInventoryFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
