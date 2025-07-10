import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MENU_ENTRIES } from './data';

import { MenuModule } from 'primeng/menu'
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, MenuModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {
  public data: MenuItem[] = MENU_ENTRIES;
}
