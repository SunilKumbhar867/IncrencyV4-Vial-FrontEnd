import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVialComponent } from './manage-vial.component';

describe('ManageVialComponent', () => {
  let component: ManageVialComponent;
  let fixture: ComponentFixture<ManageVialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
