import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVernierComponent } from './edit-vernier.component';

describe('EditVernierComponent', () => {
  let component: EditVernierComponent;
  let fixture: ComponentFixture<EditVernierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVernierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVernierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
