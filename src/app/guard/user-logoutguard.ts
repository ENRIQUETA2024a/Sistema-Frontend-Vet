import { inject, Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../demo/service/auth.service';

@Injectable({
    providedIn: 'root',
})
class GuardService {
    constructor(private authService: AuthService, private router: Router) {}
    CanActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (!this.authService.isLogued()) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}

export const UserLogoutGuard: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean => {
    return inject(GuardService).CanActivate(next, state);
};
