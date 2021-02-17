import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateComponent } from './state.component';
import {
  TaButtonsModule,
  TaCheckboxModule,
  TaIconSearchModule,
  TaSvgIconModule,
  TaTableModule,
  TaTooltipModule
} from '@trustarc/ui-toolkit';
import { FormsModule } from '@angular/forms';
import { DatagridSearchBoxModule } from '../record-datagrid/datagrid-header/datagrid-search-box/datagrid-search-box.module';
import { CommonModule } from '@angular/common';
import { SearchFieldModule } from '../../_components/search-field/search-field.module';

const stateList = [
  {
    id: 'de04833f-bce4-4386-9d74-3be742d16e36',
    version: 0,
    name: 'Buenos Aires',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'c6e0eecb-cb33-4318-b47f-29089fd1b998',
    version: 0,
    name: 'Catamarca',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '97d7c4cb-0d30-441e-8ef7-1d2d1f1fdb5c',
    version: 0,
    name: 'Chaco',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'c3b79bde-1e45-440a-990e-03630a7112c9',
    version: 0,
    name: 'Chubut',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'dd276347-6455-48aa-8921-035aa37c55c5',
    version: 0,
    name: 'Ciudad Autónoma de Buenos Aires',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'ece5dfdb-387a-4eab-8d0c-33b665b8d63a',
    version: 0,
    name: 'Corrientes',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'c75365aa-500f-4d9d-8933-a81b401908db',
    version: 0,
    name: 'Córdoba',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '27f2af7e-20dd-49ba-b8f4-26df86a00b64',
    version: 0,
    name: 'Entre Ríos',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '10869d6e-e574-472e-a307-9ad05be54560',
    version: 0,
    name: 'Formosa',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'f354ec9a-af17-4f3c-8c3e-763f69323322',
    version: 0,
    name: 'Jujuy',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '4f82686e-1d4a-4497-9b11-5965bef4363b',
    version: 0,
    name: 'La Pampa',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'c07bf41f-4e3a-4ff2-9e41-c04ab831e9d5',
    version: 0,
    name: 'La Rioja',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'aa5af2b1-6ae8-4f7f-88df-d07cd1882900',
    version: 0,
    name: 'Mendoza',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '3fe8bae0-fcd6-4b61-ae76-91c86458161c',
    version: 0,
    name: 'Misiones',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'ff535592-59b0-4f46-824d-d9ffd5edfeae',
    version: 0,
    name: 'Neuquén',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '29226974-333b-46f3-993d-9c362c32e1f8',
    version: 0,
    name: 'Río Negro',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'ecbe39bd-4744-4b22-aa38-457be012eeb6',
    version: 0,
    name: 'Salta',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'dabbc796-1874-4291-8f93-058b0a81fa15',
    version: 0,
    name: 'San Juan',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '19ca7a66-cf4e-4f49-8d20-7882cad625d9',
    version: 0,
    name: 'San Luis',
    shortValue: '',
    i18nKey: null
  },
  {
    id: 'b5c900b8-92ea-4da7-8733-418cb07d3b3a',
    version: 0,
    name: 'Santa Cruz',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '92863acd-d617-460b-ac4e-8154f6b9aee6',
    version: 0,
    name: 'Santa Fe',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '0581a871-101a-4f5b-8e70-df30089b1ed5',
    version: 0,
    name: 'Santiago del Estero',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '1775b592-d494-4b58-acc4-9e17aec7f708',
    version: 0,
    name: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
    shortValue: '',
    i18nKey: null
  },
  {
    id: '19f22aa8-a65c-42b9-be75-6b9df1f2682b',
    version: 0,
    name: 'Tucumán',
    shortValue: '',
    i18nKey: null
  }
];

describe('StateComponent', () => {
  let component: StateComponent;
  let fixture: ComponentFixture<StateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StateComponent],
      imports: [
        CommonModule,
        TaButtonsModule,
        TaCheckboxModule,
        TaTableModule,
        TaIconSearchModule,
        TaTooltipModule,
        DatagridSearchBoxModule,
        TaSvgIconModule,
        SearchFieldModule,
        FormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    component.stateList = stateList;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
