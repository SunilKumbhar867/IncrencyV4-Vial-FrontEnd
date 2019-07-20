import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPwdPolicyComponent } from './audit-pwd-policy.component';

describe('AuditPwdPolicyComponent', () => {
  let component: AuditPwdPolicyComponent;
  let fixture: ComponentFixture<AuditPwdPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPwdPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPwdPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
