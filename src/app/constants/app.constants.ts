export const SKILLSET = [
    'Angular',
    'React',
    'Vue',
    'Node.js',
    'Python',
    'Java',
    'C#',
    'Ruby',
    'Go',
    'Swift',
    'Kotlin',
    'PHP',
    'Django',
    'Git',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
    'SQL'];

export const API_ENDPOINTS = {
    BASEURL: 'http://localhost:3000',
    ADD_MEMBER: '/api/teamMembers',
    GET_ALL_MEMBERS: '/api/teamMembers',
    GET_ONE_MEMBER: '/api/teamMembers/:id', // Append member ID for specific member
    ASSIGN_TASK: '/api/teamMembers/:id/assignTask', // Append member ID for updating
    UPDATE_ALLOCATION: '/api/teamMembers/:id/allocation' // Append member ID for updating allocation
};