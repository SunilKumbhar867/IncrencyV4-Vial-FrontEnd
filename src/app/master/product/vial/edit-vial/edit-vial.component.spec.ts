import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVialComponent } from './edit-vial.component';

describe('EditVialComponent', () => {
  let component: EditVialComponent;
  let fixture: ComponentFixture<EditVialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
