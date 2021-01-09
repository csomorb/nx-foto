import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumgalleryComponent } from './albumgallery.component';

describe('AlbumgalleryComponent', () => {
  let component: AlbumgalleryComponent;
  let fixture: ComponentFixture<AlbumgalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumgalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumgalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
