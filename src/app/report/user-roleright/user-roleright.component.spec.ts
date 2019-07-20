import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolerightComponent } from './user-roleright.component';

describe('UserRolerightComponent', () => {
  let component: UserRolerightComponent;
  let fixture: ComponentFixture<UserRolerightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRolerightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolerightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
