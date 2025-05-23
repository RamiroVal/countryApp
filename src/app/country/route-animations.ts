import { trigger, transition, query, style, animate, group } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),

    group([
      query(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease', style({ opacity: 0 }))
      ], { optional: true }),

      query(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 }))
      ], { optional: true }),
    ])
  ])
]);
