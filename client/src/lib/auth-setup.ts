// Temporary auth setup for testing domain functionality
// This should NOT be applied to business owners - only for actual team member testing

export function setupTestTeamMemberSession() {
  const teamMemberContext = {
    teamMemberId: 'tm_1',
    clientId: 'client_1', 
    permissions: [
      'domains.view',
      'domains.create',
      'domains.edit', 
      'domains.delete',
      'MANAGE_REVIEWS',
      'VIEW_REVIEWS',
      'VIEW_CLIENTS',
      'MANAGE_CLIENTS'
    ]
  };

  localStorage.setItem('teamMemberContext', JSON.stringify(teamMemberContext));
  localStorage.setItem('currentClientId', 'client_1');
  
  console.log('Test team member session created:', teamMemberContext);
}

// DON'T AUTO-SETUP TEAM CONTEXT - This should only be for actual team members
// Business owners should have full access without team member permissions
// if (typeof window !== 'undefined' && !localStorage.getItem('teamMemberContext')) {
//   localStorage.setItem('testingDomains', 'true');
//   setupTestTeamMemberSession();
// }