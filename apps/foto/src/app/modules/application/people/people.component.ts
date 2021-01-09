import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  constructor(private route: ActivatedRoute, public catService: CategoryService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = parseInt(params.get('idPeople'));
      if (id){
        this.catService.loadPeople(id);
      }
      else{
        this.catService.loadRootPeople();
      }
    });
  }

}
