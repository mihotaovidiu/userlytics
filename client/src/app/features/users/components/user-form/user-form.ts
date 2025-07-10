import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FluidModule } from 'primeng/fluid';
import { MessageModule } from 'primeng/message';
import { Divider } from "primeng/divider";
import { filter, pairwise, startWith, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as UsersActions from '../../../../store/users/users.actions';
import { selectUsersLoading } from '../../../../store/users/users.selectors';
import { User } from '../../../../shared/shared-types';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    IftaLabelModule,
    FluidModule,
    MessageModule,
    Divider
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserForm implements OnInit, OnChanges {
  @Input() user?: User;
  @Output() submitForm = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading$!: Observable<boolean>;
  roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' }
  ];
  private originalUser?: User;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.initForm();
    this.initLoading();
    this.initPatchUser();
    this.initAutoCloseOnLoading();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleUserChanges(changes);
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emit a value to complete the observable
    this.destroy$.complete(); // Complete the subject to avoid memory leaks       
  }

  public onSubmit(): void {
    if (this.form.valid && this.originalUser) {
      const { name, role } = this.form.getRawValue();
      this.store.dispatch(UsersActions.updateUserAndRole({ userId: this.originalUser.id, name, role }));
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
    this.form.get('email')?.disable();
  }

  private initLoading(): void {
    this.loading$ = this.store.select(selectUsersLoading);
  }

  private initPatchUser(): void {
    if (this.user) {
      this.form.patchValue(this.user);
      this.originalUser = { ...this.user };
    }
  }

  private initAutoCloseOnLoading(): void {
    this.loading$
      .pipe(
        takeUntil(this.destroy$),
        startWith(false),
        pairwise(),
        filter(([prev, curr]) => prev === true && curr === false)
      )
      .subscribe(() => this.onCancel());
  }

  private handleUserChanges(changes: SimpleChanges): void {
    if (!this.form) return;
    if (changes['user'] && this.user) {
      this.form.patchValue(this.user);
      this.originalUser = { ...this.user };
    } else if (changes['user'] && !this.user) {
      this.form.reset();
      this.originalUser = undefined;
    }
  }
}
