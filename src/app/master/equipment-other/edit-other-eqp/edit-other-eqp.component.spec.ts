import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOtherEqpComponent } from './edit-other-eqp.component';

describe('EditOtherEqpComponent', () => {
  let component: EditOtherEqpComponent;
  let fixture: ComponentFixture<EditOtherEqpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOtherEqpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOtherEqpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
