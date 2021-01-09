import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectpeopleComponent } from './selectpeople.component';

describe('SelectpeopleComponent', () => {
  let component: SelectpeopleComponent;
  let fixture: ComponentFixture<SelectpeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectpeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectpeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
