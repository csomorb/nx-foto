import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { first } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { VideoModel } from '../../models/video.model';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
import { CategoryService } from '../../services/category.service';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESCAPE = 27
}

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  photoBaseUrl: string = environment.fileUrl;
  videoBaseUrl: string = environment.fileUrl + '/videos/';
  video: VideoModel;
  editMode: boolean;
  deleteMode: boolean;
  tagMode:boolean;
  newFace: any;
  facelist:Array<any>;
  idVideo: number;
  @ViewChild('video', { static: true }) videoElement: ElementRef;

  constructor(public catService: CategoryService, private router: Router,
    private location: Location, private route: ActivatedRoute, private apiService: ApiService,
    private toast: ToastrService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idVideo = parseInt(params.get('idVideo'));
      this.catService.loadVideoFromId(this.idVideo);
      console.log('charge');
      // setTimeout( () => console.log("wait to load children"), 500);
    });
    this.newFace = null;
    this.tagMode = false;
    this.editMode = false;
    this.editMode = false;
    this.facelist = [];

    this.catService.selectedCoordinates.subscribe( coord => {
      if (this.catService.curItem.idVideo){
        this.catService.curItem.long = coord[0];
        this.catService.curItem.lat = coord[1];
        this.apiService.putVideo(this.catService.curItem as VideoModel).subscribe(
          {
            next: data => {
              this.catService.geoTagMode = false;
              this.catService.updateVideo(data);
              this.toast.success(data.title,
                'Enregistré',
                {timeOut: 3000,});
            },
            error: error => {
              this.toast.error(this.catService.curItem.title,
              'Echec de la modification',
              {timeOut: 4000,});
              console.error('There was an error in rotation!', error);
            }
        });
      }
    });
  }

  moveNextItem(){
    const previousVideoId = this.catService.curItem.idVideo;
    this.catService.moveNextItem();
    if(this.catService.curItem.idVideo){
      const cururl = this.location.path().replace( 'videos/'+previousVideoId, 'videos/' + this.catService.curItem.idVideo );
      this.location.go(cururl);
      this.idVideo = this.catService.curItem.idVideo;
      this.video = this.catService.curItem as VideoModel;
      this.videoElement.nativeElement.load();
      this.tagMode = false;
    }
    else{
      this.route.pathFromRoot[1].url.pipe(first()).subscribe( val => this.router.navigateByUrl('/'+val[0].path+'/'+
      this.catService.curCat.id + '/photos/' + this.catService.curItem.idPhoto));
    }
  }

  movePrevItem(){
    const previousVideoId = this.catService.curItem.idVideo;
    this.catService.movePrevItem();
    if(this.catService.curItem.idVideo){
      const cururl = this.location.path().replace( 'videos/'+previousVideoId, 'videos/' + this.catService.curItem.idVideo );
      this.location.go(cururl);
      this.video = this.catService.curItem as VideoModel;
      this.tagMode = false;
      this.idVideo = this.catService.curItem.idVideo;
      this.videoElement.nativeElement.load();
    }
    else{
      this.route.pathFromRoot[1].url.pipe(first()).subscribe( val => this.router.navigateByUrl('/'+
      val[0].path+'/'+this.catService.curCat.id +'/photos/' + this.catService.curItem.idPhoto));
    }
  }

  gotToPeople(idPeople){
    this.router.navigateByUrl('peoples/' + idPeople);
  }

  gotToTag(idTag){
    this.router.navigateByUrl('tags/' + idTag);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.moveNextItem();
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.movePrevItem();
    }
    if (event.keyCode === KEY_CODE.ESCAPE) {
      this.returnGalery();
    }
  }

  setSelectedTag(idTag){
    if (this.catService.curItem.tags.findIndex(t => t.id === idTag) === -1)
    this.apiService.setVideoTag(this.catService.curItem.idVideo,idTag).subscribe(  {
      next: res => {
        const tag = this.catService.tagList.find(t => t.id === idTag);
        this.catService.curItem.tags.push(tag);
        this.catService.updateVideo(this.catService.curItem as VideoModel);
        this.toast.success( '',
          'Enregistré',
          {timeOut: 3000,});
      },
      error: error => {
        this.toast.error('Non enregistré',
        'Echec de la modification',
        {timeOut: 4000,});
        console.error('There was an error in seting cover!', error);
      }
  });
  }

  delteSelectedTag(e,idTag){
    e.stopPropagation();
    this.apiService.unsetVideoTag(this.catService.curItem.idVideo,idTag).subscribe(  {
      next: res => {
        this.catService.curItem.tags.splice(this.catService.curItem.tags.findIndex( t => t.id === idTag),1);
        this.catService.updateVideo(this.catService.curItem as VideoModel);
        this.toast.success( '',
          'Enregistré',
          {timeOut: 3000,});
      },
      error: error => {
        this.toast.error('Non enregistré',
        'Echec de la modification',
        {timeOut: 4000,});
        console.error('There was an error in seting cover!', error);
      }
  });
  }

  returnGalery(){
    this.catService.returnGalery();
    this.route.pathFromRoot[1].url.pipe(first()).subscribe(
      val => this.router.navigateByUrl('/'+val[0].path+'/'+ this.catService.curCat.id));
  }

  toEditMode(){
    this.editMode = true;
    this.video = {...this.catService.curItem} as VideoModel;
  }

  cancelEditMode(){
    this.editMode = false;
  }

  updateVideo(){
    this.apiService.putVideo(this.video).subscribe( video =>{
      this.catService.updateVideo(video);
      console.log(video);
      this.editMode = false;
      this.toast.success(video.title + ' a été mise à jour',
        'Vidéo mise à jour',
        {timeOut: 3000,});
    }, error => {
      console.log(error);
      this.toast.error('Les modifications de ' + this.video.title + 'n\'ont pas été enregistrées',
          'Echec de la modification',
          {timeOut: 4000,});
    });
  }

  cancelGeoMode(){
    this.catService.geoTagMode = false;
  }

  toGeoMode(){
    this.catService.geoTagMode = true;
  }


  toDeleteMode(){
    this.deleteMode = true;
  }

  cancelDeleteMode(){
    this.deleteMode = false;
  }

  toTagMode(){
    this.tagMode = true;
  }

  cancelTagMode(){
    this.tagMode = false;
  }

  unsetSelectedFace(e,idPeople){
    e.stopPropagation();
    this.apiService.unsetVideoPeople(this.catService.curItem.idVideo,idPeople).subscribe(  {
      next: res => {
        this.catService.curItem.peoples.splice(this.catService.curItem.peoples.findIndex( t => t.id === idPeople),1);
        this.catService.updateVideo(this.catService.curItem as VideoModel);
        this.toast.success( '',
          'Enregistré',
          {timeOut: 3000,});
      },
      error: error => {
        this.toast.error('Non enregistré',
        'Echec de la modification',
        {timeOut: 4000,});
        console.error('There was an error in seting people!', error);
      }
  });
  }

  setSelectedFace(idPeople){
    this.apiService.setVideoPeople(this.catService.curItem.idVideo,idPeople).subscribe(  {
      next: res => {
        const people = this.catService.peopleList.find(p => p.id === idPeople);
        this.catService.curItem.peoples.push(people);
        this.catService.updateVideo(this.catService.curItem as VideoModel);
        this.toast.success( '',
          'Enregistré',
          {timeOut: 3000,});
      },
      error: error => {
        this.toast.error('Non enregistré',
        'Echec de la modification',
        {timeOut: 4000,});
        console.error('There was an error in seting people!', error);
      }
  });
  }

  deleteVideo(){
    this.apiService.deleteVideo(this.catService.curItem as VideoModel).subscribe(
      {
        next: data => {
          const previousVideoId = this.catService.curItem.idVideo;
          const videoTitle = this.catService.curItem.title;
          this.catService.deleteCurrentPhoto();
          this.toast.success(videoTitle,
            'Video supprimé',
            {timeOut: 3000,});
          if (this.catService.curItems.length === 0){
            this.returnGalery();
          }
          if(this.catService.curItem.idPhoto){
            this.route.pathFromRoot[1].url.pipe(first()).subscribe( val => this.router.navigateByUrl('/'+val[0].path+
            '/'+this.catService.curCat.id +'/photos/' + this.catService.curItem.idPhoto));
          }
          else{
            const cururl = this.location.path().replace( 'videos/'+previousVideoId, 'videos/' + this.catService.curItem.idVideo );
            this.location.go(cururl);
            this.video = this.catService.curItem as VideoModel;
            this.idVideo = this.catService.curItem.idVideo;
            this.deleteMode = false;
            this.videoElement.nativeElement.load();
          }
        },
        error: error => {
          this.toast.error(this.catService.curItem.title,
          'Echec de la suppression',
          {timeOut: 4000,});
          console.error('There was an error in delete!', error);
        }
    });
  }

  download(){
    saveAs(this.videoBaseUrl + this.idVideo + '/' + this.idVideo + '.mp4', this.catService.curItem.originalFileName.split('.')[0] + '.mp4');
  }

}
