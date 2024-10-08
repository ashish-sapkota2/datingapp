import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { formatMoment } from 'ngx-bootstrap/chronos/format';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../../_models/message';
import { MembersService } from '../../_services/members.service';
import { MessageService } from '../../_services/message.service';

@Component({
  changeDetection:ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeagoModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm: NgForm
  @Input() messages: Message[];
  @Input() username: string
  messageContent: string

  constructor(public messageService: MessageService){

  }

  sendMessage(){
    this.messageService.sendMessage(this.username, this.messageContent).then(
      // message=>
      ()=>
      {
      // this.messages.push(message);
      this.messageForm.reset();
    })
  }



}
