import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemButtonComponent } from './item-button.component';
import { TaSvgIconModule, TaTooltipModule } from '@trustarc/ui-toolkit';
import { RecordIconModule } from '../record-icon/record-icon.module';

describe('ItemButtonComponent', () => {
  let component: ItemButtonComponent;
  let fixture: ComponentFixture<ItemButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemButtonComponent],
      imports: [TaSvgIconModule, TaTooltipModule, RecordIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
