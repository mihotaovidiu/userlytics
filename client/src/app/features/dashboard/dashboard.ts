import { Component } from '@angular/core';
import { DASHBOARD_MODULE_DEPS } from './deps';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [...DASHBOARD_MODULE_DEPS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
