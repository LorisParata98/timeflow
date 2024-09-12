import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-empty-message',
  templateUrl: './empty-message.component.html',
  styleUrls: ['./empty-message.component.scss'],
})
export class EmptyMessageComponent {
  @Input() title: string | undefined;
  @Input({ required: true }) message!: string;

  constructor() {}
}
