import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryComponent } from '../../../../components/gallery/gallery.component';
import { ApiService } from '../../../../services/api.service';
import { CategoryService } from '../../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { PeopleModel } from '../../../../models/people.model';

@Component({
  selector: 'app-peoplegallery',
  templateUrl: './peoplegallery.component.html',
  styleUrls: ['./../../../../components/gallery/gallery.component.css','./peoplegallery.component.css']
})
export class PeoplegalleryComponent extends GalleryComponent implements OnInit {

  people: PeopleModel;

  constructor(public router: Router, public catService: CategoryService, public apiService: ApiService,public toast: ToastrService,
    public route: ActivatedRoute) {
      super(router,catService,apiService,toast,route);
     }

  ngOnInit(): void {
    super.ngOnInit();
  }

  toEditMode(){
    super.toEditMode();
    this.people = { ...this.catService.curCat};
  }

  toAddMode(){
    super.toAddMode();
    this.people = { id: 0, title: '', description: '', birthDay: new Date()};
  }

  toDeleteMode(){
    this.deleteMode = true;
  }

  createPeople(){
    if (this.people.title.length === 0 || !this.people.title.trim()){
      this.toast.error('Nom obligatoire',
          'Entrez un nom',
          {timeOut: 4000,});
    }
    else{
      this.apiService.postPeople(this.people.title, this.people.description, this.people.birthDay).subscribe(
        {
          next: data => {
            if (this.catService.curCat.id === 0){
              this.catService.curCat.listPeople.push(data);
            }
            this.catService.peopleList.push(data);
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

  deletePeople(){
    this.apiService.deletePeople(this.catService.curCat).subscribe(
      {
        next: data => {
          const peopleName = this.catService.curCat.title;
          this.catService.peopleList.splice( this.catService.peopleList.findIndex(p => p.id === this.catService.curCat.id),1);
          this.router.navigateByUrl('peoples/');
          this.deleteMode = false;
          this.toast.success(peopleName,
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

  updatePeople(){
    this.apiService.updatePeople(this.people).subscribe({
        next: people => {
          this.editMode = false;
          this.catService.updateCategory(people);
          this.catService.peopleList[this.catService.peopleList.findIndex(p => p.id === this.people.id)] = this.catService.curCat;
          this.toast.success(people.title + ' a été mise à jour',
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
