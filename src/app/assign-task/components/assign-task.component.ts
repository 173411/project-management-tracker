import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ITask, ITeamMember } from '../../models/project-management-tracker.model';
import { Subject, takeUntil } from 'rxjs';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { CustomValidationService } from '../../services/custom-validation.service';

@Component({
  selector: 'app-assign-task',
  standalone: false,
  templateUrl: './assign-task.component.html',
  styleUrl: './assign-task.component.css'
})
export class AssignTaskComponent implements OnInit, OnDestroy {
  /** subject used to tear down any subscriptions */
  private destroy$ = new Subject<void>();
  teamMembers: ITeamMember[] = [];
  assignTaskForm: any; // This will be initialized with a FormGroup in a real implementation
  taskAssignedSuccessfully:boolean = false;
  taskAssignmentFailed:boolean = false;
  invalidTaskEndDate: boolean = false;
  projectEndDate: any;

  constructor(private _sharedService: SharedService, private _formBuilder: UntypedFormBuilder, private _customValidationService: CustomValidationService) { }

  populateData(): void {
    // This method can be used to perform any additional data processing if needed
    console.log('Data population complete. Team members:', this.teamMembers);

    // Initialize the form with team members for assignment
    this.assignTaskForm = this._formBuilder.group({
      memberID: [null, Validators.required],
      taskName: ['', Validators.required],
      deliverables: [null, Validators.required],
      taskStartDate: [null, Validators.required],
      taskEndDate: [null, Validators.required]
    }, {
      // Custom validator to ensure project end date is after start date
      validators: this._customValidationService.projectDateValidator('taskStartDate', 'taskEndDate')
    });
  }

  validateTaskEndDate(memberID: string, taskEndDate: any): Promise<boolean> {    
    return new Promise((resolve) => {
      this._sharedService.getMemberByID(memberID).pipe(takeUntil(this.destroy$)).subscribe({
        next: member => {
          if (member && member.projectEndDate) {
            const projectEndDate = new Date(member.projectEndDate.year, member.projectEndDate.month - 1, member.projectEndDate.day);           
            const newTaskEndDate = new Date(taskEndDate.year, taskEndDate.month - 1, taskEndDate.day);   
          if (newTaskEndDate > projectEndDate) {
            this.invalidTaskEndDate = true;
            this.taskAssignmentFailed = true;
            this.taskAssignedSuccessfully = false;
            this.projectEndDate = projectEndDate; // Store project end date for potential use in the template            
            resolve(false); // Invalid end date
          } else {
            this.invalidTaskEndDate = false;
            resolve(true); // Valid end date
          }
        } else {
          // If member or project end date is not found, consider it invalid
          this.invalidTaskEndDate = true;
          this.taskAssignmentFailed = true;
          this.taskAssignedSuccessfully = false;
          resolve(false); // Invalid due to missing member or project end date
        }
      },
      error: err => {
        console.error('Error fetching member for validation:', err);
        this.invalidTaskEndDate = true;
        this.taskAssignmentFailed = true;
        this.taskAssignedSuccessfully = false;
        resolve(false); // Consider it invalid if there's an error fetching member data
      }
    }); 
  });
}
 

  async assignTask(): Promise<void> {
    if (this.assignTaskForm.invalid) {
      this.taskAssignmentFailed = true;
      this.taskAssignedSuccessfully = false;
      return;
    }
    const taskData = this.assignTaskForm.value;

    await this.validateTaskEndDate(taskData.memberID, taskData.taskEndDate).then(isValid => {
      if (!isValid) {
        return;
      } else {
        this.invalidTaskEndDate = false; // Reset invalid end date flag if validation passes
        this.assgnTaskToMember(taskData);
      }
    });    
  }
 
   assgnTaskToMember(taskData: any): void {
    console.log('Assigning task with data:', taskData);
    const task: ITask = {
      taskName: taskData.taskName,
      deliverables: taskData.deliverables,
      taskStartDate: taskData.taskStartDate,
      taskEndDate: taskData.taskEndDate
    };

    this._sharedService.assignTask(taskData.memberID, task).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.handleTaskAssigned(),
      error: err => { console.error('Error assigning task:', err); this.taskAssignmentFailed = true; this.taskAssignedSuccessfully = false; }
    });
  }

  handleTaskAssigned(): void {
    this.taskAssignedSuccessfully = true;
    this.taskAssignmentFailed = false;
    this.assignTaskForm.reset();
  }

  ngOnInit(): void {
    // Initialization logic can go here
    this._sharedService.getAllTeamMembers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: members => {this.teamMembers = members; this.populateData();},
        error: err => console.error('Error fetching team members:', err)
      });
  }

  ngOnDestroy(): void {
    // Cleanup logic can go here
    this.destroy$.next();
    this.destroy$.complete();
  }

}