import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBinEntryComponent } from './add-bin-entry.component';

describe('AddBinEntryComponent', () => {
  let component: AddBinEntryComponent;
  let fixture: ComponentFixture<AddBinEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBinEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBinEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
