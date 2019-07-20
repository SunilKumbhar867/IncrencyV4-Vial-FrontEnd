import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOtherEqpComponent } from './add-other-eqp.component';

describe('AddOtherEqpComponent', () => {
  let component: AddOtherEqpComponent;
  let fixture: ComponentFixture<AddOtherEqpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOtherEqpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOtherEqpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
