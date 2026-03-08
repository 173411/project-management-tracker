import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ITeamMember } from '../../models/project-management-tracker.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-update-allocation',
  standalone: false,
  templateUrl: './update-allocation.component.html',
  styleUrl: './update-allocation.component.css'
})

export class UpdateAllocationComponent implements OnInit, OnDestroy {
  memberID = '';
  memberFound = false;
  searchMemberClicked = false;
  memberDetails: ITeamMember | null = null;

  /** subject used to tear down any subscriptions */
  private destroy$ = new Subject<void>();

  constructor(private _memberService: SharedService) { }

  ngOnInit(): void {
  }
  
  searchMember(): void {
    console.log('Search Member with ID:', this.memberID);
    this.searchMemberClicked = true;

    this._memberService.getMemberByID(this.memberID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: member => this.handleMemberFound(member),
        error: err => this.handleFetchError(err)
      });
  }

  searchMemberViaAPI(): void {
    console.log('Search Member via API with ID:', this.memberID);
    this.searchMemberClicked = true;  

    this._memberService.getMemberByIDFromAPI(this.memberID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ 
        next: data => {
          const member = data?.member; // Assuming the API response has a 'member' property containing the member data
          this.handleMemberFound(member);
        },
        error: err => this.handleFetchError(err)
      });
  }

  updateAllocation(): void {
    const id = this.memberDetails?.memberID;
    if (!id) {
      return;
    }

    this._memberService.updateAllocation(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleAllocationUpdated(),
        error: err => console.error('Error updating allocation:', err)
      });
  }

  /** helpers extracted for clarity and easier testing */
  private handleMemberFound(member: ITeamMember): void {
    console.log('Member found:', member);
    this.memberFound = true;
    this.memberDetails = member;
  }

  private handleFetchError(error: any): void {
    console.error('Error fetching member:', error);
    this.memberFound = false;
  }

  private handleAllocationUpdated(): void {
    console.log('Allocation updated for member:', this.memberDetails);
  }

  // Update allocation percentage via API based on project end date
  updateAllocationViaAPI(): void {
    const id = this.memberDetails?.memberID;
    if (!id) {
      return;
    }
    let allocationPercentage = this.memberDetails?.allocationPercentage;

    if(new Date(this.memberDetails?.projectEndDate.year, this.memberDetails?.projectEndDate.month - 1, this.memberDetails?.projectEndDate.day) < new Date()) {
          allocationPercentage = 0;
    } else {
          allocationPercentage = 100;
    }

    this._memberService.updateAllocationViaAPI(id, allocationPercentage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => { this.memberDetails = response?.member; this.handleAllocationUpdated(); },
        error: err => console.error('Error updating allocation:', err)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
