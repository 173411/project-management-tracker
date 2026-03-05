import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FetchTeamComponent } from './components/fetch-team.component';

const routes: Routes = [
  { path: '', component: FetchTeamComponent }
];

@NgModule({
  declarations: [FetchTeamComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class FetchTeamModule { }
