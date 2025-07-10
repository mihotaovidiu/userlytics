import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-logo',
  imports: [CommonModule, AvatarModule],
  templateUrl: './logo.html',
  styleUrl: './logo.scss'
})
export class Logo {
  @Input() inverted = true // If true, logo will be displayed in inverted colors
  @Input() size: 'normal' | 'large' | 'xlarge' = 'large'
}
