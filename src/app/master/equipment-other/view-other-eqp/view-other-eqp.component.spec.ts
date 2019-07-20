import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOtherEqpComponent } from './view-other-eqp.component';

describe('ViewOtherEqpComponent', () => {
  let component: ViewOtherEqpComponent;
  let fixture: ComponentFixture<ViewOtherEqpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOtherEqpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOtherEqpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
