import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRecalibrationComponent } from './audit-recalibration.component';

describe('AuditRecalibrationComponent', () => {
  let component: AuditRecalibrationComponent;
  let fixture: ComponentFixture<AuditRecalibrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditRecalibrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRecalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
