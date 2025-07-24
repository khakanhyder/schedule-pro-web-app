import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface ReminderTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  url?: string;
}

export default function PartnershipReminder() {
  const [tasks, setTasks] = useState<ReminderTask[]>([
    {
      id: 'track_referrals',
      title: 'Track Stripe Referrals',
      description: 'Monitor how many users click through to Stripe setup',
      dueDate: new Date().toISOString(),
      priority: 'high',
      completed: true
    },
    {
      id: 'apply_partnership',
      title: 'Apply for Stripe Partnership',
      description: 'Submit application to become official Stripe Technology Partner',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      priority: 'high',
      completed: false,
      url: 'https://stripe.com/partners/become-a-partner'
    },
    {
      id: 'monthly_report',
      title: 'Monthly Partnership Update',
      description: 'Review referral analytics and partnership progress',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      priority: 'medium',
      completed: false
    },
    {
      id: 'stripe_certification',
      title: 'Complete Stripe Certifications',
      description: 'Get Stripe Developer and Architect certifications',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
      priority: 'medium',
      completed: false,
      url: 'https://docs.stripe.com/partners/training-and-certification'
    },
    {
      id: 'quarterly_review',
      title: 'Quarterly Partnership Review',
      description: 'Assess partnership ROI and plan next quarter strategy',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
      priority: 'low',
      completed: false
    }
  ]);

  const [nextReminder, setNextReminder] = useState<ReminderTask | null>(null);

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('partnership_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Set up periodic reminders
    const reminderInterval = setInterval(() => {
      checkUpcomingTasks();
    }, 60000); // Check every minute

    checkUpcomingTasks();

    return () => clearInterval(reminderInterval);
  }, []);

  const checkUpcomingTasks = () => {
    const now = new Date();
    const upcoming = tasks
      .filter(task => !task.completed)
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntilDue <= 7 && daysUntilDue >= 0; // Due within a week
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    setNextReminder(upcoming || null);
  };

  const markTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('partnership_tasks', JSON.stringify(updatedTasks));
    checkUpcomingTasks();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return 'Overdue';
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-6">
      {/* Active Reminder */}
      {nextReminder && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Bell className="w-5 h-5" />
              Upcoming Partnership Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-amber-900">{nextReminder.title}</h3>
                <p className="text-sm text-amber-700">{nextReminder.description}</p>
                <p className="text-xs text-amber-600 mt-1">
                  {formatDaysUntilDue(nextReminder.dueDate)}
                </p>
              </div>
              <div className="flex gap-2">
                {nextReminder.url && (
                  <Button
                    size="sm"
                    onClick={() => window.open(nextReminder.url, '_blank')}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Go
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markTaskComplete(nextReminder.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Done
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Partnership Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Tasks Completed</span>
              <span className="font-bold">{completedTasks} of {totalTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {progressPercentage.toFixed(0)}% complete - Keep up the great work!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-4 border rounded-lg ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'text-green-800' : ''}`}>
                        {task.title}
                      </h3>
                      <p className={`text-sm ${task.completed ? 'text-green-700' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                      {!task.completed && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDaysUntilDue(task.dueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    {!task.completed && task.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(task.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    {!task.completed && (
                      <Button
                        size="sm"
                        onClick={() => markTaskComplete(task.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automated Reminder Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-sm">Automated Reminder System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Partnership updates will automatically appear when:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Tasks are due within 7 days</li>
                <li>Monthly review periods arrive</li>
                <li>Significant referral milestones are reached</li>
                <li>Partnership application status changes</li>
              </ul>
              <p className="mt-2 text-xs">
                No need to remember - the system will keep you informed!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}