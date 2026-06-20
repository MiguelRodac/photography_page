import { firebaseConfig } from './firebase-config';

describe('Firebase Config', () => {
  it('should export a configuration object with all required Firebase keys', () => {
    expect(firebaseConfig).toBeDefined();
    expect(firebaseConfig.apiKey).toBe('FIREBASE_API_KEY');
    expect(firebaseConfig.authDomain).toBe('project-id.firebaseapp.com');
    expect(firebaseConfig.projectId).toBe('project-id');
    expect(firebaseConfig.storageBucket).toBe('project-id.appspot.com');
    expect(firebaseConfig.messagingSenderId).toBe('000000000000');
    expect(firebaseConfig.appId).toBe('1:000000000000:web:0000000000000000000000');
  });

  it('should return the same reference on repeated access (constant export)', () => {
    const first = firebaseConfig;
    const second = firebaseConfig;
    expect(first).toBe(second);
  });
});
