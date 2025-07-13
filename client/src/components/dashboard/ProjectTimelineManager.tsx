import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  DollarSign,
  Camera,
  Edit,
  Trash2,
  Target,
  TrendingUp,
  FileText
} from 'lucide-react';

import { apiRequest } from '@/lib/queryClient';
import type { ProjectTimeline, ProjectMilestone, InsertProjectTimeline, InsertProjectMilestone } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface ProjectTimelineManagerProps {
  projectId: number;
  projectName: string;
  projectStatus: string;
}

export default function ProjectTimelineManager({ 
  projectId, 
  projectName, 
  projectStatus 
}: ProjectTimelineManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<ProjectTimeline | null>(null);
  
  const [timelineForm, setTimelineForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'medium',
    assignedTo: '',
    notes: ''
  });

  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'planning',
    cost: '',
    notes: ''
  });

  // Fetch project timelines
  const { data: timelines = [], isLoading: timelinesLoading } = useQuery({
    queryKey: ['/api/project-timelines', projectId],
    queryFn: () => fetch(`/api/project-timelines?projectId=${projectId}`).then(res => res.json()) as Promise<ProjectTimeline[]>
  });

  // Fetch project milestones
  const { data: milestones = [], isLoading: milestonesLoading } = useQuery({
    queryKey: ['/api/project-milestones', projectId],
    queryFn: () => fetch(`/api/project-milestones?projectId=${projectId}`).then(res => res.json()) as Promise<ProjectMilestone[]>
  });

  // Create timeline mutation
  const createTimelineMutation = useMutation({
    mutationFn: (data: InsertProjectTimeline) => 
      apiRequest('POST', '/api/project-timelines', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-timelines', projectId] });
      setIsTimelineDialogOpen(false);
      setTimelineForm({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        priority: 'medium',
        assignedTo: '',
        notes: ''
      });
      toast({ title: "Timeline created successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error creating timeline", description: error.message, variant: "destructive" });
    }
  });

  // Create milestone mutation
  const createMilestoneMutation = useMutation({
    mutationFn: (data: InsertProjectMilestone) => 
      apiRequest('POST', '/api/project-milestones', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-milestones', projectId] });
      setIsMilestoneDialogOpen(false);
      setMilestoneForm({
        title: '',
        description: '',
        targetDate: '',
        category: 'planning',
        cost: '',
        notes: ''
      });
      toast({ title: "Milestone created successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error creating milestone", description: error.message, variant: "destructive" });
    }
  });

  // Update milestone progress
  const updateMilestoneProgressMutation = useMutation({
    mutationFn: ({ milestoneId, progress }: { milestoneId: number; progress: number }) => 
      apiRequest('PATCH', `/api/project-milestones/${milestoneId}`, { progress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-milestones', projectId] });
      toast({ title: "Progress updated!" });
    }
  });

  // Complete milestone mutation
  const completeMilestoneMutation = useMutation({
    mutationFn: (milestoneId: number) => 
      apiRequest('PATCH', `/api/project-milestones/${milestoneId}`, { 
        status: 'completed', 
        completedDate: new Date().toISOString(),
        progress: 100
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-milestones', projectId] });
      toast({ title: "Milestone completed!" });
    }
  });

  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTimelineMutation.mutate({
      projectId,
      title: timelineForm.title,
      description: timelineForm.description,
      startDate: new Date(timelineForm.startDate),
      endDate: new Date(timelineForm.endDate),
      priority: timelineForm.priority as 'low' | 'medium' | 'high' | 'urgent',
      assignedTo: timelineForm.assignedTo || null,
      notes: timelineForm.notes || null
    });
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMilestoneMutation.mutate({
      projectId,
      title: milestoneForm.title,
      description: milestoneForm.description,
      targetDate: new Date(milestoneForm.targetDate),
      category: milestoneForm.category as 'planning' | 'permits' | 'materials' | 'construction' | 'inspection' | 'completion',
      cost: milestoneForm.cost ? parseFloat(milestoneForm.cost) : null,
      notes: milestoneForm.notes || null
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'planning': return <FileText className="h-4 w-4" />;
      case 'permits': return <CheckCircle className="h-4 w-4" />;
      case 'materials': return <Target className="h-4 w-4" />;
      case 'construction': return <Users className="h-4 w-4" />;
      case 'inspection': return <AlertCircle className="h-4 w-4" />;
      case 'completion': return <TrendingUp className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getProjectProgress = () => {
    if (milestones.length === 0) return 0;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    return Math.round((completedMilestones / milestones.length) * 100);
  };

  const getOverdueMilestones = () => {
    const now = new Date();
    return milestones.filter(m => 
      m.status !== 'completed' && 
      new Date(m.targetDate) < now
    );
  };

  if (timelinesLoading || milestonesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project timeline...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline - {projectName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Progress */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">{getProjectProgress()}%</span>
              </div>
              <Progress value={getProjectProgress()} className="h-2" />
            </div>

            {/* Active Milestones */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Active Milestones</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {milestones.filter(m => m.status === 'in_progress').length}
              </div>
            </div>

            {/* Overdue Items */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Overdue</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {getOverdueMilestones().length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Dialog open={isTimelineDialogOpen} onOpenChange={setIsTimelineDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Timeline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Timeline</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTimelineSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Timeline Title</Label>
                <Input
                  id="title"
                  value={timelineForm.title}
                  onChange={(e) => setTimelineForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Kitchen Renovation Phase 1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the timeline scope and objectives"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={timelineForm.startDate}
                    onChange={(e) => setTimelineForm(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={timelineForm.endDate}
                    onChange={(e) => setTimelineForm(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={timelineForm.priority} onValueChange={(value) => setTimelineForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={timelineForm.assignedTo}
                    onChange={(e) => setTimelineForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Team member or contractor"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={timelineForm.notes}
                  onChange={(e) => setTimelineForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or requirements"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsTimelineDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTimelineMutation.isPending}>
                  {createTimelineMutation.isPending ? 'Creating...' : 'Create Timeline'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Milestone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleMilestoneSubmit} className="space-y-4">
              <div>
                <Label htmlFor="milestoneTitle">Milestone Title</Label>
                <Input
                  id="milestoneTitle"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Permits Approved"
                  required
                />
              </div>
              <div>
                <Label htmlFor="milestoneDescription">Description</Label>
                <Textarea
                  id="milestoneDescription"
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what needs to be accomplished"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={milestoneForm.targetDate}
                    onChange={(e) => setMilestoneForm(prev => ({ ...prev, targetDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={milestoneForm.category} onValueChange={(value) => setMilestoneForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="permits">Permits</SelectItem>
                      <SelectItem value="materials">Materials</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="completion">Completion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="cost">Associated Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={milestoneForm.cost}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="Optional cost for this milestone"
                />
              </div>
              <div>
                <Label htmlFor="milestoneNotes">Notes</Label>
                <Textarea
                  id="milestoneNotes"
                  value={milestoneForm.notes}
                  onChange={(e) => setMilestoneForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or requirements"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMilestoneMutation.isPending}>
                  {createMilestoneMutation.isPending ? 'Creating...' : 'Create Milestone'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timelines and Milestones */}
      <Tabs defaultValue="milestones" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="timelines">Timelines</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          {milestones.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Milestones Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create milestones to track project progress and keep clients informed.
                </p>
                <Button onClick={() => setIsMilestoneDialogOpen(true)}>
                  Create Your First Milestone
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {milestones.map((milestone) => (
                <Card key={milestone.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(milestone.category)}
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                        )}
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-600">{milestone.progress}%</span>
                          </div>
                          <Progress value={milestone.progress || 0} className="h-2" />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                          </div>
                          {milestone.cost && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${milestone.cost.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {milestone.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => completeMilestoneMutation.mutate(milestone.id)}
                            disabled={completeMilestoneMutation.isPending}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timelines" className="space-y-4">
          {timelines.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Timelines Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create project timelines to organize work phases and track progress.
                </p>
                <Button onClick={() => setIsTimelineDialogOpen(true)}>
                  Create Your First Timeline
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {timelines.map((timeline) => (
                <Card key={timeline.id} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4" />
                          <h3 className="font-semibold">{timeline.title}</h3>
                          <Badge className={getStatusColor(timeline.status)}>
                            {timeline.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(timeline.priority)}>
                            {timeline.priority}
                          </Badge>
                        </div>
                        {timeline.description && (
                          <p className="text-sm text-gray-600 mb-3">{timeline.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(timeline.startDate).toLocaleDateString()} - {new Date(timeline.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          {timeline.assignedTo && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{timeline.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}