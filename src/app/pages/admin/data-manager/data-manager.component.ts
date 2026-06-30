import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { ToastService } from '../../../services/toast.service';
import { I18nService } from '../../../services/i18n.service';

interface ExportData {
  content: Record<string, any>;
  portfolio: any[];
  categories: any[];
  navigation: any[];
  exportedAt: string;
}

interface ImportPreview {
  content: number;
  portfolio: number;
  categories: number;
  navigation: number;
}

@Component({
  selector: 'app-data-manager',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './data-manager.component.html',
})
export class DataManagerComponent {
  private readonly firestore = inject(Firestore);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(I18nService);

  readonly exporting = signal(false);
  readonly importing = signal(false);
  readonly importProgress = signal(0);
  readonly importPreview = signal<ImportPreview | null>(null);
  readonly parsedData = signal<ExportData | null>(null);
  readonly showConfirmDialog = signal(false);
  readonly fileName = signal('');

  // ─── Export ───────────────────────────────────────────────

  async exportAllData(): Promise<void> {
    this.exporting.set(true);
    try {
      const data: ExportData = {
        content: await this.exportCollection('content'),
        portfolio: await this.exportCollectionAsArray('portfolio'),
        categories: await this.exportCollectionAsArray('categories'),
        navigation: await this.exportCollectionAsArray('navigation'),
        exportedAt: new Date().toISOString(),
      };

      const json = JSON.stringify(data, null, 2);
      this.downloadFile(json, `firestore-backup-${this.dateStamp()}.json`);
      this.toast.success('Data exported successfully');
    } catch (err: any) {
      this.toast.error('Export failed: ' + (err?.message || 'Unknown error'));
    } finally {
      this.exporting.set(false);
    }
  }

  private async exportCollection(colName: string): Promise<Record<string, any>> {
    const colRef = collection(this.firestore, colName);
    const snapshot = await getDocs(colRef);
    const result: Record<string, any> = {};
    snapshot.forEach((d) => {
      result[d.id] = this.serializeDoc(d.data());
    });
    return result;
  }

  private async exportCollectionAsArray(colName: string): Promise<any[]> {
    const colRef = collection(this.firestore, colName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...this.serializeDoc(d.data()) }));
  }

  private serializeDoc(data: any): any {
    if (data == null) return data;
    return JSON.parse(
      JSON.stringify(data, (_key, value) => {
        if (value instanceof Date) return value.toISOString();
        if (typeof value === 'bigint') return value.toString();
        return value;
      }),
    );
  }

  // ─── Import ───────────────────────────────────────────────

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      this.toast.error('Only .json files are accepted');
      input.value = '';
      return;
    }

    this.fileName.set(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!this.validateStructure(parsed)) {
          this.toast.error('Invalid file structure. Use the template as reference.');
          this.importPreview.set(null);
          this.parsedData.set(null);
          return;
        }
        this.parsedData.set(parsed);
        this.importPreview.set({
          content: Object.keys(parsed.content || {}).length,
          portfolio: (parsed.portfolio || []).length,
          categories: (parsed.categories || []).length,
          navigation: (parsed.navigation || []).length,
        });
      } catch {
        this.toast.error('Could not parse JSON file');
        this.importPreview.set(null);
        this.parsedData.set(null);
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  private validateStructure(data: any): data is ExportData {
    if (!data || typeof data !== 'object') return false;
    if (!data.content || typeof data.content !== 'object' || Array.isArray(data.content)) return false;
    if (!Array.isArray(data.portfolio)) return false;
    if (!Array.isArray(data.categories)) return false;
    if (!Array.isArray(data.navigation)) return false;
    return true;
  }

  openConfirmDialog(): void {
    if (!this.parsedData()) return;
    this.showConfirmDialog.set(true);
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog.set(false);
  }

  async confirmImport(): Promise<void> {
    const data = this.parsedData();
    if (!data) return;

    this.showConfirmDialog.set(false);
    this.importing.set(true);
    this.importProgress.set(0);

    try {
      const totalSteps =
        Object.keys(data.content).length +
        data.portfolio.length +
        data.categories.length +
        data.navigation.length;

      let completed = 0;
      const updateProgress = () => {
        completed++;
        this.importProgress.set(Math.round((completed / totalSteps) * 100));
      };

      // Import content collection (documents keyed by ID)
      for (const [docId, docData] of Object.entries(data.content)) {
        const ref = doc(this.firestore, `content/${docId}`);
        await setDoc(ref, docData, { merge: true });
        updateProgress();
      }

      // Import portfolio
      for (const item of data.portfolio) {
        const { id, ...rest } = item;
        const ref = doc(this.firestore, `portfolio/${id}`);
        await setDoc(ref, rest, { merge: true });
        updateProgress();
      }

      // Import categories
      for (const item of data.categories) {
        const { id, ...rest } = item;
        const ref = doc(this.firestore, `categories/${id}`);
        await setDoc(ref, rest, { merge: true });
        updateProgress();
      }

      // Import navigation
      for (const item of data.navigation) {
        const { id, ...rest } = item;
        const ref = doc(this.firestore, `navigation/${id}`);
        await setDoc(ref, rest, { merge: true });
        updateProgress();
      }

      this.toast.success('Data imported successfully');
      this.clearImportState();
    } catch (err: any) {
      this.toast.error('Import failed: ' + (err?.message || 'Unknown error'));
    } finally {
      this.importing.set(false);
      this.importProgress.set(0);
    }
  }

  clearImport(): void {
    this.clearImportState();
  }

  private clearImportState(): void {
    this.parsedData.set(null);
    this.importPreview.set(null);
    this.fileName.set('');
  }

  // ─── Template ─────────────────────────────────────────────

  downloadTemplate(): void {
    const template: ExportData = {
      content: {
        hero: { title: 'Your Hero Title', subtitle: 'Subtitle here', cta: 'CTA Button' },
        about: { title: 'About Title', description: 'About description' },
        contact: { email: 'hello@example.com', phone: '+1234567890' },
        header: { siteName: 'My Site', logoUrl: '' },
        footer: { copyrightText: '© 2025 My Site' },
      },
      portfolio: [
        {
          id: 'project-1',
          title: 'Project Name',
          description: 'Project description',
          category: 'wedding',
          img: 'https://example.com/image.jpg',
        },
      ],
      categories: [{ id: 'cat-1', name: 'Category Name', slug: 'category-slug', order: 1 }],
      navigation: [
        { id: 'nav-1', label: 'Home', path: '/', order: 1, visible: true },
      ],
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(template, null, 2);
    this.downloadFile(json, 'firestore-template.json');
    this.toast.success('Template downloaded');
  }

  // ─── Helpers ──────────────────────────────────────────────

  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private dateStamp(): string {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  }
}
