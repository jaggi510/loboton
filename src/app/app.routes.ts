import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./multi-player/multi-player.component').then(c => c.MultiPlayerComponent)
  },
  {
    path: 'match',
    loadComponent: () => import('./multi-player/multi-player.component').then(c => c.MultiPlayerComponent),
  },
  {
    path: 'match/:id',
    loadComponent: () => import('./multi-player/multi-player.component').then(c => c.MultiPlayerComponent),
  },
  {
    path: 'score:id',
    loadComponent: () => import('./match-score/match-score.component').then(c => c.MatchScoreComponent)
  },
  {
    path: 'score',
    loadComponent: () => import('./match-score/match-score.component').then(c => c.MatchScoreComponent)
  }, {
    path: 'score/:id',
    loadComponent: () => import('./match-score/match-score.component').then(c => c.MatchScoreComponent),

  },
  { path: '**', redirectTo: '/match', pathMatch: 'full' },
];
