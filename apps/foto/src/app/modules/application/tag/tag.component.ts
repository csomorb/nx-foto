import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  constructor(private route: ActivatedRoute, public catService: CategoryService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = parseInt(params.get('idTag'));
      if (id){
        this.catService.loadTag(id);
      }
      else{
        this.catService.loadRootTag();
      }
    });
  }

}
