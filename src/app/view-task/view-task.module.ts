import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewTaskComponent } from './components/view-task.component';

const routes: Routes = [
  { path: '', component: ViewTaskComponent }
];

@NgModule({
  declarations: [ViewTaskComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class ViewTaskModule { }
