import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { PasswordModule } from 'primeng/password';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        IftaLabelModule,
        MessageModule,
        FluidModule,
        PasswordModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login {
    form!: FormGroup;
    loading$!: Observable<boolean>;
    error$!: Observable<any>;

    constructor(private fb: FormBuilder, private store: Store) { }

    ngOnInit(): void {
        this.buildForm();
        this.storeSetup();
    }


    onSubmit(): void {
        if (this.form.valid) {
            const { email, password } = this.form.value;
            this.store.dispatch(AuthActions.login({ email, password }));
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
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
}
