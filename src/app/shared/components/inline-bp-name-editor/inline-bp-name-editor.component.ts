import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { noWhitespaceValidator } from '../../utils/form-utils';
import { TaDropdown } from '@trustarc/ui-toolkit';

@Component({
  selector: 'ta-inline-bp-name-editor',
  templateUrl: './inline-bp-name-editor.component.html',
  styleUrls: ['./inline-bp-name-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InlineBpNameEditorComponent implements OnInit {
  @Input() name: string;
  @Input() nameOriginal: string;
  @Input() businessProcessId = '';
  @Output() getOverview: EventEmitter<void>;
  @Output() openRecord: EventEmitter<void>;
  @Output() openDropdown: EventEmitter<TaDropdown>;
  @Output() nameUpdated: EventEmitter<string>;
  @ViewChild('editingDropDown') editingDropDown;

  public form: FormGroup;
  public notChanged = true;

  constructor(private formBuilder: FormBuilder) {
    this.getOverview = new EventEmitter();
    this.openRecord = new EventEmitter();
    this.openDropdown = new EventEmitter();
    this.nameUpdated = new EventEmitter();
  }

  ngOnInit() {
    this.initForm();
  }

  public initForm() {
    this.form = this.formBuilder.group({
      name: new FormControl(this.name, [
        Validators.required,
        noWhitespaceValidator,
        Validators.maxLength(255)
      ])
    });

    this.form.get('name').valueChanges.subscribe(value => {
      this.notChanged = this.nameOriginal === value;
    });
  }

  public handleOpenChange(event) {
    if (!event) {
      this.restoreFormInitialState();
    }
  }

  public openEditingDropdown() {
    this.getOverview.emit();
    this.openDropdown.emit(this.editingDropDown);
  }

  public closeEditingDropdown() {
    this.editingDropDown.close();
  }

  public editRecord(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.openRecord.emit();
  }

  public handleSave(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const name = this.form.get('name').value;
    this.nameOriginal = name;
    this.nameUpdated.emit(name);
    this.notChanged = true;
  }

  public restoreFormInitialState() {
    this.form.get('name').setValue(this.nameOriginal);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.notChanged = true;
  }
}
