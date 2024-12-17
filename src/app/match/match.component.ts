import { Component, effect, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Match } from './../multi-player/multi-player.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-match',
  imports: [ReactiveFormsModule, DialogModule],
  templateUrl: './match.component.html',
  styleUrl: './match.component.scss'
})
export class MatchComponent {
  id = input<number>();
  fireStore = inject(Firestore);
  private playerId = 100;
  matchGroup: FormGroup;
  home: UntypedFormGroup;
  visitor: UntypedFormGroup;
  homeTeam = new UntypedFormArray([]);
  visitorTeam = new UntypedFormArray([]);
  addNewTeam = true;
  matchData = output<Match>();
  constructor() {
    this.addPlayer(this.visitorTeam);
    this.addPlayer(this.visitorTeam);
    this.addPlayer(this.visitorTeam);
    this.addPlayer(this.homeTeam);
    this.addPlayer(this.homeTeam);
    this.addPlayer(this.homeTeam);
    this.home = this.buildTeam(1, this.homeTeam);
    this.visitor = this.buildTeam(2, this.visitorTeam);

    this.matchGroup = new UntypedFormGroup({
      home: this.home,
      visitor: this.visitor
    });
    effect(() => {
      const id = this.id() as number;
      if (id > 0) {
        docData(doc(this.fireStore, `match/${id}`)).pipe(take(1)).subscribe(v => {
          if (v) {
            const { home, visitor } = v as Match;
            const homeData = Object.assign({}, { name: home?.name, players: home?.players?.map(p => ({ name: p.name })) });
            const visitorData = Object.assign({}, { name: visitor?.name, players: visitor?.players.map(p => ({ name: p?.name })) });
            this.matchGroup.patchValue({ home: homeData, visitor: visitorData });
          }
        });
      }
    });
  }

  addNewPlayer = (teamArray: FormArray) => {
    this.addPlayer(teamArray);
  }
  removePlayer = (teamArray: FormArray, i: number) => {
    teamArray.removeAt(i);
  }

  newTeam = () => {
    this.matchGroup.reset();
    this.addNewTeam = true;
  }

  arrayControls = (team: FormArray) => {
    return team.controls as Array<FormGroup>;
  }
  private addPlayer = (team: FormArray) => {
    const name = new FormControl<string>('', { validators: [Validators.required] });
    const score = new FormControl<number>({ value: 0, disabled: false });
    const playerId = new FormControl<number>({ value: this.playerId++, disabled: false });
    const scores = new UntypedFormControl({ value: [], disabled: false });

    team.push(new UntypedFormGroup({
      name, score, playerId, scores
    }));
  }

  buildTeam = (teamId = 0, players: FormArray) => {
    return new FormGroup({
      id: new FormControl({ value: teamId, disabled: false }),
      score: new FormControl({ value: 0, disabled: false }),
      name: new FormControl('', { validators: [Validators.required] }),
      scores: new FormControl({ value: [], disabled: false }),
      roundsWon: new FormControl({ value: 0, disabled: false }),
      winning: new FormControl({ value: false, disabled: false }),
      players
    });
  }
  getScores = (t: Array<any>) => {
    return t as Array<any>;
  }
  teamsDone = () => {
    if (this.matchGroup.invalid) {
      this.matchGroup.markAllAsTouched();
      const input = document.querySelector('input.ng-invalid') as HTMLInputElement;
      if (input) {
        input.focus();
      }
      alert('There is errors on the team form. Add team and all players name');
      return;
    }
    this.addNewTeam = false;
    this.matchData.emit(this.matchGroup.value);
  }


}
