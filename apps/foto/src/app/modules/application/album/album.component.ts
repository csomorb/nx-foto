import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})

export class AlbumComponent implements OnInit {

  constructor(private route: ActivatedRoute, public catService: CategoryService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = parseInt(params.get('idAlbum'));
      if (id){
        this.catService.loadAlbum(id);
      }
      else{
        this.catService.loadRootAlbum();
      }
    });
  }

}
