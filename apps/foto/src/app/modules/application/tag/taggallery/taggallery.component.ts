import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryComponent } from '../../../../components/gallery/gallery.component';
import { ToastrService } from 'ngx-toastr';
import { TagModel } from '../../../../models/tag.model';
import { CategoryService } from '../../../../services/category.service';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-taggallery',
  templateUrl: './taggallery.component.html',
  styleUrls: ['./../../../../components/gallery/gallery.component.css','./taggallery.component.css']
})
export class TaggalleryComponent extends GalleryComponent implements OnInit {

  tag: TagModel;

  constructor(public router: Router, public catService: CategoryService, public apiService: ApiService,public toast: ToastrService,
    public route: ActivatedRoute) {
      super(router,catService,apiService,toast,route);
     }

  ngOnInit(): void {
    super.ngOnInit();
  }

  toEditMode(){
    super.toEditMode();
    this.tag = { ...this.catService.curCat};
  }

  toAddMode(){
    super.toAddMode();
    this.tag = { id: 0, title: '', description: ''};
  }

  toDeleteMode(){
    this.deleteMode = true;
  }

  createTag(){
    if (this.tag.title.length === 0 || !this.tag.title.trim()){
      this.toast.error('Nom obligatoire',
          'Entrez un nom',
          {timeOut: 4000,});
    }
    else{
      this.apiService.postTag(this.tag.title, this.tag.description).subscribe(
        {
          next: data => {
            if (this.catService.curCat.id === 0){
              this.catService.curCat.listTag.push(data);
            }
            this.catService.tagList.push(data);
            this.addMode = false;
            this.toast.success(data.title,
              'Ajouté',
              {timeOut: 3000,});
          },
          error: error => {
            console.error('There was an error in creating people!', error);
            this.toast.error('Détails: '+error.error.error,
            'Echec de la création',
            {timeOut: 4000,});
          }
      });
    }
  }

  deleteTag(){
    this.apiService.deleteTag(this.catService.curCat).subscribe(
      {
        next: data => {
          const tagName = this.catService.curCat.title;
          this.catService.tagList.splice( this.catService.tagList.findIndex(p => p.id === this.catService.curCat.id),1);
          this.router.navigateByUrl('tags/');
          this.deleteMode = false;
          this.toast.success(tagName,
            'Supprimé',
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

  updateTag(){
    this.apiService.updateTag(this.tag).subscribe({
        next: tag => {
          this.editMode = false;
          this.catService.updateCategory(tag);
          this.catService.tagList[this.catService.tagList.findIndex(p => p.id === this.tag.id)] = this.catService.curCat;
          this.toast.success(tag.title + ' a été mise à jour',
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
