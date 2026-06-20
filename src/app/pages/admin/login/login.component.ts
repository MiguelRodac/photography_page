import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { IAuthService } from '../../../core/interfaces/auth-service.interface';
import { take, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);
  private sub: Subscription | null = null;

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.sub = this.authService.authState$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.router.navigate(['/admin-page']);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);
      this.router.navigate(['/admin-page']);
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Login failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
