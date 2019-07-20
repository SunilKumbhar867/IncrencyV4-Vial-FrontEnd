import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VernierComponent } from './vernier.component';

describe('VernierComponent', () => {
  let component: VernierComponent;
  let fixture: ComponentFixture<VernierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VernierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VernierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
