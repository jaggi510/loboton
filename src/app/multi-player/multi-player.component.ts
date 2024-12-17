import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { Component, effect, HostListener, inject, input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { DragDropModule } from 'primeng/dragdrop';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { MatchComponent } from '../match/match.component';
import { MatchDetailComponent } from '../match-detail/match-detail.component';
import { MatchLineupComponent } from './../match-lineup/match-lineup.component';
import { PlayerNamePipe } from '../pipes/player-name.pipe';

@Component({
  selector: 'app-multi-player',
  imports: [DialogModule, KeyValuePipe, PlayerNamePipe, MatchComponent, MatchLineupComponent, MatchDetailComponent, DragDropModule, TitleCasePipe],
  templateUrl: './multi-player.component.html',
  styleUrl: './multi-player.component.scss'
})
export class MultiPlayerComponent {
  id = input<number>();
  firestore = inject(Firestore);
  teamRoster = false;
  private router = inject(ActivatedRoute);
  undoData: Array<Match> = [];
  data = signal<Match>({} as Match);
  showMatchDetail = signal<boolean>(false);
  @HostListener('window:beforeunload', ['$event'])
  doConfirm(e: any) {
    e.returnValue = `All Match information will be lost!`;
  }
  title = this.router.snapshot.queryParamMap.get('tournament');

  newRoundSelection = () => {
    this.teamRoster = true;
  }

  constructor() {

    effect(() => {
      const dbData = doc(this.firestore, `match/${this.id() ?? 10}`);
      const data = this.data() as any;
      if (null != data && Object.keys(data).length === 2) {
        setDoc(dbData, data);
      }
    });

  }


  buildTeamData = (data: Match) => {
    this.data.set(data);

  }

  readonly MAX_ROUND_POINTS = 10;

  addPoint = (id: number) => {
    this.setUndoData();
    const newData: Match = cloneDeep(this.data());
    if (id === 0) {
      newData.home = this.winnerLogic(newData.home)
      newData.visitor = this.looserLogic(newData.visitor);
    } else {
      newData.visitor = this.winnerLogic(newData.visitor)
      newData.home = this.looserLogic(newData.home);
    }
    const isSetDone = Object.values(newData).map(s => s.score).some(v => v === this.MAX_ROUND_POINTS);
    if (isSetDone) {

      const [home, visitor] = Object.values(newData).map(v => {
        return Object.assign({}, v, {
          scores: [...v.scores, { score: v.score }],
          score: 0,
          roundsWon: v.roundsWon + (v.score / this.MAX_ROUND_POINTS),
          players: [...v.players].sort((a, b) => a.id - b.id).map(p => {
            const totalRoundScores = [...p.scores].reduce((a, c) => a = a + c.score, 0);
            const roundScore = p.score - totalRoundScores;
            const scores = [...p.scores, { score: roundScore }]
            return Object.assign({}, p, { scores });
          })
        })
      });
      newData.home = home;
      newData.visitor = visitor;
      setTimeout(() => {
        const showLineup = confirm(`Match Set ${home.scores.length} is complete. Update lineup?`);
        if (showLineup) {
          this.newRoundSelection();
        }
      }, 10);
    }
    this.data.set(newData);
  };

  private setUndoData = () => {
    if (this.undoData.length === 10) {
      this.undoData.shift();
    }
    this.undoData.push(cloneDeep(this.data()));
  }

  undoLastAction = () => {
    if (this.undoData.length > 0) {

      this.data.set(this.undoData.pop() as Match);
    }


  }

  private winnerLogic = (v: Team) => {
    const score = v.score + 1;
    const players = [...v.players].map((p, index) => {
      if (index === 0) {
        return Object.assign({}, p, { score: (p?.score ?? 0) + 1 })
      }
      return p;
    })
    return Object.assign({}, v, { score, players })
  }

  private looserLogic = (v: Team) => {
    const players = v.players;
    const item = players.splice(0, 1)[0];
    players.splice(2, 0, item);
    return Object.assign({}, v, { players })
  }

  refresh = () => {
    window.location.reload();
  }

  private previousIndex = 0;
  private teamId = 0;
  dragStart = (index: number, teamId: number) => {
    this.previousIndex = index;
    this.teamId = teamId;
  }
  dropEnd = (index: number, teamId: number) => {
    if (this.teamId === teamId) {
      const { home, visitor } = this.data();
      const team = home.id === teamId ? home : visitor;
      const item = team.players.splice(this.previousIndex, 1)[0];
      team.players.splice(index, 0, item);
      this.setUndoData();
      this.data.set({ home, visitor });
    }
  }

  formatScores = (scores: Array<Score>) => scores?.map(v => v.score)?.join(", ")
  teamWins = (scores: Array<Score>) => scores?.filter(v => 10 === v.score).length
}


export interface Team {
  id: number;
  score: number;
  name: string;
  scores: Array<Score>;
  roundsWon: number;
  winning: boolean;
  players: Player[];
}

export interface Player {
  name: string;
  score: number;
  playerId: number;
  scores: Array<Score>;
}
export interface Score {
  score: number;
}

export interface Match {
  home: Team;
  visitor: Team;
}
