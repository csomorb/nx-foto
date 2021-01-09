import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplegalleryComponent } from './peoplegallery.component';

describe('PeoplegalleryComponent', () => {
  let component: PeoplegalleryComponent;
  let fixture: ComponentFixture<PeoplegalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeoplegalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeoplegalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
