import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrannualComponent } from './add-grannual.component';

describe('AddGrannualComponent', () => {
  let component: AddGrannualComponent;
  let fixture: ComponentFixture<AddGrannualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGrannualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrannualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
