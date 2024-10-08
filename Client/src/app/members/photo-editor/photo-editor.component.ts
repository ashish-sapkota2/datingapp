import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { take } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Member } from '../../_models/member';
import { Photo } from '../../_models/photo';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent {
  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropZoneOver =false;
  baseUrl = environment.baseUrl;
  user: User;

constructor(private accountService: AccountService, private memberService: MembersService){
  this.accountService.currentUser$.pipe(take(1)).subscribe(user=> this.user=user)
  this.initializeUploader();
}

fileOverBase(e:any){
  this.hasBaseDropZoneOver=e;
}

setMainPhoto(photo: Photo){
  this.memberService.setMainPhoto(photo.id).subscribe(()=>{
    this.user.Url= photo.url;
    this.accountService.setCurrentUser(this.user);
    this.member.url= photo.url;
    this.member.photos.forEach(p=>{
      if(p.isMain) p.isMain= false;
      if(p.id=== photo.id) p.isMain= true;
    })
  })
}
deletePhoto(photoId:number){
  this.memberService.deletePhoto(photoId).subscribe(()=>{
    this.member.photos= this.member.photos.filter(x=>x.id != photoId);
  })
}

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10*1024*1024,
      method: 'PUT'
    });

    this.uploader.onAfterAddingFile =(file)=>{
      file.withCredentials=false
    }
    this.uploader.onSuccessItem=(item,response,status,headers)=>{
      if(response){
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
        if(photo.isMain){
          this.user.Url= photo.url;
          this.member.url= photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }
}
