import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVernierComponent } from './view-vernier.component';

describe('ViewVernierComponent', () => {
  let component: ViewVernierComponent;
  let fixture: ComponentFixture<ViewVernierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVernierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVernierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
