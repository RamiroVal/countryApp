import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'theme-icon',
  imports: [],
  templateUrl: './theme-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeIconComponent implements OnInit {
  isDark = signal(false);

  ngOnInit(): void {
    const saved = localStorage.getItem('theme') || 'silk';
    this.isDark.set(saved === 'halloween');
    document.documentElement.setAttribute('data-theme', saved);
  }

  toggleTheme(): void {
    const newTheme = this.isDark() ? 'silk' : 'halloween';
    this.isDark.set(!this.isDark());
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }
}
