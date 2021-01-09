import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { TagModel } from '../../models/tag.model';
import { ApiService } from '../../services/api.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-selecttag',
  templateUrl: './selecttag.component.html',
  styleUrls: ['./selecttag.component.css']
})
export class SelecttagComponent implements OnInit {
  @Output() selectedTagID = new EventEmitter<number>();

  listTagsResult: Array<TagModel>;
  listTags: Array<TagModel>;
  search: string;
  modeAdd: boolean;
  displaySearchRes: boolean;
  tag: TagModel;
  exactMatch: TagModel;
  photoBaseUrl: string = environment.fileUrl;

  constructor(private catService: CategoryService, private apiService: ApiService, private fb: FormBuilder,private toast: ToastrService) { }

  ngOnInit(): void {
    this.search='';
    this.displaySearchRes = false;
    this.modeAdd = false;
    this.exactMatch = null;
    this.listTags = [...this.catService.tagList];
    // if(this.exeptPeople){
    //   for (let i= 0; i < this.exeptPeople.length; i++){
    //     // console.log( this.exeptPeople[i].title);
    //     if ((this.defaultSelectedId && this.exeptPeople[i].id != this.defaultSelectedId) || !this.defaultSelectedId)
    //       this.listPeoples.splice(this.listPeoples.findIndex(p => p.id == this.exeptPeople[i].id),1);
    //   }
    // }
    // if (this.defaultSelectedId){
    //   // console.log(this.defaultSelectedId)
    //   this.selectedPeople = this.listPeoples.find(p => p.id == this.defaultSelectedId);
    // }
    // console.log(this.listTags);
    this.searchTag();
  }

  displaySearch(){
    this.displaySearchRes = true;
  }

  hideSearch(){
    this.displaySearchRes = false;
  }


  searchTag(){
    const searchedName = this.search.trim().toLowerCase();
    if (searchedName){
      this.listTagsResult = [];
      this.listTagsResult = this.listTags.filter(p => p.title.toLowerCase().includes(searchedName));
      this.exactMatch = this.listTags.find(t => t.title.toLowerCase() === searchedName);
    }
    else{
      this.listTagsResult = this.listTags;
    }
  }

  toModeAdd(){
    this.modeAdd = true;
    this.tag = { id: 0, title: this.search, description: ''};
  }

  selectTag(t){
    console.log(t);
    this.selectedTagID.emit(t.id);
    this.hideSearch();
    this.search = '';
    this.searchTag();
  }

  cancelModeAdd(){
    this.modeAdd = false;
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
            this.modeAdd = false;
            this.toast.success( data.title,
              'Ajouté',
              {timeOut: 3000,});
            this.selectedTagID.emit(data.id);
            // this.selectedPeople = data;
            this.catService.tagList.push(data);
            this.listTags.push(data);
            this.searchTag();
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
