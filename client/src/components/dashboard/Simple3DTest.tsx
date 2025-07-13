import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Play, Zap } from 'lucide-react';

export default function Simple3DTest() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">3D Room Projects</h2>
        <p className="text-gray-600">Create and manage 3D room visualizations for clients</p>
      </div>

      {/* Demo Projects */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Kitchen Demo</CardTitle>
              <Badge variant="secondary">Demo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Professional kitchen design with island, countertops, and premium cabinets
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => alert('Kitchen demo would open here')}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                View Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bathroom Demo</CardTitle>
              <Badge variant="secondary">Demo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Modern bathroom with vanity, shower, and premium fixtures
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => alert('Bathroom demo would open here')}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                View Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Project */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="text-center py-8">
          <Home className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
          <p className="text-gray-600 mb-4">Start a new 3D room design project</p>
          <Button 
            onClick={() => alert('New project dialog would open here')}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            New Project
          </Button>
        </CardContent>
      </Card>

      {/* Test Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">
              3D Projects Tab Loading Successfully
            </span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            This confirms the tab navigation is working. The buttons above should show alerts when clicked.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}