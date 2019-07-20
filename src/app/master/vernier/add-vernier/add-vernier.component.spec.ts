import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVernierComponent } from './add-vernier.component';

describe('AddVernierComponent', () => {
  let component: AddVernierComponent;
  let fixture: ComponentFixture<AddVernierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVernierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVernierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
