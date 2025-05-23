import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundComponent implements OnInit, OnDestroy {
  private readonly titleService = inject(Title);
  private readonly location = inject(Location);

  goBack = (): void => this.location.back();
  ngOnInit(): void { this.titleService.setTitle('404') }
  ngOnDestroy(): void { this.titleService.setTitle('CountryApp') }
}
