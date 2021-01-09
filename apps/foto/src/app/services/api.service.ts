import { Injectable } from '@angular/core';
import { PhotoModel } from '../models/photo.model';
import { TagModel } from '../models/tag.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { AlbumModel } from '../models/album.model';
import { Observable } from 'rxjs';
import { PeopleModel } from '../models/people.model';
import { CategoryModel } from '../models/category.model';
import { VideoModel } from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  /**
   * Retourne la photo
   * @param id
   */
  getPhoto(id:number){
    return this.http.get<PhotoModel>(`${environment.apiUrl}/photos/${id}`);
  }

  /**
   * Modifie la photo donnée
   * @param photo
   */
  putPhoto(photo: PhotoModel){
    const body = {
      title: photo.title,
      description: photo.description,
      shootDate: photo.shootDate,
      lat: photo.lat,
      long: photo.long
    };
    return this.http.put<PhotoModel>(`${environment.apiUrl}/photos/${photo.idPhoto}`, body);
  }

  /**
   * Modifie la vidéo donnée
   * @param video
   */
  putVideo(video: VideoModel){
    const body = {
      title: video.title,
      description: video.description,
      shootDate: video.shootDate,
      lat: video.lat,
      long: video.long
    };
    return this.http.put<VideoModel>(`${environment.apiUrl}/videos/${video.idVideo}`, body);
  }

  /**
   * Supprime la photo donnée
   * @param photo
   */
  deletePhoto(photo: PhotoModel){
    return this.http.delete<any>(`${environment.apiUrl}/photos/${photo.idPhoto}`);
  }

  /**
   * Supprime la video donnée
   * @param video
   */
  deleteVideo(video: VideoModel){
    return this.http.delete<any>(`${environment.apiUrl}/videos/${video.idVideo}`);
  }

  /**
   * Supprime l'album donnée
   * @param album
   */
  deleteAlbum(album: AlbumModel){
    return this.http.delete<any>(`${environment.apiUrl}/albums/${album.id}`);
  }

  /**
   * Met à jour l'album donnée
   * @param album
   */
  updateAlbum(album: AlbumModel){
    const body = {
      title : album.title,
      description : album.description
    };
    return this.http.put<AlbumModel>(`${environment.apiUrl}/albums/${album.id}`, body);
  }

  /**
   * Change la photo de couverture
   * @param cat
   * @param photo
   * @param category nom de la catégorie (tags/albums/peoples)
   */
  putCover(cat: CategoryModel, photo: PhotoModel, category: string){
    return this.http.put<AlbumModel>(`${environment.apiUrl}/${category}/${cat.id}/cover/${photo.idPhoto}`, null);
  }

  /**
   * Supprime la photo de couverture
   * @param cat
   * @param category nom de la catégorie (tags/albums/peoples)
   */
  putNoCover(cat: CategoryModel, category: string){
    return this.http.put<AlbumModel>(`${environment.apiUrl}/${category}/${cat.id}/cover/0`, null);
  }

  /**
   * Renvoie la liste ddes albums en arbre
   */
  getAlbums(){
    return this.http.get<Array<AlbumModel>>(`${environment.apiUrl}/albums`);
  }

  /**
   * Renvoie la liste des albums avec leur photo de couverture
   */
  getAlbumsCover(){
    return this.http.get<Array<AlbumModel>>(`${environment.apiUrl}/albums/covers`);
  }

  /**
   * Renvoie la liste des albums racines avec la photo de couverture
   */
  getRootsAlbums(){
    return this.http.get<Array<AlbumModel>>(`${environment.apiUrl}/albums/roots`);
  }

  /**
   * Renvoie un album avec la photo de couverture
   * @param id
   */
  getAlbum(id:number){
    return this.http.get<AlbumModel>(`${environment.apiUrl}/albums/${id}`);
  }

  /**
   * Renvoie les albums parents
   * @param id
   */
  getAlbumParents(id:number){
    return this.http.get<any>(`${environment.apiUrl}/albums/${id}/parents-tree`);
  }

  /**
   * Renvoie un album avec la photo de couverture et les photos qu'elle contient
   */
  getAlbumWithPhotos(id:number){
    const url = environment.apiUrl + '/albums/' + id + '/photos';
    return this.http.get<AlbumModel>(url);
  }

  getSSAlbums(id:number){
    const url = environment.apiUrl + '/albums/' + id + '/childrens-tree';
    return this.http.get<any>(url);
  }

  /**
   * Supprime la personne donnée
   * @param people
   */
  deletePeople(people: PeopleModel){
    return this.http.delete<any>(`${environment.apiUrl}/peoples/${people.id}`);
  }

  /**
   * Met à jour la personne donnée
   * @param people
   */
  updatePeople(people: PeopleModel){
    const body = people.birthDay ?  {title : people.title, description: people.description, birthDay: people.birthDay } :
     {title : people.title, description: people.description };
    return this.http.put<AlbumModel>(`${environment.apiUrl}/peoples/${people.id}`, body);
  }

  /**
   * Ajoute une nouvelle personne
   * @param name
   * @param description
   * @param birthDay
   */
  postPeople(name: string, description:string, birthDay?: Date){
    const people = birthDay ?  {title : name, description: description, birthDay: birthDay } : {title : name, description: description };
    return this.http.post<PeopleModel>(environment.apiUrl + '/peoples/', people);
  }

  /**
   * Renvoie les détails d'une personne avec les photos
   * @param idPeople
   */
  getPeopleWithPhotos(idPeople:number){
    const url = environment.apiUrl + '/peoples/' + idPeople + '/photos';
    return this.http.get<PeopleModel>(url);
  }

  /**
   * Renvoie toutes les personnes avec leur photo de profil et les photos?
   */
  getRootsPeoples(){
    return this.http.get<Array<PeopleModel>>(`${environment.apiUrl}/peoples/roots`);
  }

  /**
   * Renvoie toutes les personnes avec leur photo de profil
   */
  getPeoples(){
    return this.http.get<Array<PeopleModel>>(`${environment.apiUrl}/peoples`);
  }

  /**
   * Créer un nouvel album
   * @param title
   * @param description
   * @param idParent
   */
  postAlbum(title:string, description: string, idParent?: number){
    const album = idParent ?  {title : title, description: description,idParent: idParent } : {title : title, description: description };
    return this.http.post<AlbumModel>(environment.apiUrl + '/albums/', album);
  }

  /**
   * Enregistre une personne
   * @param idPhoto
   * @param idPeople
   * @param x
   * @param y
   * @param h
   * @param w
   */
  postFace(idPhoto:number, idPeople:number, x:number,y:number,h:number,w:number){
    const face = {idPhoto : idPhoto,idPeople:idPeople,x:x,y:y,w:w,h:h};
    return this.http.post<any>(environment.apiUrl + '/faces/', face);
  }

  /**
   * Modifie la personne tagée
   * @param idPhoto
   * @param idPeople
   */
  putFace(idFace:number, idPeople:number){
    return this.http.put<any>(environment.apiUrl + '/faces/'+idFace + '/people/' + idPeople, {});
  }

   /**
   * Supprime la personne tagée
   * @param idFAce
   */
  deleteFace(idFace:number){
    return this.http.delete<any>(environment.apiUrl + '/faces/'+idFace);
  }


  /**
   * Upload une photo dans l'album donné avec le titre et la description donné
   * @param file
   * @param idAlbum
   * @param title
   * @param description
   */
  uploadPhoto(file: File, idAlbum: number, title: string, description: string): Observable<HttpEvent<any>>{
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('idAlbum',idAlbum.toString());
    formData.append('title', title);
    formData.append('description', description);

    const req = new HttpRequest('POST', `${environment.apiUrl}/photos/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

   /**
   * Upload une video dans l'album donné avec le titre et la description donné
   * @param file
   * @param idAlbum
   * @param title
   * @param description
   */
  uploadVideo(file: File, idAlbum: number, title: string, description: string): Observable<HttpEvent<any>>{
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('idAlbum',idAlbum.toString());
    formData.append('title', title);
    formData.append('description', description);

    const req = new HttpRequest('POST', `${environment.apiUrl}/videos/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  /**
   * Supprime le tag donnée
   * @param tag
   */
  deleteTag(tag: TagModel){
    return this.http.delete<any>(`${environment.apiUrl}/tags/${tag.id}`);
  }

  /**
   * Met à jour le tag donnée
   * @param tag
   */
  updateTag(tag: TagModel){
    const body = {title : tag.title, description: tag.description};
    return this.http.put<AlbumModel>(`${environment.apiUrl}/tags/${tag.id}`, body);
  }

  /**
   * Ajoute un nouveau tag
   * @param name
   * @param description
   */
  postTag(title: string, description:string){
    const tag = {title : title, description: description} ;
    return this.http.post<TagModel>(environment.apiUrl + '/tags/', tag);
  }

  /**
   * Renvoie les détails d'une personne avec les photos
   * @param idTag
   */
  getTagWithPhotos(idTag:number){
    const url = environment.apiUrl + '/tags/' + idTag + '/photos';
    return this.http.get<TagModel>(url);
  }

  /**
   * Renvoie toutes les tags avec leur photo de profil et les photos?
   */
  getRootsTags(){
    return this.http.get<Array<TagModel>>(`${environment.apiUrl}/tags`);
  }

  /**
   * Renvoie toutes les tags avec leur photo de profil
   */
  getTags(){
    return this.http.get<Array<TagModel>>(`${environment.apiUrl}/tags`);
  }

  /**
   * Rotation gauche
   * @param photo
   */
  rotateLeft(photo: PhotoModel){
    return this.http.put<PhotoModel>(`${environment.apiUrl}/photos/${photo.idPhoto}/rotate-left`, {});
  }

  /**
   * Rotation droite
   * @param photo
   */
  rotateRight(photo: PhotoModel){
    return this.http.put<PhotoModel>(`${environment.apiUrl}/photos/${photo.idPhoto}/rotate-right`, {});
  }

  /**
   * Déplace la photo dans l'album
   * @param idPhoto
   * @param idAlbum
   */
  putMovePhotoToAlbum(idPhoto:number, idAlbum:number){
    return this.http.put<PhotoModel>(`${environment.apiUrl}/photos/${idPhoto}/move-to-album/${idAlbum}`, {});
  }

  /**
   * Copie la photo dans l'album
   * @param idPhoto
   * @param idAlbum
   */
  putCopyPhotoToAlbum(idPhoto:number, idAlbum:number){
    return this.http.put<PhotoModel>(`${environment.apiUrl}/photos/${idPhoto}/copy-to-album/${idAlbum}`, {});
  }

  /**
   * Déplace la video dans l'album
   * @param idVideo
   * @param idAlbum
   */
  putMoveVideoToAlbum(idVideo:number, idAlbum:number){
    return this.http.put<VideoModel>(`${environment.apiUrl}/videos/${idVideo}/move-to-album/${idAlbum}`, {});
  }

  /**
   * Copie la video dans l'album
   * @param idVideo
   * @param idAlbum
   */
  putCopyVideoToAlbum(idVideo:number, idAlbum:number){
    return this.http.put<VideoModel>(`${environment.apiUrl}/videos/${idVideo}/copy-to-album/${idAlbum}`, {});
  }

   /**
   * Renvoie la liste de tous les albums avec la photo de couverture
   */
  getAlbumsTimeItems(idAlbum,limit){
    if (idAlbum === 0){
      return this.http.get<Array<AlbumModel>>(`${environment.apiUrl}/albums/photos-child/${limit}`);
    }
    else{
      return this.http.get<Array<AlbumModel>>(`${environment.apiUrl}/albums/${idAlbum}/photos-child/${limit}`);
    }
  }

  download(id: number, cat: string): any{
    return this.http.get(`${environment.apiUrl}/${cat}/${id}/download`, {responseType: 'blob'});
  }

  downloadItems(id: number, cat: string,idVideos: Array<number>,idPhotos:Array<number>){
    const body = {idVideos, idPhotos};
    return this.http.put(`${environment.apiUrl}/${cat}/${id}/download`, body, {responseType: 'blob'});
  }

  setPhotoTag(idPhoto: number, idTag: number){
    return this.http.put<PhotoModel>(`${environment.apiUrl}/photos/${idPhoto}/tags/${idTag}`, null);
  }

  setVideoTag(idVideo: number, idTag: number){
    return this.http.put<VideoModel>(`${environment.apiUrl}/videos/${idVideo}/tags/${idTag}`, null);
  }

  unsetPhotoTag(idPhoto:number, idTag: number){
    return this.http.delete<PhotoModel>(`${environment.apiUrl}/photos/${idPhoto}/tags/${idTag}`);
  }

  unsetVideoTag(idVideo:number, idTag: number){
    return this.http.delete<VideoModel>(`${environment.apiUrl}/videos/${idVideo}/tags/${idTag}`);
  }

  setVideoPeople(idVideo:number, idPeople: number){
    return this.http.put<VideoModel>(`${environment.apiUrl}/videos/${idVideo}/peoples/${idPeople}`,null);
  }

  unsetVideoPeople(idVideo:number, idPeople: number){
    return this.http.delete<VideoModel>(`${environment.apiUrl}/videos/${idVideo}/peoples/${idPeople}`);
  }

}
