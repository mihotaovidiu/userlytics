import { inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, Observable, throwError } from 'rxjs';
import * as AuthActions from '../../store/auth/auth.actions';

export function errorInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const store = inject(Store);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        store.dispatch(AuthActions.logout());
      }
      return throwError(() => error);
    })
  );
}
