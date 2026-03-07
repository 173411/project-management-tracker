import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-fetch-team',
  standalone: false,
  templateUrl: './fetch-team.component.html',
  styleUrl: './fetch-team.component.css'
})
export class FetchTeamComponent implements OnInit, OnDestroy {
  teamMembers: any[] = [];
  private subscription: any;
  sortBy: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  dataLoaded: boolean = false;

  constructor(private _memberService: SharedService) { }

  ngOnInit(): void {
    this.subscription = this._memberService.getAllMembersFromAPI()?.subscribe(response => {
      if (response && response.teamMembers) {
        this.dataLoaded = true;
        this.teamMembers = response.teamMembers; // Assuming the API response has a 'teamMembers' property that contains the array of members
      } else {
        console.error('Failed to fetch team members from API');
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from any subscriptions if needed
    if (this.subscription) {        
      this.subscription.unsubscribe();
    }
  }

  sortByExperience(): void {
    if (this.sortBy === 'experience') {
      // Toggle direction if already sorting by experience
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set to experience and default to ascending
      this.sortBy = 'experience';
      this.sortDirection = 'asc';
    }

    // Sort the array
    this.teamMembers = [...this.teamMembers].sort((a, b) => {
      const diff = a.yearsOfExperience - b.yearsOfExperience;
      return this.sortDirection === 'asc' ? diff : -diff;
    });
  }
}

