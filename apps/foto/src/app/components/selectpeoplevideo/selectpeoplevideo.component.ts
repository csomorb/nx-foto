import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { PeopleModel } from '../../models/people.model';
import { ApiService } from '../../services/api.service';
import { CategoryService } from '../../services/category.service';


@Component({
  selector: 'app-selectpeoplevideo',
  templateUrl: './selectpeoplevideo.component.html',
  styleUrls: ['./selectpeoplevideo.component.css']
})
export class SelectpeoplevideoComponent implements OnInit {
  @Output() selectedPeopleID = new EventEmitter<number>();

  listPeoplesResult: Array<PeopleModel>;
  listPeoples: Array<PeopleModel>;
  search: string;
  modeAdd: boolean;
  displaySearchRes: boolean;
  people: PeopleModel;
  exactMatch: PeopleModel;
  photoBaseUrl: string = environment.fileUrl;
  constructor(private catService: CategoryService, private apiService: ApiService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.search='';
    this.displaySearchRes = false;
    this.modeAdd = false;
    this.exactMatch = null;
    this.listPeoples = [...this.catService.peopleList];
    this.searchPeople();
  }

  displaySearch(){
    this.displaySearchRes = true;
  }

  hideSearch(){
    this.displaySearchRes = false;
  }


  searchPeople(){
    const searchedName = this.search.trim().toLowerCase();
    if (searchedName){
      this.listPeoplesResult = [];
      this.listPeoplesResult = this.listPeoples.filter(p => p.title.toLowerCase().includes(searchedName));
      this.exactMatch = this.listPeoples.find(t => t.title.toLowerCase() === searchedName);
    }
    else{
      this.listPeoplesResult = this.listPeoples;
    }
  }

  toModeAdd(){
    this.modeAdd = true;
    this.people = { id: 0, title: this.search, description: '', birthDay: new Date()};
  }

  selectPeople(t){
    this.selectedPeopleID.emit(t.id);
    this.hideSearch();
    this.search = '';
    this.searchPeople();
  }

  cancelModeAdd(){
    this.modeAdd = false;
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
            const peopleName = data.title;
            this.modeAdd = false;
            this.toast.success( data.title,
              'Ajouté',
              {timeOut: 3000,});
            this.selectedPeopleID.emit(data.id);
            // this.selectedPeople = data;
            this.catService.peopleList.push(data);
            this.listPeoples.push(data);
            this.searchPeople();
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

}
