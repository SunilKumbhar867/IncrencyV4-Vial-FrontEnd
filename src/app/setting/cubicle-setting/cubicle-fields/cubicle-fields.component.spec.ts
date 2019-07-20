import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubicleFieldsComponent } from './cubicle-fields.component';

describe('CubicleFieldsComponent', () => {
  let component: CubicleFieldsComponent;
  let fixture: ComponentFixture<CubicleFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubicleFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubicleFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
