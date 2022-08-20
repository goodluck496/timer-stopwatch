import {Injectable} from '@angular/core';
import {interval, Subject, takeUntil} from 'rxjs';
import {IWindowTimerTypes} from './timer.types';

@Injectable({
	providedIn: 'root'
})
export class TimerService {

	/**
	 * Количество прошедших секунд от старта
	 */
	seconds: number = 0;

	state: 'started' | 'pause' | 'stopped' = 'stopped';
	private reset$: Subject<void> = new Subject();

	constructor() {
	}

	get windowFrequency(): number {
		return (window as IWindowTimerTypes)?.timeFrequency || 1000;
	}

	hoursToSeconds(sec: number): number {
		return sec * 3600;
	}

	minToSeconds(min: number): number {
		return min * 60;
	}

	getHumanHours(sec: number = this.seconds): number {
		return Math.floor(sec / 3600) % 24;
	}

	getHumanMinutes(sec: number = this.seconds): number {
		return Math.floor(sec / 60) % 60;
	}

	getHumanSeconds(sec: number = this.seconds): number {
		return Math.floor(sec % 60);
	}

	start() {
		this.state = 'started';
		return this;
	}

	pause() {
		this.state = 'pause';

		return this;
	}

	reset() {
		this.state = 'stopped';
		this.reset$.next();
		this.seconds = 0;
		return this;
	}

	init() {
		this.loadConfigFromWindow();
		this.start();
		interval(this.windowFrequency).pipe(takeUntil(this.reset$)).subscribe(() => {
			if (this.state === 'pause') {
				return;
			}
			this.seconds += 1;
		});

		return this;
	}

	loadConfigFromWindow() {
		const WINDOW: IWindowTimerTypes = window as IWindowTimerTypes;

		if (WINDOW.startSeconds) {
			this.seconds = WINDOW.startSeconds;
		}
	}
}
