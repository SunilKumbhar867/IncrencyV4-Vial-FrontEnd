import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVernierNocalibComponent } from './add-vernier-nocalib.component';

describe('AddVernierNocalibComponent', () => {
  let component: AddVernierNocalibComponent;
  let fixture: ComponentFixture<AddVernierNocalibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVernierNocalibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVernierNocalibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
