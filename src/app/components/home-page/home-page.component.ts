import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {combineLatest, interval, startWith, Subject} from 'rxjs';
import {TimerService} from '../../timer.service';
import {FormControl} from '@angular/forms';
import {IWindowTimerTypes} from '../../timer.types';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

	showPreview: boolean = false;
	timeSec: FormControl = new FormControl(0);
	timeMin: FormControl = new FormControl(0);
	timeHour: FormControl = new FormControl(0);
	timeFrequency: FormControl = new FormControl(1000);
	@ViewChild('previewFrame', {static: false}) previewFrame: ElementRef<IWindowTimerTypes> | undefined;

	changeTimerWindow$: Subject<void> = new Subject<void>();

	constructor(
		private timerService: TimerService
	) {
	}

	private _timerWindow: IWindowTimerTypes | null | undefined = null;

	get timerWindow(): IWindowTimerTypes | null | undefined {
		return this._timerWindow ? this._timerWindow : this.previewFrame?.nativeElement['contentWindow' as any];
	}

	set timerWindow(openedWindow: IWindowTimerTypes | null | undefined) {
		this._timerWindow = openedWindow;
	}

	get isStarted() {
		return this.timerWindow && this.timerService.state === 'started';
	}

	get isPaused() {
		return this.timerWindow && this.timerService.state === 'pause';
	}

	setSeconds(sec: number) {
		this.timerService.seconds = sec;
		if (this.timerWindow) {
			this.timerWindow.startSeconds = sec;
		}
	}

	ngOnInit(): void {
		combineLatest([
			this.timeSec.valueChanges.pipe(startWith(0)),
			this.timeMin.valueChanges.pipe(startWith(0)),
			this.timeHour.valueChanges.pipe(startWith(0)),
			this.changeTimerWindow$])
			.subscribe(([sec, min, hours]: [number, number, number, void]) => {
				const resultSeconds = Number(this.timerService.hoursToSeconds(hours) + this.timerService.minToSeconds(min) + sec);
				this.setSeconds(resultSeconds);
			});
	}

	initWindowConfig() {
		if (!this.timerWindow) {
			return;
		}
		this.timerWindow.startSeconds = this.timerService.seconds;
		this.timerWindow.timeFrequency = this.timeFrequency.value;
	}

	onStartTimer() {
		this.timerService.init();

		if (this.timerWindow) {
			this.timerWindow.dispatchEvent(new Event('timer-start'));
			this.initWindowConfig();
			this.changeTimerWindow$.next();
			return;
		}
		this.timerWindow = window.open('/timer', 'timer', 'width=700,height=300');
		this.initWindowConfig();

		let checkWinOpenSubs$ = interval(500).subscribe(() => {
			if (!this.timerWindow?.closed) {
				return;
			}
			this.timerWindow = null;
			this.timerService.reset();
			checkWinOpenSubs$.unsubscribe();
		});
		this.changeTimerWindow$.next();
	}

	onPauseTimer() {
		this.timerService.pause();
		this.timerWindow?.dispatchEvent(new Event('timer-pause'));
		this.changeTimerWindow$.next();
	}

	onResetTimer() {
		this.timerService.reset();
		this.timerWindow?.dispatchEvent(new Event('timer-reset'));
		this.changeTimerWindow$.next();
	}

	onCloseWindow() {
		this.timerService.reset();
		this.timerWindow?.close();
		this.changeTimerWindow$.next();
	}

	onShowPreview() {
		this.showPreview = !this.showPreview;
	}

	onLoadPreview() {
		this.onStartTimer();
		this.onResetTimer();
	}

  onChangePosition(direction: 'left' | 'right' | 'up' | 'down'): void {
    let x: number = this.timerWindow?.screenX || 0;
    let y: number = this.timerWindow?.screenY || 0;
    switch(direction) {
      case 'up': y -= 100; break;

      case 'down': y += 100; break;

      case 'left': x -= 100; break;

      case 'right': x += 100; break;

    }

    this.timerWindow?.moveTo(x, y);
    console.log('move to ', x, y);

  }
  onResetPosition(): void {
    this.timerWindow?.moveTo(0,0);
  }

  onChangeSize(type: 'increase' | 'decrease'): void {
      const event = new CustomEvent('change-fort-size', {detail: {type}});
      this.timerWindow?.dispatchEvent(event)
  }
}
