import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  isHovering: boolean;
  message = '';
  fileInfos: Observable<any>;
  selectedAlbum: number;
  defaultSelectedIdAlbum: number;
  files = [];
  totalSize: number;
  totalUploadedSize: number;

  constructor(private apiService: ApiService,private fb: FormBuilder, private route: ActivatedRoute,
    private toast: ToastrService, private catService: CategoryService) {
  }

  uploadFiles() {
    this.message = '';
    if (!this.selectedAlbum){
      this.toast.error('',
        'Sélectionnez un album',
        {timeOut: 3000,});
      return;
    }
    for (let i = 0; i < this.files.length; i++) {
      console.log(this.files[i])
      if (!this.files[i].loaded){
        this.files[i].loading = true;
        this.files[i].uploadProgress = 0;
        this.files[i].uploadedSize = 0;
        this.upload(i, this.files[i]);
      }
    }
  }

  upload(idx, file) {
    if (file.type.includes('video')){
      this.apiService.uploadVideo(file,this.selectedAlbum,file.itemForm.value.title,file.itemForm.value.description).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.files[idx].uploadProgress = Math.round(100 * event.loaded / event.total);
            this.files[idx].uploadedSize = event.loaded;
            this.totalUploadedSize = this.files.reduce( (x, f) => f.uploadedSize + x, 0);
          } else if (event instanceof HttpResponse) {
            // this.fileInfos = this.uploadService.getFiles();
            this.toast.success('Uploaded',
            event.body.originalFileName,
            {timeOut: 2000,});
            this.files[idx].loaded = true;
            // this.files[idx].loading = false;
            console.log(idx);
            console.log('reponse: ');
            console.log(event);
          }
          else{
            console.log(event);
          }
        },
        err => {
          console.log(err);
          this.files[idx].uploadProgress = 0;
          this.files[idx].uploadedSize = 0;
          this.files[idx].loading = false;
          this.totalUploadedSize = this.files.reduce( (x, f) => f.uploadedSize + x, 0);
          this.toast.error(file.name,
          'Could not upload the file',
          {timeOut: 3000,});
        });
    }
    if (file.type.includes('image')){
      this.apiService.uploadPhoto(file,this.selectedAlbum,file.itemForm.value.title,file.itemForm.value.description).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.files[idx].uploadProgress = Math.round(100 * event.loaded / event.total);
            this.files[idx].uploadedSize = event.loaded;
            this.totalUploadedSize = this.files.reduce( (x, f) => f.uploadedSize + x, 0);
          } else if (event instanceof HttpResponse) {
            // this.fileInfos = this.uploadService.getFiles();
            this.toast.success('Uploaded',
            event.body.originalFileName,
            {timeOut: 2000,});
            this.files[idx].loaded = true;
            // this.files[idx].loading = false;
            console.log(idx);
            console.log('reponse: ');
            console.log(event);
          }
          else{
            console.log(event);
          }
        },
        err => {
          console.log(err);
          this.files[idx].uploadProgress = 0;
          this.files[idx].uploadedSize = 0;
          this.files[idx].loading = false;
          this.toast.error(file.name,
          'Could not upload the file',
          {timeOut: 3000,});
        });
    }
  }

  ngOnInit(): void {
    this.catService.displayMap = false;
    this.totalUploadedSize = 0;
    this.totalSize = 0;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = parseInt(params.get('idAlbum'));
      if (id){
        this.defaultSelectedIdAlbum = id;
      }
      else{
        this.defaultSelectedIdAlbum = 0;
      }
    });
  }

  deleteFile(filename){
    this.files.splice(this.files.findIndex( f => f.name === filename),1);
    this.totalSize = this.files.reduce( (x, f) => f.size + x, 0);
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.includes('image')){
        const reader = new FileReader();
        reader.onload = (even) => {
          //TODO : a délocaliser quand visible dans le viewport
          this.files.push(files.item(i));
          this.files[this.files.length - 1].data = even.target.result;
          this.files[this.files.length - 1].loaded = false;
          this.files[this.files.length - 1].loading = false;
          this.files[this.files.length - 1].itemForm = this.fb.group({
            title: files.item(i).name,
            description: ''
            });
        }
        this.totalSize += files[i].size;
        reader.readAsDataURL(files.item(i));
      }
      if (files[i].type.includes('video')){
        this.totalSize += files[i].size;
        this.files.push(files.item(i));
        this.files[this.files.length - 1].loaded = false;
        this.files[this.files.length - 1].loading = false;
        this.files[this.files.length - 1].itemForm = this.fb.group({
          title: files.item(i).name,
          description: ''
          });
      }
    }
  }

  onAddFiles(event){
    if (event.target.files && event.target.files[0]) {
      this.onDrop(event.target.files);
    }
  }

  setSelectedAlbum(idAlbum){
    this.selectedAlbum = idAlbum;
  }

}
