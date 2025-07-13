import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus, Eye, Edit } from 'lucide-react';

export default function Simple3DProjectManager() {
  const [projects] = useState([
    {
      id: 1,
      projectName: 'Kitchen Remodel - Smith Family',
      projectType: 'kitchen',
      clientName: 'John Smith',
      status: 'draft',
      estimatedCost: 15000
    },
    {
      id: 2,
      projectName: 'Bathroom Renovation - Johnson Home',
      projectType: 'bathroom',
      clientName: 'Sarah Johnson',
      status: 'in-progress',
      estimatedCost: 8500
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">3D Room Projects</h2>
          <p className="text-muted-foreground">
            Create and manage 3D room visualizations for your clients
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Demo Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This is a simplified version of the 3D project manager. 
          Full 3D visualization features are being optimized for better performance.
        </AlertDescription>
      </Alert>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.projectName}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Client:</strong> {project.clientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Type:</strong> {project.projectType}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Budget:</strong> ${project.estimatedCost.toLocaleString()}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Button variant="outline" className="justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Create Kitchen Project
          </Button>
          <Button variant="outline" className="justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Create Bathroom Project
          </Button>
        </div>
      </div>
    </div>
  );
}