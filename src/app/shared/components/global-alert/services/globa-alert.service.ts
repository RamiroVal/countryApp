import { Injectable, signal } from '@angular/core';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertMessage {
  id: number;
  type: AlertType;
  text: string;
  fading?: boolean;
}

@Injectable({providedIn: 'root'})
export class GlobalAlertService {
  private nextId = 0;
  alerts = signal<AlertMessage[]>([]);

  show(text: string, type: AlertType = 'info') {
    const id = this.nextId++;
    const alert: AlertMessage = { id, type, text };

    this.alerts.update(alerts => [...alerts, alert]);

    setTimeout(() => {
      this.alerts.update(alerts =>
        alerts.map(a => a.id === id ? { ...a, fading: true } : a)
      );
    }, 2500);

    setTimeout(() => {
      this.alerts.update(alerts => alerts.filter(a => a.id !== id));
    }, 3000);
  }
}
