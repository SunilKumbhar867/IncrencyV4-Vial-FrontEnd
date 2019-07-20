import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecalibrationComponent } from './recalibration.component';

describe('RecalibrationComponent', () => {
  let component: RecalibrationComponent;
  let fixture: ComponentFixture<RecalibrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecalibrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
