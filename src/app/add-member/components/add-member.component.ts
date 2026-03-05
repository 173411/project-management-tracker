import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { CustomValidationService } from '../../services/custom-validation.service';
import { Subject, Subscription } from 'rxjs';
import { SKILLSET } from '../../constants/app.constants';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-add-member',
  standalone: false,
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.css'
})

export class AddMemberComponent implements OnInit, OnDestroy {
  addMemberForm: any; // This will be initialized with a FormGroup in a real implementation
  availableSkills = SKILLSET; // Assuming SKILLSET is an array of skill options
  subscription = new Subscription();
  memberAdditionFailed: boolean = false;
  memberAddedSuccessfully: boolean = false;

  constructor(private readonly formBuilder: UntypedFormBuilder, private readonly customValidationService: CustomValidationService, private readonly _memberService: SharedService 

  ) { }

  toggleSkill(skill: string): void {
    const selectedSkills = this.addMemberForm.get('skillset')?.value || [];
    const index = selectedSkills.indexOf(skill);
    if (index > -1) {
      // Skill is already selected, remove it
      selectedSkills.splice(index, 1);
    } else {
      // Skill is not selected, add it
      selectedSkills.push(skill);
    }
    this.addMemberForm.get('skillset')?.setValue([...selectedSkills]);
  }

  isSkillSelected(skill: string): boolean {
    const selectedSkills = this.addMemberForm.get('skillset')?.value || [];
    return selectedSkills.includes(skill);
  }

  addMember(): void {
    // Implementation for adding a member will go here
    if (this.addMemberForm.valid) {
      const memberData = this.addMemberForm.value;
      console.log('Adding member with data:', memberData);
      this.subscription = this._memberService.addTeamMember(memberData).subscribe({
        next: response => {
          console.log('Member added successfully:', response);
          this.memberAddedSuccessfully = true;
          this.memberAdditionFailed = false;
          this.addMemberForm.reset(); // Reset the form after successful submission
        },
        error: err => {
          console.error('Error adding member:', err);
          // Handle error (e.g., show a notification to the user)
        }
      });
    } else {
      console.log('Form is invalid. Please correct the errors and try again.');
    }
  }

  ngOnInit(): void {
    this.addMemberForm = this.formBuilder.group({
      // Define form controls and validators here
      memberName: ['ss', [Validators.required, this.customValidationService.XSSValidator()]],
      memberID: ['1', [Validators.required, this.customValidationService.XSSValidator()]],
      yearsOfExperience: ['6', [Validators.required, Validators.min(4)]],      
      skillset: [['Python', 'JavaScript', 'TypeScript'], [Validators.required, this.customValidationService.minSelection(3)]], // Assuming skillset is an array of selected skills    
      description: ['xx', [Validators.required, this.customValidationService.XSSValidator()]],
      projectStartDate: [{year: 2023, month: 3, day: 24}, [Validators.required]],     
      projectEndDate: [{year: 2026, month: 3, day: 31}, [Validators.required]],
      allocationPercentage: ['40', [Validators.required, Validators.min(0), Validators.max(100)]],
    }, {
      // Custom validator to ensure project end date is after start date
      validators: this.customValidationService.projectDateValidator('projectStartDate', 'projectEndDate')
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
  }

}
