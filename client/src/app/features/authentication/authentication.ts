import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { Logo } from '../../shared/shared-components';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule, ButtonModule, PanelModule, Logo, Login, Register],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss'
})
export class Authentication {
  shouldShowLogin = true;
  shouldShowRegister = false;

  onPresentRegister(): void {
    this.shouldShowLogin = false;
    this.shouldShowRegister = true;
  }

  onPresentLogin(): void {
    this.shouldShowLogin = true;
    this.shouldShowRegister = false;
  }
}
