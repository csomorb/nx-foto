import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecttagComponent } from './selecttag.component';

describe('SelecttagComponent', () => {
  let component: SelecttagComponent;
  let fixture: ComponentFixture<SelecttagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecttagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecttagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
