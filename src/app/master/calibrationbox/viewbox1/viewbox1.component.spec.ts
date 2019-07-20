import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewbox1Component } from './viewbox1.component';

describe('Viewbox1Component', () => {
  let component: Viewbox1Component;
  let fixture: ComponentFixture<Viewbox1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Viewbox1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Viewbox1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
