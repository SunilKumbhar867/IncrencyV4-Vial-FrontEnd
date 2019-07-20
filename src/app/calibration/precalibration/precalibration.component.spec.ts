import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecalibrationComponent } from './precalibration.component';

describe('PrecalibrationComponent', () => {
  let component: PrecalibrationComponent;
  let fixture: ComponentFixture<PrecalibrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrecalibrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
