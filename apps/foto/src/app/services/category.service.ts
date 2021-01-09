import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlbumModel } from '../models/album.model';
import { CategoryModel } from '../models/category.model';
import { PeopleModel } from '../models/people.model';
import { PhotoModel } from '../models/photo.model';
import { TagModel } from '../models/tag.model';
import { VideoModel } from '../models/video.model';
import { ApiService } from './api.service';
import { MarkerModel } from '../models/marker.model';
import { Subject } from 'rxjs';
import { ItemModel } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  /**
   * Current category
   */
  curCat: AlbumModel | PeopleModel | TagModel | CategoryModel;

  curItems: Array<ItemModel>;
  curAlbumItems: Array<ItemModel>;

  timeYears: Array<number>;
  timeMonths: Array<any>;
  timeDays: Array<any>;
  curItem: ItemModel;
  nextItem: ItemModel;
  prevItem: ItemModel;
  idPhotoToLoad: number;
  idVideoToLoad: number;

  parentList: Array<any>;
  peopleList: Array<PeopleModel>;
  tagList: Array<TagModel>;
  albumList: Array<AlbumModel>;

  markersSource : BehaviorSubject<Array<MarkerModel>> = new BehaviorSubject([]);
  markers = this.markersSource.asObservable();
  selectedCoordinates = new Subject();
  geoTagMode: boolean;
  displayMap: boolean;

  constructor(private apiService: ApiService) {
    this.idPhotoToLoad = 0;
    this.idVideoToLoad = 0;
    this.geoTagMode = false;
    this.curAlbumItems = [];
    this.apiService.getPeoples().subscribe( p => this.peopleList = p);
    this.apiService.getTags().subscribe( t => this.tagList = t );
    this.apiService.getAlbumsCover().subscribe( a => this.albumList = a );
    this.displayMap = false;
  }

  /**
   * Charge toutes les personnes
   */
  loadRootPeople(){
    this.displayMap = false;
    this.curCat = {id: 0, title: 'Personnes', description : 'Liste des personnes taguées', listPeople : []} as CategoryModel;
    this.parentList = [];
    this.apiService.getRootsPeoples().subscribe(peoples => {
      if (peoples)
      this.curCat.listPeople = peoples;

    });
    this.curItems = [];
  }

  /**
   * Charge tous les tags
   */
  loadRootTag(){
    this.displayMap = false;
    this.curCat = {id: 0, title: 'Tags', description : 'Liste des tags', listTag : []} as CategoryModel;
    this.parentList = [];
    this.apiService.getRootsTags().subscribe(tags => {
      if (tags)
      this.curCat.listTag = tags;
    });
    this.curItems = [];
  }

  /**
   * Charge le tag donné
   */
  loadTag(idTag){
    if (idTag === 0){
      console.error('Chargement racine people logic error')
    }
    this.displayMap = true;
    this.apiService.getTagWithPhotos(idTag).subscribe(tag => {
      this.curCat = tag;
      this.curCat.items = [];
      this.curCat.photos.forEach(f =>{
        this.curCat.items.push(f);
      });
      this.curCat.videos.forEach(f =>{
        this.curCat.items.push(f);
      });
      this._buildItems();
      this.parentList = [];
      this.curItems = [...this.curCat.items];
      this.updateMarkerFromCurItems();
      this._loadItemAfterInit();
    });
  }

  /**
   * Charge la personne donnée
   * @param idPeople
   */
  loadPeople(idPeople){
    if (idPeople === 0){
      console.error('Chargement racine people logic error')
    }
    this.displayMap = true;
    this.apiService.getPeopleWithPhotos(idPeople).subscribe(people => {
      this.curCat = people;
      this.curCat.items = this.curCat.videos;
      this.curCat.faces.forEach(f =>{
        this.curCat.items.push(f.photo);
      });
      this._buildItems();
      this.parentList = [];
      this.curItems = [...this.curCat.items];
      this.updateMarkerFromCurItems();
      this._loadItemAfterInit();
    });

  }

  /**
   * Charge l'album donné
   * @param id idAlbum
   */
  loadAlbum(id){
    this.displayMap = true;
    if (id === 0){
      console.error('Chargement racine logic error')
    }
    this.apiService.getAlbumWithPhotos(id).subscribe(album => {
      this.curCat = album;
      this.apiService.getSSAlbums(id).subscribe(liste => {
        this.curCat.listAlbum = liste.children;
        this.curCat.listAlbum.forEach((ssAlbum, i) =>
          this.apiService.getAlbumWithPhotos(ssAlbum.id).subscribe( ssAlbumWithCoverAndPhoto =>
            this.curCat.listAlbum[i] = ssAlbumWithCoverAndPhoto));
        this.parentList = [];
        // On met à jour la liste des parents
        this.apiService.getAlbumParents(id).subscribe(parents => {
          this._buildParentTree(parents,this.curCat);
          //this.parentList.unshift({ id :'', title: 'Acceuil'});
        });
      });
      this.curCat.items = [...this.curCat.photos,...this.curCat.videos];
      this._buildItems();
      this.curItems = [...this.curCat.items];
      this.triPriseDeVueAncienRecent();
      this.updateMarkerFromCurItems();
      this._loadItemAfterInit();
    });
  }

  private _buildItems(){
    this.curCat.items = this.curCat.items.map(i =>{
      i.shootDate = new Date(i.shootDate);
      if(i.peoples)
      i.peoples = i.peoples.map(p => {return this.peopleList.find( s => s.id === p.id)});
      else
        i.peoples = [];
      i.albums = i.albums.map(a => {
        return this.albumList.find( s => s.id === a.id)
      });
      i.tags = i.tags.map(a => {
        return this.tagList.find( s => s.id === a.id)
      });

      if(i.faces)
      i.faces = i.faces.map(f => {
        f.show = false;
        i.peoples.push(this.peopleList.find( s => s.id === f.idPeople));
        return f;
      });
      return i;
    });
  }


  /**
   * Charge les albums à la racine
   */
  loadRootAlbum(){
    this.displayMap = false;
    this.curCat = {id: 0, title: 'Acceuil', description : 'Bienvenu sur l\'album photo',
      listAlbum : [], photos: [], videos:[], items:[]} as CategoryModel;
    this.parentList = [];
    this.apiService.getRootsAlbums().subscribe(albums => {
      this.curCat.listAlbum = albums;
      this.curItems = [];
    });
  }

  /**
   * Charge toutes les photos pour la timeline
   */
  loadAlbumTimePhotos(){
    this.apiService.getAlbumsTimeItems(this.curCat.id,100).subscribe( albums =>{
      let nbItems = 0;
      this.curAlbumItems = [...this.curCat.items];
      albums.forEach(album => {
        nbItems += album.photos.length;
        nbItems += album.videos.length;
        this.curCat.items.push(...album.photos);
        this.curCat.items.push(...album.videos);
      });
      this._buildItems();
      this.curItems = [ ...this.curCat.items];
      this.getYears();
      if (nbItems > 99){
        this.apiService.getAlbumsTimeItems(this.curCat.id,0).subscribe( albums =>{
          albums.forEach(album => {
            this.curCat.items.push(...album.photos);
            this.curCat.items.push(...album.videos);
          });
          this._buildItems();
          this.curItems = [ ...this.curCat.items];
          this.getYears();
          this.updateMarkerFromCurItems();
        });
      }
      else{
        this.updateMarkerFromCurItems();
      }
    })
  }

  /**
   * Renviens en mode album
   */
  cancelAlbumTimePhotos(){
    this.curItems = [...this.curAlbumItems];
    this.curCat.items = [...this.curAlbumItems];
    this.curAlbumItems = [];
  }


  /**
   * Pass à l'item suivante si disponible
   */
  moveNextItem(){
    if(this.nextItem){
      this.curItem = this.nextItem;
      this._getNextPrevItem(this.curItem);
    }
  }

  /**
   * Pass à l'item précédente si disponible
   */
  movePrevItem(){
    if(this.prevItem){
      this.curItem = this.prevItem;
      this._getNextPrevItem(this.curItem);
    }
  }

  /**
   * Met à jour une vidéo dans la catégorie suite à un changement en bdd
   * @param video Vidéo avec les champs mise à jour
   */
  updateVideo(updatedVideo: VideoModel){
    updatedVideo.shootDate = new Date(updatedVideo.shootDate);
    updatedVideo.albums = updatedVideo.albums.map( a =>{
      return this.albumList.find(al => al.id === a.id);
    });
    if (this.curItem){
      this.curItem = updatedVideo;
      this.updateMarkerFromCurItem();
    }
    else{
      this.updateMarkerFromCurItems()
    }
    this.curCat.items.forEach( video => {
      if (video.idVideo === updatedVideo.idVideo){
        video = updatedVideo;
      }
    });
    this.curItems.forEach( video => {
      if (video.idVideo === updatedVideo.idVideo){
        video = updatedVideo;
      }
    });
  }

  /**
   * Met à jour une photo dans la catégorie suite à un changement en bdd
   * @param photo Photo avec les champs mise à jour
   */
  updatePhoto(updatedPhoto: PhotoModel){
    updatedPhoto.shootDate = new Date(updatedPhoto.shootDate);
    updatedPhoto.albums = updatedPhoto.albums.map( a =>{
      return this.albumList.find(al => al.id === a.id);
    });
    if (this.curItem){
      this.curItem = updatedPhoto;
      this.updateMarkerFromCurItem();
    }
    else{
      this.updateMarkerFromCurItems()
    }
    this.curCat.items.forEach( photo => {
      if (photo.idPhoto === updatedPhoto.idPhoto){
        photo = updatedPhoto;
      }
    });
    this.curItems.forEach( photo => {
      if (photo.idPhoto === updatedPhoto.idPhoto){
        photo = updatedPhoto;
      }
    });
  }

  updateCategory(category){
    this.curCat = { ...this.curCat, ...category };
  }

  setCover(photo, cat){
    this.curCat.coverPhoto = photo;
    if(cat === 'albums'){
      this.albumList[this.albumList.findIndex(a => a.id === this.curCat.id)].coverPhoto = photo;
      this.curItems.forEach(i => {
        i.albums.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        })
      });
      this.curCat.items.forEach(i => {
        i.albums.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      });
      if (this.curItem){
        this.curItem.albums.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      }
      this.curAlbumItems.forEach(i => {
        i.albums.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      });
    }
    if(cat === 'peoples'){
      this.albumList[this.peopleList.findIndex(a => a.id === this.curCat.id)].coverPhoto = photo;
      this.curItems.forEach(i => {
        i.peoples.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        })
      });
      this.curCat.items.forEach(i => {
        i.peoples.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      });
      if (this.curItem){
        this.curItem.peoples.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      }
      this.curAlbumItems.forEach(i => {
        i.peoples.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      });
    }
    if(cat === 'tags'){
      this.albumList[this.tagList.findIndex(a => a.id === this.curCat.id)].coverPhoto = photo;
      this.curItems.forEach(i => {
        i.tags.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        })
      });
      this.curCat.items.forEach(i => {
        i.tags.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      });
      if (this.curItem){
        this.curItem.tags.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      }
      this.curAlbumItems.forEach(i => {
        i.tags.forEach(a => {
          if (a.id === this.curCat.id)
            a.coverPhoto = photo;
        });
      });
    }
  }

  /**
   * Supprime une vidéo de la catégorie
   * @param idVideoToDelete
   */
  deleteVideo(idVideoToDelete){
    this.curCat.items.splice(this.curCat.items.findIndex(video => video.idVideo === idVideoToDelete), 1);
    this.curItems.splice(this.curItems.findIndex(video => video.idVideo === idVideoToDelete), 1);
  }

  /**
   * Supprime une photo de la catégorie
   * @param idPhotoToDelete
   */
  deletePhoto(idPhotoToDelete){
    this.curCat.items.splice(this.curCat.items.findIndex(photo => photo.idPhoto === idPhotoToDelete), 1);
    this.curItems.splice(this.curItems.findIndex(photo => photo.idPhoto === idPhotoToDelete), 1);
    this.updateMarkerFromCurItems()
  }


  /**
   * Supprime l'item en cours de visio
   */
  deleteCurrentPhoto(){
    const t = this.curItem.idPhoto ? 'photo' : 'video';
    const idItemToDelete = this.curItem.idPhoto ? this.curItem.idPhoto : this.curItem.idVideo;
    let itemToShow: ItemModel = null;
    if (this.nextItem){
      itemToShow = this.nextItem;
    }
    else if(this.prevItem){
      itemToShow = this.prevItem;
    }
    if (t === 'photo'){
      this.curCat.items.splice(this.curCat.items.findIndex(photo => photo.idPhoto === idItemToDelete), 1);
      this.curItems.splice(this.curItems.findIndex(photo => photo.idPhoto === idItemToDelete), 1);
    }
    if (t === 'video'){
      this.curCat.items.splice(this.curCat.items.findIndex(video => video.idVideo === idItemToDelete), 1);
      this.curItems.splice(this.curItems.findIndex(video => video.idVideo === idItemToDelete), 1);
    }
    if (itemToShow){
      this.curItem = itemToShow;
      this._getNextPrevItem(itemToShow);
    }
    else{
      this.curItem = null;
    }
    if (this.curCat.coverPhoto && this.curCat.coverPhoto.idPhoto === idItemToDelete && t === 'photo'){
      this.curCat.coverPhoto = null;
    }
  }

  /**
   * Charge la vidéo à partir de son id, si la catégorie n'est pas encore chargé, on le charge au chargement de la catégorie
   * @param idVideo
   */
  loadVideoFromId(idVideo: number){
    if (!this.curItems){
      this.idVideoToLoad = idVideo;
    }
    else{
      this.curItem = this.curItems.find(video => video.idVideo === idVideo);
      this._getNextPrevItem(this.curItem);
    }
  }

  /**
   * Charge l'item' donnée
   * @param item
   */
  loadItem(item: ItemModel){
    this.curItem = item;
    this._getNextPrevItem(item);
  }

  /**
   * Charge la photo à partir de son id, si la catégorie n'est pas encore chargé, on le charge au chargement de la catégorie
   * @param idPhoto
   */
  loadPhotoFromId(idPhoto: number){
    if (!this.curItems){
      this.idPhotoToLoad = idPhoto;
    }
    else{
      this.curItem = this.curItems.find(photo => photo.idPhoto === idPhoto);
      this._getNextPrevItem(this.curItem);
    }
  }

  /**
   * Retourne à la galérie
   */
  returnGalery(){
    // this.curPhoto = null;
    this.nextItem = null;
    this.prevItem = null;
    this.curItem = null;
    this.geoTagMode = false;
    this.updateMarkerFromCurItems();
  }

  private _getNextPrevItem(item: ItemModel){
    let currentPosition = 0;
    if (item.idPhoto){
      currentPosition = this.curItems.findIndex(i => i.idPhoto === item.idPhoto);
    }
    else if (item.idVideo){
      currentPosition = this.curItems.findIndex(i => i.idVideo === item.idVideo);
    }
    if (currentPosition < this.curItems.length){
      this.nextItem = this.curItems[currentPosition + 1];
    }
    else{
      this.nextItem = null;
    }
    if (currentPosition > 0){
      this.prevItem = this.curItems[currentPosition - 1];
    }
    else{
      this.prevItem = null;
    }
    this.updateMarkerFromCurItem();
  }

  private _buildParentTree(tree, currentAlbum){
    if (tree.parent){
      if (currentAlbum.id === tree.id){
        this.parentList.unshift({id : tree.parent.id, title : tree.parent.title});
        const albumParent: AlbumModel = {id: tree.parent.id, title : tree.parent.title, description : tree.parent.description};
        albumParent.listAlbum = currentAlbum;
        this._buildParentTree(tree.parent,albumParent);
      }
      else{
        console.error('Error logic in build parent tree');
      }
    }
  }

  private _loadItemAfterInit(){
    if (this.idPhotoToLoad){
      this.curItem = this.curItems.find(photo => photo.idPhoto === this.idPhotoToLoad);
      this._getNextPrevItem(this.curItem);
      this.idPhotoToLoad = 0;
      this.updateMarkerFromCurItem();
    }
    if (this.idVideoToLoad){
      this.curItem = this.curItems.find(video => video.idVideo === this.idVideoToLoad);
      this._getNextPrevItem(this.curItem);
      this.idVideoToLoad = 0;
      this.updateMarkerFromCurItem();
    }
  }

  getYears(){
    this.timeYears = [];
    this.timeMonths = [];
    this.timeDays = [];
    this.curItems.map( p => {
      const year = p.shootDate.getFullYear();
      const month = p.shootDate.getMonth();
      const day = p.shootDate.getDate();
      if (this.timeYears.indexOf(year) === -1){
        this.timeYears.push(year);
      }
      if (this.timeMonths.findIndex( d => d.y === year && d.m === month) === -1){
        this.timeMonths.push({ y : year, m: month });
      }
      if (this.timeDays.findIndex( d => d.y === year && d.m === month  && d.d === day) === -1){
        this.timeDays.push({ y : year, m: month, d: day });
      }
    });
    this.timeYears.sort((a,b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    this.timeMonths.sort((a,b) => {
      if (a.y * 100 + a.m < b.y * 100 + b.m) return -1;
      if (a.y * 100 + a.m > b.y * 100 + b.m) return 1;
      return 0;
    });
    this.timeDays.sort((a,b) => {
      if (a.y * 10000 + a.m * 100 + a.d < b.y * 10000 + b.m * 100 + b.d) return -1;
      if (a.y * 10000 + a.m * 100 + a.d > b.y * 10000 + b.m * 100 + b.d) return 1;
      return 0;
    });
    this.triPriseDeVueAncienRecent();
  }

  filterYears(year){
    this.curItems = this.curCat.items.filter( p => p.shootDate.getFullYear() === year);
    this.triPriseDeVueAncienRecent();
    this.updateMarkerFromCurItems();
  }

  filterMonth(year, month){
    this.curItems = this.curCat.items.filter( p => p.shootDate.getFullYear() === year && p.shootDate.getMonth() === month);
    this.triPriseDeVueAncienRecent();
    this.updateMarkerFromCurItems();
  }

  filterDay(year, month, day){
    this.curItems = this.curCat.items.filter( p => p.shootDate.getFullYear() === year &&
                    p.shootDate.getMonth() === month && p.shootDate.getDate() === day );
    this.triPriseDeVueAncienRecent();
    this.updateMarkerFromCurItems();
  }

  cancelFilter(){
    this.curItems = [...this.curCat.items];
    this.triPriseDeVueAncienRecent();
    this.updateMarkerFromCurItems();
  }

  updateMarkers(markers: Array<MarkerModel>){
    this.markersSource.next(markers);
  }

  addMarker(marker: MarkerModel){
    const updatedValue = [...this.markersSource.value, marker];
    this.markersSource.next(updatedValue);
  }

  updateMarkerFromCurItems(){
    const markers: Array<MarkerModel> = [];
    this.curItems.forEach( i => {
      if(i.lat){
        const idItem = i.idPhoto ? i.idPhoto : i.idVideo;
        const src = i.idPhoto ? i.src320 : i.srcOrig;
        const t = i.idPhoto ? 'p' : 'v';
        markers.push({idItem, lat: i.lat, long: i.long, src, title: i.title, t} as MarkerModel);
      }
    });
    this.updateMarkers(markers);
  }

  updateMarkerFromCurItem(){
    if (this.curItem.lat){
      const idItem = this.curItem.idPhoto ? this.curItem.idPhoto : this.curItem.idVideo;
      const src = this.curItem.idPhoto ? this.curItem.src320 : this.curItem.srcOrig;
      const t = this.curItem.idPhoto ? 'p' : 'v';
      this.updateMarkers([{idItem, lat: this.curItem.lat, long: this.curItem.long, src, title: this.curItem.title, t} as MarkerModel]);
    }
    else{
      this.updateMarkers([]);
    }

  }

  triPriseDeVueAncienRecent(){
    this.curItems.sort((a,b) => {
      const dateA = new Date(a.shootDate), dateB = new Date(b.shootDate);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    });
  }

  triPriseDeVueRecentAncien(){
    this.curItems.sort((a,b) => {
      const dateA = new Date(a.shootDate), dateB = new Date(b.shootDate);
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    });
  }

  triAZ(){
    this.curItems.sort((a,b) => {
      const titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;
      return 0;
    });
  }

  triZA(){
    this.curItems.sort((a,b) => {
      const titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
      if (titleA < titleB) return 1;
      if (titleA > titleB) return -1;
      return 0;
    });
  }

}
