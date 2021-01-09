import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectpeoplevideoComponent } from './selectpeoplevideo.component';

describe('SelectpeoplevideoComponent', () => {
  let component: SelectpeoplevideoComponent;
  let fixture: ComponentFixture<SelectpeoplevideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectpeoplevideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectpeoplevideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
