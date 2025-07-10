import {
    HttpInterceptorFn
} from '@angular/common/http';


export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const apiBaseUrl = 'https://userlytics-production.up.railway.app/api';
    if (req.url.startsWith('http')) {
        return next(req);
    }

    const apiReq = req.clone({
        url: `${apiBaseUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
    });

    return next(apiReq);
};
