import {Pipe, PipeTransform} from '@angular/core';
import {TimerService} from '../timer.service';

@Pipe({
	name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

	constructor(private timerService: TimerService) {
	}

	transform(value: number | null): string {
		if (!value) {
			return '00:00:00';
		}
		const hours = this.timerService.getHumanHours(value);
		const minutes = this.timerService.getHumanMinutes(value);
		const seconds = this.timerService.getHumanSeconds(value);
		const result = [
			hours < 10 ? `0${hours}` : hours,
			minutes < 10 ? `0${minutes}` : minutes,
			seconds < 10 ? `0${seconds}` : seconds
		];

		return result.join(':');
	}

}
