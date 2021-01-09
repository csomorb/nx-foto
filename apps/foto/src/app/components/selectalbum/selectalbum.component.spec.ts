import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectalbumComponent } from './selectalbum.component';

describe('SelectalbumComponent', () => {
  let component: SelectalbumComponent;
  let fixture: ComponentFixture<SelectalbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectalbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectalbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
