import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBinEntryComponent } from './edit-bin-entry.component';

describe('EditBinEntryComponent', () => {
  let component: EditBinEntryComponent;
  let fixture: ComponentFixture<EditBinEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBinEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBinEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
