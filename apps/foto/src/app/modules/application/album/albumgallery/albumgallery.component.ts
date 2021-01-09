import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryComponent } from '../../../../components/gallery/gallery.component';
import { AlbumModel } from '../../../../models/album.model';
import { ApiService } from '../../../../services/api.service';
import { CategoryService } from '../../../../services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-albumgallery',
  templateUrl: './albumgallery.component.html',
  styleUrls: ['./../../../../components/gallery/gallery.component.css','./albumgallery.component.css']
})
export class AlbumgalleryComponent extends GalleryComponent implements OnInit  {

  album: AlbumModel;

  constructor(public router: Router, public catService: CategoryService, public apiService: ApiService,public toast: ToastrService,
    public route: ActivatedRoute ) {
    super(router,catService,apiService,toast,route);
  }

  ngOnInit(): void {
    super.ngOnInit();

  }

  toEditMode(){
    super.toEditMode();
    this.album = { ...this.catService.curCat};
  }

  cancelTimeMode(){
    super.cancelTimeMode();
    this.catService.cancelAlbumTimePhotos();
  }

  toTimeMode(){
    super.toTimeMode();
    this.catService.loadAlbumTimePhotos();
  }

  toDeleteMode(){
    if (this.catService.curCat.listAlbum.length > 0){
      this.toast.warning('Supprimez d\'abord les sous albums',
        'Attention',
        {timeOut: 4000,});
    }
    else if (this.catService.curCat.photos.length > 0){
      this.toast.warning('Supprimez d\'abord les photos',
        'Attention',
        {timeOut: 4000,});
    }
    else if (this.catService.curCat.videos.length > 0){
      this.toast.warning('Supprimez d\'abord les vidéos',
        'Attention',
        {timeOut: 4000,});
    }
    else{
      this.deleteMode = true;
    }
  }

  addPhoto(){
    this.router.navigateByUrl('/upload/' + this.catService.curCat.id);
  }

  deleteAlbum(){
    this.apiService.deleteAlbum(this.catService.curCat).subscribe(
      {
        next: data => {
          const albumParentId = this.catService.parentList.pop().id;
          const albumTitle = this.catService.curCat.title;
          this.router.navigateByUrl('albums/' + albumParentId);
          this.deleteMode = false;
          this.toast.success(albumTitle,
            'Album supprimé',
            {timeOut: 3000,});
        },
        error: error => {
          console.error('There was an error in delete!', error);
          this.toast.error('Détails: '+error.error,
          'Echec de la suppression',
          {timeOut: 4000,});
        }
    });
  }

  updateAlbum(){
    this.apiService.updateAlbum(this.album).subscribe({
        next: album => {
          this.editMode = false;
          this.catService.updateCategory(album);
          this.toast.success('L\'album ' + album.title + ' a été mise à jour',
            'Mise à jour',
            {timeOut: 3000,});
        },
        error: error => {
          this.toast.error('Détails: '+error.statusText,
          'Echec de la mise à jour',
          {timeOut: 4000,});
          console.error('There was an error in update!', error);
        }
    });
  }

}
