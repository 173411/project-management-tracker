import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { ITeamMember } from '../../models/project-management-tracker.model';

@Component({
  selector: 'app-view-task',
  standalone: false,
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})
export class ViewTaskComponent implements OnInit {
  memberID: string = '';
  viewTaskClicked = false;
  memberFound = false;
  taskFound = false;
  memberDetails: ITeamMember | null = null;
  
  /** subject used to tear down any subscriptions */
  private destroy$ = new Subject<void>();
 
  constructor(private _memberService: SharedService) { }

  ngOnInit() {
    console.log('View Task for Member ID:', this.memberID);
  }

  viewTask(): void {
    console.log('Viewing task for Member ID:', this.memberID);
    this.viewTaskClicked = true;
    // Logic to fetch and display the task details for the given memberID can be implemented here
    this._memberService.getMemberByID(this.memberID).subscribe({
      next: memberDetails => {
        console.log('Member found:', memberDetails);
        this.memberFound = true;
        this.memberDetails = memberDetails;
        if (memberDetails && memberDetails.task) {
          this.taskFound = true;
        }
      },
      error: err => {
        console.error('Error fetching memberDetails:', err);
        this.memberFound = false;
      }
    });
  }

}
