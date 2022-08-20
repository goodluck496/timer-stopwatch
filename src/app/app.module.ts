import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {TimerPageComponent} from './components/timer-page/timer-page.component';
import {CommonModule} from '@angular/common';
import {HomePageComponent} from './components/home-page/home-page.component';
import {TimeFormatPipe} from './pipes/time-format.pipe';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCommonModule} from '@angular/material/core';
import {MomentPipe} from './pipes/moment.pipe';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCommonModule,
  MatToolbarModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TimerPageComponent,
    TimeFormatPipe,
    MomentPipe
  ],
  imports: [
    ...MATERIAL_MODULES,
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomePageComponent},
      {path: 'timer', component: TimerPageComponent}
    ]),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
