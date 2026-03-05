import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'home', 
    loadChildren: () => import('./add-member/add-member.module').then(m => m.AddMemberModule),
    title: 'Home Page' 
  },
  { 
    path: 'fetch-team', 
    loadChildren: () => import('./fetch-team/fetch-team.module').then(m => m.FetchTeamModule),
    title: 'Fetch Team' 
  },
  { 
    path: 'assign-task', 
    loadChildren: () => import('./assign-task/assign-task.module').then(m => m.AssignTaskModule),
    title: 'Assign Task' 
  },
  { 
    path: 'view-task', 
    loadChildren: () => import('./view-task/view-task.module').then(m => m.ViewTaskModule),
    title: 'View Task' 
  },
  { 
    path: 'update-allocation', 
    loadChildren: () => import('./update-allocation/update-allocation.module').then(m => m.UpdateAllocationModule),
    title: 'Update Allocation' 
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route redirects to home
  { path: '**', redirectTo: '/home' }, // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
