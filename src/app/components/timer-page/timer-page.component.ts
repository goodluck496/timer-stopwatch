import {Component, OnDestroy, OnInit} from '@angular/core';
import {TimerService} from '../../timer.service';
import {debounceTime, fromEvent} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-timer-page',
	templateUrl: './timer-page.component.html',
	styleUrls: ['./timer-page.component.scss'],
})
export class TimerPageComponent implements OnInit, OnDestroy {

	fontSize: number = this.getResponsiveFontSize();

	constructor(private timerService: TimerService, private route: ActivatedRoute) {
	}

	get time() {
		return this.timerService.seconds;
	}

	getResponsiveFontSize(): number {

		let width = Number(this.route.snapshot.queryParamMap.get('width'));
		if (!isNaN(width) && !width) {
			width = window.outerWidth;
		}
		let height = Number(this.route.snapshot.queryParamMap.get('height'));
		if (!isNaN(height) && !height) {
			height = window.outerHeight;
		}

		const result = (width - height) / 2.5;

		return result > width ? result / 2.5 : result;
	}

	ngOnInit(): void {
		this.timerService.init();

		this.initSubs();
	}

	ngOnDestroy() {

	}

	initSubs() {

		fromEvent(window, 'resize').pipe(debounceTime(50)).subscribe(() => {
			this.fontSize = this.getResponsiveFontSize();
		});

    fromEvent(window, 'change-fort-size').subscribe((event: Event) => {
      const customEvent = event as CustomEvent
      const type: 'increase' | 'decrease' = customEvent.detail.type;
      if(type === 'increase') {
        this.fontSize += 10;
      }

      if(type === 'decrease') {
        this.fontSize -= 10;
      }
    });

		fromEvent(window, 'timer-start').subscribe(() => {
			if (this.timerService.state === 'stopped') {
				this.timerService.init();
			} else if (this.timerService.state === 'pause') {
				this.timerService.start();
			}
		});

		fromEvent(window, 'timer-reset').subscribe(() => {
			this.timerService.reset();
		});

		fromEvent(window, 'timer-pause').subscribe(() => {
			this.timerService.pause();
		});
	}
}
