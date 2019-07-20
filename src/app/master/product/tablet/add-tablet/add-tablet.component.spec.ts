import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTabletComponent } from './add-tablet.component';

describe('AddTabletComponent', () => {
  let component: AddTabletComponent;
  let fixture: ComponentFixture<AddTabletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTabletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
