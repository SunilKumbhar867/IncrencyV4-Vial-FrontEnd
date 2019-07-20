import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVernierNocalibComponent } from './edit-vernier-nocalib.component';

describe('EditVernierNocalibComponent', () => {
  let component: EditVernierNocalibComponent;
  let fixture: ComponentFixture<EditVernierNocalibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVernierNocalibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVernierNocalibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
