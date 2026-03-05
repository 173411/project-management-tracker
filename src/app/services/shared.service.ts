import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITask, ITeamMember } from '../models/project-management-tracker.model';

@Injectable({
  providedIn: 'root' // Available across all modules
})
export class SharedService {
  private teamMembers = new BehaviorSubject<ITeamMember[]>([]);
  private tasks = new BehaviorSubject<any[]>([]);
  private selectedMember = new BehaviorSubject<ITeamMember | null>(null);
  
  public teamMembers$ = this.teamMembers.asObservable();
  public tasks$ = this.tasks.asObservable();
  public selectedMember$ = this.selectedMember.asObservable();

  constructor() { }

  // Team Members methods
  setTeamMembers(members: ITeamMember[]): void {
    this.teamMembers.next(members);
  }

  getTeamMembers(): ITeamMember[] {
    return this.teamMembers.value;
  }

  getAllTeamMembers(): Observable<ITeamMember[]> {
    return this.teamMembers$;
  }

  addTeamMember(member: ITeamMember): Observable<boolean> {
    const current = this.teamMembers.value;
    this.teamMembers.next([...current, member]);
    return new Observable<boolean>(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  updateTeamMember(id: string, member: ITeamMember): void {
    const current = this.teamMembers.value;
    const updated = current.map(m => m.memberID === id ? member : m);
    this.teamMembers.next(updated);
  }

  // Tasks methods
  setTasks(tasks: any[]): void {
    this.tasks.next(tasks);
  }

  getTasks(): any[] {
    return this.tasks.value;
  }

  addTask(task: any): void {
    const current = this.tasks.value;
    this.tasks.next([...current, task]);
  }

  assignTask(id: string, task: ITask): Observable<ITeamMember | null> {
    const member = this.teamMembers.value.find(m => m.memberID === id);
    if (member) {
      member.task = task;
      this.updateTeamMember(id, member);
      return new Observable<ITeamMember | null>((observer) => {
        observer.next(member);
        observer.complete();
      });
    } else {
      return new Observable<ITeamMember | null>((observer) => {
        observer.next(null);
        observer.complete();
      });
    }
  }

  // Selected Member methods
  setSelectedMember(member: ITeamMember | null): void {
    this.selectedMember.next(member);
  }

  getSelectedMember(): ITeamMember | null {
    return this.selectedMember.value;
  }

  getMemberByID(id: string): Observable<ITeamMember> {
    const member = this.teamMembers.value.find(m => m.memberID === id);
    return new Observable<ITeamMember>((observer) => {
      if (member) {
        observer.next(member);
        observer.complete();
      } else {
        observer.error(new Error('Member not found'));
      }
    });
  } 

  updateAllocation(id: string): Observable<number> {
    return new Observable<number>((observer) => {
      const member = this.teamMembers.value.find(m => m.memberID === id);
      if (member) {
        if(new Date(member.projectEndDate.year, member.projectEndDate.month - 1, member.projectEndDate.day) < new Date()) {
          member.allocationPercentage = 0;
        } else {
          member.allocationPercentage = 100;
        }
        this.updateTeamMember(id, member);
        observer.next(member.allocationPercentage);
        observer.complete();
      } else {
        console.error('Member not found for allocation update');
        observer.error(new Error('Member not found'));
      }
    });
  }
}
