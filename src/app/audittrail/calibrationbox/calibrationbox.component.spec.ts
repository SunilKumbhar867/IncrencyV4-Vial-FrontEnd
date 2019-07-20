import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibrationboxComponent } from './calibrationbox.component';

describe('CalibrationboxComponent', () => {
  let component: CalibrationboxComponent;
  let fixture: ComponentFixture<CalibrationboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalibrationboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalibrationboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
