import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { PeopleModel } from '../../models/people.model';
import { ApiService } from '../../services/api.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-selectpeople',
  templateUrl: './selectpeople.component.html',
  styleUrls: ['./selectpeople.component.css']
})
export class SelectpeopleComponent implements OnInit {
  @Output() selectedPeopleID = new EventEmitter<number>();
  @Input() exeptPeople?: Array<PeopleModel>;
  @Input() defaultSelectedId?: number;

  listPeoples:Array<PeopleModel>;
  listPeoplesResult: Array<PeopleModel>;
  search: string;
  modeAdd: boolean;
  people: PeopleModel;
  selectedPeople: PeopleModel;
  photoBaseUrl: string = environment.fileUrl;

  constructor(private catService: CategoryService, private apiService: ApiService, private fb: FormBuilder,private toast: ToastrService) { }



  ngOnInit(): void {
    this.selectedPeople = undefined;
    this.search='';
    this.modeAdd = false;
    this.listPeoples = [...this.catService.peopleList];
    if(this.exeptPeople){
      for (let i= 0; i < this.exeptPeople.length; i++){
        // console.log( this.exeptPeople[i].title);
        if ((this.defaultSelectedId && this.exeptPeople[i].id != this.defaultSelectedId) || !this.defaultSelectedId)
          this.listPeoples.splice(this.listPeoples.findIndex(p => p.id == this.exeptPeople[i].id),1);
      }
    }
    if (this.defaultSelectedId){
      // console.log(this.defaultSelectedId)
      this.selectedPeople = this.listPeoples.find(p => p.id == this.defaultSelectedId);
    }
    console.log(this.listPeoples);
    this.searchPeople();
  }

  searchPeople(){
    let searchedName = this.search.trim().toLowerCase();
    console.log(searchedName);
    if (searchedName){
      this.listPeoplesResult = [];
      this.listPeoplesResult = this.listPeoples.filter(p => p.title.toLowerCase().includes(searchedName));
    }
    else{
      this.listPeoplesResult = this.listPeoples;
    }
  }

  toModeAdd(){
    this.modeAdd = true;
    this.people = { id: 0, title: this.search, description: '', birthDay: new Date()};
  }

  cancelSelect(){
    this.selectedPeople = undefined;
    this.selectedPeopleID.emit(0);
  }

  selectPeople(p){
    console.log(p.id);
    this.selectedPeopleID.emit(p.id);
    this.selectedPeople = p;
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
            this.toast.success(peopleName,
              'Ajouté',
              {timeOut: 3000,});
            this.selectedPeopleID.emit(data.id);
            this.selectedPeople = data;
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
