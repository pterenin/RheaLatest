import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataInventoryModule } from './data-inventory.module';
import { DataInventoryService } from './data-inventory.service';
import { FilterRequest } from '../shared/models/search.model';
import { TaTableRequest } from '@trustarc/ui-toolkit';
import { Observable } from 'rxjs';
import { DropdownCategoryMultipleModule } from '../shared/components/dropdown-category-multiple/dropdown-category-multiple.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('BusinessProcessDataInventoryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        DataInventoryModule,
        DropdownCategoryMultipleModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
  );

  it('should be created', () => {
    const service: DataInventoryService = TestBed.get(DataInventoryService);
    expect(service).toBeTruthy();
  });
});
