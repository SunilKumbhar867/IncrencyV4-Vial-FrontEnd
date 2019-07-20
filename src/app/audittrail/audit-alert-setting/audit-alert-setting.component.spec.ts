import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAlertSettingComponent } from './audit-alert-setting.component';

describe('AuditAlertSettingComponent', () => {
  let component: AuditAlertSettingComponent;
  let fixture: ComponentFixture<AuditAlertSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditAlertSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditAlertSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
