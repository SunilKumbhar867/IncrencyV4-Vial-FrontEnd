import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAdminChangeProfileComponent } from './audit-admin-change-profile.component';

describe('AuditAdminChangeProfileComponent', () => {
  let component: AuditAdminChangeProfileComponent;
  let fixture: ComponentFixture<AuditAdminChangeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditAdminChangeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditAdminChangeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
