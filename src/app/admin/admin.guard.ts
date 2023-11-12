import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {

  constructor(private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('userName') != null)
      return true;
    else {
      // this.router.navigate(['']);

      this.router.navigate(['/user/login']);
      return false;
    }
  }
  canLoad(route: Route): boolean {
    let url: string = route.path;
    console.log('Url:' + url);
    let myrights = JSON.parse(localStorage.getItem('rights'));
    if (myrights == "SUPERADMIN" || myrights == "ADMIN" ) {
      return true;
    } else if (myrights == "USER"){
      return false;
    }
    // if (url == 'customer') {
    //   alert('');
    //   return false;
    // }
    alert('You are not authorised to visit this page');
    return false;
  }

}
