import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  Clock
} from "lucide-react";

export default function QuickStats() {
  const { data: appointments = [] } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['/api/clients'],
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['/api/reviews'],
  });

  // Calculate today's stats
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const todayAppointments = appointments.filter((apt: any) => {
    const aptDate = new Date(apt.date);
    return aptDate >= todayStart && aptDate < todayEnd;
  });

  const thisWeekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
  const thisWeekAppointments = appointments.filter((apt: any) => {
    const aptDate = new Date(apt.date);
    return aptDate >= thisWeekStart;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const estimatedRevenue = thisWeekAppointments.length * 85; // Average service price

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length.toString(),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: `${thisWeekAppointments.length} this week`,
      changeType: "neutral" as const
    },
    {
      title: "Total Clients",
      value: clients.length.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+12% from last month",
      changeType: "positive" as const
    },
    {
      title: "Week Revenue",
      value: `$${estimatedRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      change: "+8% from last week",
      changeType: "positive" as const
    },
    {
      title: "Average Rating",
      value: averageRating,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: `${reviews.length} reviews`,
      changeType: "neutral" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2">
                  {stat.value}
                </p>
                <p className={`text-xs mt-1 ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600' 
                    : stat.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}