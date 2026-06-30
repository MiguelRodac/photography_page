import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { IAuthService } from '../../../core/interfaces/auth-service.interface';
import { I18nService } from '../../../services/i18n.service';
import { take, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);
  private sub: Subscription | null = null;

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly resetMode = signal(false);
  readonly resetLoading = signal(false);
  readonly resetEmailSent = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
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

  showReset(): void {
    this.errorMessage.set(null);
    this.resetMode.set(true);
    this.resetEmailSent.set(false);
    this.resetForm.reset();
  }

  backToLogin(): void {
    this.resetMode.set(false);
    this.resetEmailSent.set(false);
    this.errorMessage.set(null);
  }

  async onResetSubmit(): Promise<void> {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.resetLoading.set(true);

    const { email } = this.resetForm.value;

    try {
      await this.authService.sendPasswordResetEmail(email!);
      this.resetEmailSent.set(true);
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Failed to send reset email. Please try again.');
    } finally {
      this.resetLoading.set(false);
    }
  }
}
