import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditOtherEquipmentComponent } from './audit-other-equipment.component';

describe('AuditOtherEquipmentComponent', () => {
  let component: AuditOtherEquipmentComponent;
  let fixture: ComponentFixture<AuditOtherEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditOtherEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditOtherEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
