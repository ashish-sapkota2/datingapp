import { CommonModule } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, Directive, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TimeagoFormatter, TimeagoModule } from "ngx-timeago";
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { take } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, TabsModule, NgxGalleryModule,
    TimeagoModule, MemberMessagesComponent, FormsModule],
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;
  members:Member[]=[];
  match:{[key:number]:boolean}={};

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data['member'];
    })
    setTimeout(() => {

      this.route.queryParams.subscribe(params => {
        params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
      })
    }, 50)

    this.galleryOptions = [
      {
        height: '500px',
        width: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true
      }
    ]
    this.galleryImages = this.getImages();
  }

  

  constructor(public presence: PresenceService,
    private route: ActivatedRoute, private messageService: MessageService,
    private accountService: AccountService,private router : Router,
    private memberService:MembersService,private toastr:ToastrService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(user=>this.user=user);
      this.getMatches();
  }


  addLike(member: Member){
    this.memberService.addLike(member.username).subscribe(()=>{
      this.toastr.success('You have liked ' + member.knownAs);
      
    })
  }
  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  // loadMember(){
  //    let username = this.route.snapshot.paramMap.get('username');
  //   if(username){
  //     this.memberService.getMember(username).subscribe(members=>{
  //       this.member= members;
  //     })
  //   }else{
  //     console.log("loaded member", this.member)
  //   }
  // }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    const photos = this.member?.photos;
    if (photos) {
      for (const photo of photos) {
        imageUrls.push({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url,
        })
      }
    }
    return imageUrls

  }
  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }




  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      // this.loadMessages()
        this.messageService.createHubConnection(this.user,this.member.username);
      }else{
        this.messageService.stopHubConnection();
    }
  }
  getMatches(){
    this.memberService.getMatches().subscribe(response=>{
    this.members= response;
    this.members.forEach(element => {
      console.log("Member Id:", element.id)
      this.CheckifMatch(element.id)
    });
    })   
  }

  CheckifMatch(id:number){
    const matchid =this.members.some(member=>member.id===id);
    console.log(matchid)
    if(matchid){

      this.match[id]=matchid;
    }else{
      this.match[id]=false;
    }
    
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
  // this.route.paramMap.subscribe(params => {
  //   const username = params.get('username');
  //   if (username) {
  //     this.memberService.getMember(username).subscribe(member => {
  //       this.member = member;
  //       console.log("Loaded member:", this.member);
  //     });
  //   }
  // });

