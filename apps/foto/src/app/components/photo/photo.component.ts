import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { PhotoModel } from '../../models/photo.model';
import { CategoryService } from '../../services/category.service';
import { ApiService } from '../../services/api.service';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESCAPE = 27
}

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {

  photoBaseUrl: string = environment.fileUrl;
  photo: PhotoModel;
  editMode: boolean;
  deleteMode: boolean;
  tagMode:boolean;
  newFace: any;
  facelist:Array<any>; //{total: 1, width: 39, height: 39, x: 195, y: 624}


  constructor(public catService: CategoryService, private router: Router,
    private location: Location, private route: ActivatedRoute, private apiService: ApiService,
    private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const idPhoto = parseInt(params.get('idPhoto'));
      this.catService.loadPhotoFromId(idPhoto);
      // setTimeout( () => console.log("wait to load children"), 500);
    });
    this.newFace = null;
    this.tagMode = false;
    this.editMode = false;
    this.editMode = false;
    this.facelist = [];

    this.catService.selectedCoordinates.subscribe( coord => {
      if (this.catService.curItem.idPhoto){
        this.catService.curItem.long = coord[0];
        this.catService.curItem.lat = coord[1];
        this.apiService.putPhoto(this.catService.curItem as PhotoModel).subscribe(
          {
            next: data => {
              this.catService.geoTagMode = false;
              this.catService.updatePhoto(data);
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

  moveNextPhoto(){
    const previousPhotoId = this.catService.curItem.idPhoto;
    this.catService.moveNextItem();
    if(this.catService.curItem.idPhoto){
      const cururl = this.location.path().replace('photos/'+previousPhotoId,'photos/' + this.catService.curItem.idPhoto );
      this.location.go(cururl);
      this.photo = this.catService.curItem as PhotoModel;
      this.tagMode = false;
    }
    else{
      this.route.pathFromRoot[1].url.pipe(first()).subscribe( val =>
        this.router.navigateByUrl('/'+val[0].path+'/'+this.catService.curCat.id +'/videos/' + this.catService.curItem.idVideo));
    }
  }

  movePrevPhoto(){
    const previousPhotoId = this.catService.curItem.idPhoto;
    this.catService.movePrevItem();
    if(this.catService.curItem.idPhoto){
      const cururl = this.location.path().replace('photos/'+previousPhotoId,'photos/' + this.catService.curItem.idPhoto );
      this.location.go(cururl);
      this.photo = this.catService.curItem as PhotoModel;
      this.tagMode = false;
    }
    else{
      this.route.pathFromRoot[1].url.pipe(first()).subscribe( val =>
        this.router.navigateByUrl('/'+val[0].path+'/'+this.catService.curCat.id +'/videos/' + this.catService.curItem.idVideo));
    }
  }


  tagNotDetected(e, img){
    this.newFace = { x:e.offsetX/img.width , y:e.offsetY/img.height, h: 0, w: 0}
    console.log(e.offsetX);
    console.log(e.offsetY);
    console.log(img.width);
    console.log(img.height);
  }

  setSelectedTag(idTag){
    if (this.catService.curItem.tags.findIndex(t => t.id === idTag) === -1)
    this.apiService.setPhotoTag(this.catService.curItem.idPhoto,idTag).subscribe(  {
      next: res => {
        const tag = this.catService.tagList.find(t => t.id === idTag);
        console.log(tag);
        this.catService.curItem.tags.push(tag);
        this.catService.updatePhoto(this.catService.curItem as PhotoModel);
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
    this.apiService.unsetPhotoTag(this.catService.curItem.idPhoto,idTag).subscribe(  {
      next: res => {
        this.catService.curItem.tags.splice(this.catService.curItem.tags.findIndex( t => t.id === idTag),1);
        this.catService.updatePhoto(this.catService.curItem as PhotoModel);
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

  setSelectedFace(e,f){
    // console.log('POST FACETAG');
    if (e === 0){
      this.apiService.deleteFace(f.facesId).subscribe(
        {
          next: res => {
            this.catService.curItem.facesToTag.push({x:f.x, y:f.y, w:f.w,h:f.h})
            this.catService.curItem.faces.splice(this.catService.curItem.faces.findIndex(t => t.x === f.x && t.y === f.y),1);
            this.catService.curItem.peoples.splice(this.catService.curItem.peoples.findIndex(p => p.id === f.idPeople),1);
            this.catService.updatePhoto(this.catService.curItem as PhotoModel);
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
    else{
      this.apiService.postFace(this.catService.curItem.idPhoto,e,f.x,f.y,f.h,f.w).subscribe(
        {
          next: res => {
            console.log(res);
            this.newFace = null;
            this.catService.curItem.faces.push(res);
            this.catService.curItem.facesToTag.splice(this.catService.curItem.facesToTag.findIndex(t => t.x === f.x && t.y === f.y),1);
            // this.catService.curPhoto.listPeople.push(res.people);
            // TODO à modifier
            this.catService.updatePhoto(this.catService.curItem as PhotoModel);
            this.catService.curItem.peoples.push(res.people);


            this.toast.success( res.people.title,
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

    console.log(e);
    console.log(f);
    // TODO: mise à jour du list people et passage
  }

  gotToPeople(idPeople){
    this.router.navigateByUrl('peoples/' + idPeople);
  }

  gotToAlbum(idAlbum){
    this.router.navigateByUrl('albums/' + idAlbum);
  }

  gotToTag(idTag){
    this.router.navigateByUrl('tags/' + idTag);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.moveNextPhoto();
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.movePrevPhoto();
    }
    if (event.keyCode === KEY_CODE.ESCAPE) {
      this.returnGalery();
    }
  }

  returnGalery(){
    this.catService.returnGalery();
    this.route.pathFromRoot[1].url.pipe(first()).subscribe( val =>
      this.router.navigateByUrl('/'+val[0].path+'/'+this.catService.curCat.id));
  }

  toEditMode(){
    this.editMode = true;
    this.photo = {...this.catService.curItem} as PhotoModel;
  }

  cancelEditMode(){
    this.editMode = false;
  }

  updatePhoto(){
    this.apiService.putPhoto(this.photo).subscribe( photo =>{
      this.catService.updatePhoto(photo);
      this.editMode = false;
      this.toast.success(photo.title + ' a été mise à jour',
        'Photo mise à jour',
        {timeOut: 3000,});
    }, error => {
      console.log(error);
      this.toast.error('Les modifications de ' + this.photo.title + 'n\'ont pas été enregistrées',
          'Echec de la modification',
          {timeOut: 4000,});
    });

  }

  showFace(idPeople){
    this.catService.curItem.faces[this.catService.curItem.faces.findIndex(p => p.idPeople === idPeople)].show = true;
  }

  showTagedFace(idPeople){
    this.catService.curItem.faces[this.catService.curItem.faces.findIndex(p => p.idPeople === idPeople)].show = true;
  }

  hideTagedFace(idPeople){
    if (!this.tagMode)
      this.catService.curItem.faces[this.catService.curItem.faces.findIndex(p => p.idPeople === idPeople)].show = false;
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
    this.catService.curItem.faces.forEach(f => f.show = false);
  }

  rotateLeft(){
    this.apiService.rotateLeft(this.catService.curItem as PhotoModel).subscribe(
      {
        next: data => {
          data.srcOrig+='?' + new Date().getTime();
          data.src150+='?' + new Date().getTime();
          data.src320+='?' + new Date().getTime();
          data.src640+='?' + new Date().getTime();
          data.src1280+='?' + new Date().getTime();
          data.src1920+='?' + new Date().getTime();
          this.catService.updatePhoto(data);
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

  rotateRight(){
    this.apiService.rotateRight(this.catService.curItem as PhotoModel).subscribe(
      {
        next: data => {
          data.srcOrig+='?' + new Date().getTime();
          data.src150+='?' + new Date().getTime();
          data.src320+='?' + new Date().getTime();
          data.src640+='?' + new Date().getTime();
          data.src1280+='?' + new Date().getTime();
          data.src1920+='?' + new Date().getTime();
          this.catService.updatePhoto(data);
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

  deletePhoto(){
    this.apiService.deletePhoto(this.catService.curItem as PhotoModel).subscribe(
      {
        next: data => {
          const previousPhotoId = this.catService.curItem.idPhoto;
          const photoTitle = this.catService.curItem.title;
          this.catService.deleteCurrentPhoto();
          this.toast.success(photoTitle,
            'Photo supprimé',
            {timeOut: 3000,});
          if (this.catService.curItems.length === 0){
            this.returnGalery();
          }
          if(this.catService.curItem.idVideo){
            this.route.pathFromRoot[1].url.pipe(first()).subscribe( val =>
              this.router.navigateByUrl('/'+val[0].path+'/'+this.catService.curCat.id +'/videos/' + this.catService.curItem.idVideo));
          }
          else{
            const cururl = this.location.path().replace( 'photos/'+previousPhotoId, 'photos/' + this.catService.curItem.idPhoto );
            this.location.go(cururl);
            this.photo = this.catService.curItem as PhotoModel;
            this.deleteMode = false;
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

  setCover(){
    this.route.pathFromRoot[1].url.pipe(first()).subscribe( val => {
      this.apiService.putCover(this.catService.curCat, this.catService.curItem as PhotoModel, val[0].path).subscribe(
        {
          next: cat => {
            this.catService.setCover(this.catService.curItem as PhotoModel, val[0].path);
            this.toast.success( this.catService.curItem.title,
              'Photo de couverture',
              {timeOut: 3000,});
          },
          error: error => {
            this.toast.error('La photo de couverture n\'a pas été mise à jour',
            'Echec de la modification',
            {timeOut: 4000,});
            console.error('There was an error in seting cover!', error);
          }
      });
    });
  }

  unsetCover(){
    this.route.pathFromRoot[1].url.pipe(first()).subscribe( val => {
      this.apiService.putNoCover(this.catService.curCat, val[0].path).subscribe(
      {
        next: cat => {
          this.catService.setCover(null, val[0].path);
          this.toast.success( this.catService.curItem.title,
            'Photo de couverture enlevé',
            {timeOut: 3000,});
        },
        error: error => {
          this.toast.error('La photo de couverture n\'a pas été enlevé',
          'Echec de la modification',
          {timeOut: 4000,});
          console.error('There was an error in seting cover!', error);
        }
      });
    });
  }

  download(){
    saveAs(this.photoBaseUrl + this.catService?.curItem?.srcOrig,this.catService.curItem.originalFileName);
  }


}
