import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { AuthLoginModel } from '../../../../core/models/auth/auth.login.model';
import { email, form, FormField, minLength, required, debounce } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../../../core/api/auth-api.service';
import { Router } from '@angular/router';

@Component({
  imports: [MatFormField, MatLabel, MatInput, MatError, FormField, FormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
})
export class Login {
  protected readonly authApiService = inject(AuthApiService);
  protected readonly router = inject(Router);
  protected loginFormModel = signal<AuthLoginModel>({
    username: '',
    password: '',
  });
  protected loginForm = form(this.loginFormModel, (schemePath) => {
    debounce(schemePath.username, 500);
    required(schemePath.username, { message: 'Username is required' });
    required(schemePath.password, { message: 'Password is required' });
    minLength(schemePath.password, 4, { message: 'Password must be at least 4 characters long' });
  });

  protected onSubmit() {
    if (this.loginForm().valid()) {
      this.authApiService.login(this.loginFormModel()).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
    }
  }
}
