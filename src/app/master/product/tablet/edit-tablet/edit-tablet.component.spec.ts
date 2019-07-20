import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTabletComponent } from './edit-tablet.component';

describe('EditTabletComponent', () => {
  let component: EditTabletComponent;
  let fixture: ComponentFixture<EditTabletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTabletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
