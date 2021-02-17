import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaTagsModule } from '@trustarc/ui-toolkit';
import { CustomCategoryTagComponent } from './custom-category-tag.component';

describe('CustomCategoryTagComponent', () => {
  let component: CustomCategoryTagComponent;
  let fixture: ComponentFixture<CustomCategoryTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomCategoryTagComponent],
      imports: [TaTagsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCategoryTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
