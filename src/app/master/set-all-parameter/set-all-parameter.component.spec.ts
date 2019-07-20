import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAllParameterComponent } from './set-all-parameter.component';

describe('SetAllParameterComponent', () => {
  let component: SetAllParameterComponent;
  let fixture: ComponentFixture<SetAllParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetAllParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetAllParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
