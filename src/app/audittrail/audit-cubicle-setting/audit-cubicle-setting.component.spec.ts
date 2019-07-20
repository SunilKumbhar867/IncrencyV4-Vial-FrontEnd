import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCubicleSettingComponent } from './audit-cubicle-setting.component';

describe('AuditCubicleSettingComponent', () => {
  let component: AuditCubicleSettingComponent;
  let fixture: ComponentFixture<AuditCubicleSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditCubicleSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCubicleSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
