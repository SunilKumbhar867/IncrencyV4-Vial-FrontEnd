import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditBinSettingComponent } from './audit-bin-setting.component';

describe('AuditBinSettingComponent', () => {
  let component: AuditBinSettingComponent;
  let fixture: ComponentFixture<AuditBinSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditBinSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditBinSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
