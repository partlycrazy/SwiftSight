import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Auth } from 'aws-amplify';
import { mergeMap } from 'rxjs/operators';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.has(InterceptorSkipHeader)) {
      const headers = request.headers.delete(InterceptorSkipHeader);
      return next.handle(request.clone({ headers }));
    }

    if (request.url.indexOf('/api') > 0) {

      return this.getToken().pipe(
        mergeMap((token) => {
          request = request.clone(
            {
              setHeaders: { Authorization: `Bearer ${token}` }
            });

          return next.handle(request);
        })
      );
    }
  }

  getToken() {
    return from(
      new Promise((resolve, reject) => {
        Auth.currentSession().then((session) => {
          if (!session.isValid()) {
            resolve(null);
          } else {
            resolve(session.getIdToken().getJwtToken());
          }
        })
        .catch(err=>{ return resolve(null) });
      })
    );
  }
}