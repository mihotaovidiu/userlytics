import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-user-box',
  imports: [CommonModule, AvatarModule, FluidModule, ButtonModule],
  templateUrl: './user-box.html',
  styleUrl: './user-box.scss'
})
export class UserBox {
  private store = inject(Store);
  user$ = this.store.select(selectAuthUser);

  logout(): void {
    this.store.dispatch(logout());
  }
}
