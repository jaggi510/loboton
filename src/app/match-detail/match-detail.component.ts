import { Component, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { MatchScoreComponent } from '../match-score/match-score.component';

@Component({
    selector: 'app-match-detail',
    imports: [MatchScoreComponent, DialogModule],
    templateUrl: './match-detail.component.html',
    styleUrl: './match-detail.component.scss'
})
export class MatchDetailComponent {
  showDetails = model<boolean>(false);
}
