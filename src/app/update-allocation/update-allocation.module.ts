import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UpdateAllocationComponent } from './components/update-allocation.component';

const routes: Routes = [
  { path: '', component: UpdateAllocationComponent }
];

@NgModule({
  declarations: [UpdateAllocationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class UpdateAllocationModule { }
