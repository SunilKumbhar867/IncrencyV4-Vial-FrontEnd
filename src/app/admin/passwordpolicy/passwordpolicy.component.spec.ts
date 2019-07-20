import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordpolicyComponent } from './passwordpolicy.component';

describe('PasswordpolicyComponent', () => {
  let component: PasswordpolicyComponent;
  let fixture: ComponentFixture<PasswordpolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordpolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
