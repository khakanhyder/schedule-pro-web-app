// Temporary auth setup for testing domain functionality
// In production, this would be handled by actual login flow

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

// Call this function when the app loads for testing
if (typeof window !== 'undefined' && !localStorage.getItem('teamMemberContext')) {
  setupTestTeamMemberSession();
}