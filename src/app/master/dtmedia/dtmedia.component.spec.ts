import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DTMediaComponent } from './dtmedia.component';

describe('DTMediaComponent', () => {
  let component: DTMediaComponent;
  let fixture: ComponentFixture<DTMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DTMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DTMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
