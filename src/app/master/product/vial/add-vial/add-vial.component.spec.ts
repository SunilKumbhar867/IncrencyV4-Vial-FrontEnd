import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVialComponent } from './add-vial.component';

describe('AddVialComponent', () => {
  let component: AddVialComponent;
  let fixture: ComponentFixture<AddVialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
