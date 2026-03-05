export interface ITeamMember {
  memberName: string;
  memberID: string;
  yearsOfExperience: number;
  skillset: string[];
  description: string;
  projectStartDate: any; // Assuming this is an object with day, month, year properties
  projectEndDate: any;
  allocationPercentage: number;
  task: ITask;  
}

export interface ITask {
  taskName: string;
  deliverables: string;
  taskStartDate: any;
  taskEndDate: any;
}
