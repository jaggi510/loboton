import { Component, effect, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { Match } from '../multi-player/multi-player.component';

@Component({
    selector: 'app-match-lineup',
    imports: [DialogModule, KeyValuePipe, FormsModule],
    templateUrl: './match-lineup.component.html',
    styleUrl: './match-lineup.component.scss'
})
export class MatchLineupComponent {
  teamRoster = model.required<boolean>();
  data = model.required<Match>();

  values: Array<Array<number>> = [[0, 0, 0], [0, 0, 0]];

  constructor() {
    effect(() => {
      const data = this.data();
      data?.home?.players?.forEach((p, index) => {
        if (index < 3) {
          this.values[0][index] = p.playerId;
        }
      });
      data?.visitor?.players?.forEach((p, index) => {
        if (index < 3) {
          this.values[1][index] = p.playerId;
        }
      });
    })

  }
  shufflePlayer = (index: number, event: any, position: number) => {
    const data = this.data();
    const players = index === 0 ? data.home.players : data.visitor.players;
    const teampos = players.findIndex(e => e.playerId === +event.target.value);
    if (position !== teampos) {
      const item = players.splice(teampos, 1)[0];
      players.splice(position, 0, item);
    }
    this.data.set(data);
  }


}
