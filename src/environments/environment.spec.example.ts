import { environment } from './environment.example';
import { environment as environmentProd } from './environment.prod.example';

describe('Environment Configuration', () => {
  describe('development environment', () => {
    it('should have firebase config with all required keys', () => {
      expect(environment.firebase).toBeDefined();
      expect(environment.firebase.apiKey).toBe('FIREBASE_API_KEY');
      expect(environment.firebase.authDomain).toBe('project-id.firebaseapp.com');
      expect(environment.firebase.projectId).toBe('project-id');
      expect(environment.firebase.storageBucket).toBe('project-id.appspot.com');
      expect(environment.firebase.messagingSenderId).toBeDefined();
      expect(environment.firebase.appId).toBeDefined();
    });

    it('should have emailJs config with all required keys', () => {
      expect(environment.emailJs).toBeDefined();
      expect(environment.emailJs.publicKey).toBe('EMAILJS_PUBLIC_KEY');
      expect(environment.emailJs.serviceId).toBe('EMAILJS_SERVICE_ID');
      expect(environment.emailJs.templateId).toBe('EMAILJS_TEMPLATE_ID');
    });

    it('should not be marked as production', () => {
      expect(environment.production).toBeFalse();
    });
  });

  describe('production environment', () => {
    it('should have firebase config with all required keys', () => {
      expect(environmentProd.firebase).toBeDefined();
      expect(environmentProd.firebase.apiKey).toBeDefined();
      expect(environmentProd.firebase.authDomain).toBeDefined();
      expect(environmentProd.firebase.projectId).toBeDefined();
      expect(environmentProd.firebase.storageBucket).toBeDefined();
      expect(environmentProd.firebase.messagingSenderId).toBeDefined();
      expect(environmentProd.firebase.appId).toBeDefined();
    });

    it('should have emailJs config with all required keys', () => {
      expect(environmentProd.emailJs).toBeDefined();
      expect(environmentProd.emailJs.publicKey).toBeDefined();
      expect(environmentProd.emailJs.serviceId).toBeDefined();
      expect(environmentProd.emailJs.templateId).toBeDefined();
    });

    it('should be marked as production', () => {
      expect(environmentProd.production).toBeTrue();
    });
  });
});
