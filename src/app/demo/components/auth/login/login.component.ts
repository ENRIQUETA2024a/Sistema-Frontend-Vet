import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from 'src/app/demo/api/auth';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    username: string = '';
    password!: string;

    constructor(
        public layoutService: LayoutService,
        public authService: AuthService,
        public router: Router
    ) { }

    login() {
        if (!this.username || !this.password) {
            Swal.fire({
                title: 'Campos requeridos',
                text: 'Por favor, ingresa el usuario y la contraseña.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 1600,
            });
            return;
        }

        this.authService.login({ username: this.username, password: this.password })
            .then((res: AuthResponse) => {
                if (res.isSuccess) {
                    localStorage.setItem('token_sigvet', res.token);
                    localStorage.setItem('user_vet', JSON.stringify({
                        'username': res.user.username,
                        'role_id': res.user.role_id
                    }));

                    Swal.fire({
                        title: 'Bienvenido',
                        text: `Hola, ${res.user.username}`,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1600,
                    }).then(() => {
                        // Redirige al dashboard
                        this.router.navigate(['/']);
                    });

                } else {
                    // Manejo de error en caso de fallo en la autenticación
                    Swal.fire({
                        title: 'Login fallido',
                        text: 'Usuario y/o contraseña incorrecta.',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1800,
                    });
                }
            })
            .catch((error) => {
                console.error('Error en la autenticación:', error);
                Swal.fire({
                    title: 'Login fallido',
                    text: 'Usuario y/o contraseña incorrecta.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1800,
                });
            });
    }
}


