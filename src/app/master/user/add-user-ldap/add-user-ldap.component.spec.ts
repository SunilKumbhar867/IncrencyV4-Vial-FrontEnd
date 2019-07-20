import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserLdapComponent } from './add-user-ldap.component';

describe('AddUserLdapComponent', () => {
  let component: AddUserLdapComponent;
  let fixture: ComponentFixture<AddUserLdapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserLdapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserLdapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
