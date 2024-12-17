import { AsyncPipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Component, effect, inject, input, model } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Match, Score } from '../multi-player/multi-player.component';
import { Observable, of } from 'rxjs';
import { PlayerNamePipe } from '../pipes/player-name.pipe';

@Component({
  selector: 'app-match-score',
  imports: [KeyValuePipe, AsyncPipe, FormsModule, PlayerNamePipe, TitleCasePipe],
  templateUrl: './match-score.component.html',
  styleUrl: './match-score.component.scss'
})
export class MatchScoreComponent {
  private store = inject(Firestore);
  id = input<number>();
  showAll = model(true);
  data: Observable<Match> = of({} as Match);
  constructor() {
    effect(() => {
      this.data = docData(doc(this.store, `match/${this.id() ?? 10}`)) as Observable<Match>;
    })
  }

  formatScores = (scores: Array<Score>) => scores?.map(v => v.score)?.join(", ")
  teamWins = (scores: Array<Score>) => scores?.filter(v => 10 === v.score).length
}
