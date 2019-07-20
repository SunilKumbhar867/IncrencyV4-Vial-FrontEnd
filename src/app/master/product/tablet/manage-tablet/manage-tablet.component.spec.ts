import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTabletComponent } from './manage-tablet.component';

describe('ManageTabletComponent', () => {
  let component: ManageTabletComponent;
  let fixture: ComponentFixture<ManageTabletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTabletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
