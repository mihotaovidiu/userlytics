import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { IftaLabelModule } from 'primeng/iftalabel';
import { PasswordModule } from 'primeng/password';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../../store/auth/auth.actions';
import { passwordsMatchValidator } from './validators';
import { selectAuthLoading, selectAuthError } from '../../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    IftaLabelModule,
    PasswordModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  @Output() showLogin = new EventEmitter<void>();
  form!: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;
  loading$!: Observable<boolean>;
  error$!: Observable<any>;

  constructor(private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.buildForm();
    this.storeSetup();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { name, email, password } = this.form.value;
      this.store.dispatch(AuthActions.register({ name, email, password }));
    } else {
      this.form.markAllAsTouched();
    }
  }

  private storeSetup(): void {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }


  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatchValidator });
  }

}
