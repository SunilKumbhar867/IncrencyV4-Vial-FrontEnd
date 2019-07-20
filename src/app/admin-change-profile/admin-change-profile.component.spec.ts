import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangeProfileComponent } from './admin-change-profile.component';

describe('AdminChangeProfileComponent', () => {
  let component: AdminChangeProfileComponent;
  let fixture: ComponentFixture<AdminChangeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminChangeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChangeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
