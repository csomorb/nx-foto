import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggalleryComponent } from './taggallery.component';

describe('TaggalleryComponent', () => {
  let component: TaggalleryComponent;
  let fixture: ComponentFixture<TaggalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
