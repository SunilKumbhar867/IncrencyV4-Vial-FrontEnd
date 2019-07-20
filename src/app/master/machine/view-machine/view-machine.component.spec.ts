import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMachineComponent } from './view-machine.component';

describe('ViewMachineComponent', () => {
  let component: ViewMachineComponent;
  let fixture: ComponentFixture<ViewMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
