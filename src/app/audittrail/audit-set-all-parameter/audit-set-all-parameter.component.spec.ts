import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditSetAllParameterComponent } from './audit-set-all-parameter.component';

describe('AuditSetAllParameterComponent', () => {
  let component: AuditSetAllParameterComponent;
  let fixture: ComponentFixture<AuditSetAllParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditSetAllParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSetAllParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
