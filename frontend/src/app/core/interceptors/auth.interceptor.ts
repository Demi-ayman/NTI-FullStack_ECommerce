import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  let authReq = req;
  if(token){
    authReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    })
  }
  return next(authReq).pipe(
    catchError((error:HttpErrorResponse) =>{
      if(error.status === 401){
        authService.logout();
        router.navigate(['/auth/login'],{
          queryParams:{returnUrl: router.url}
        })
      }
      if(error.status === 403){
        router.navigate(['/shop']);
      }
      return throwError(() => error);
    })
  )
};
