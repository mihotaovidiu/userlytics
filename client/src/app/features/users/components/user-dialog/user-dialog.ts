import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { UserForm } from "../user-form/user-form";
import { User } from '../../../../shared/shared-types';

@Component({
  selector: 'app-user-dialog',
  imports: [CommonModule, DialogModule, UserForm],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
})
export class UserDialog {
  @Input() user?: User;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
