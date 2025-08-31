import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface EventsTableProps {
  events: Array<{
    id: string;
    ngoName: string;
    eventDate: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
  }>;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        variant: "default" as const,
        icon: <Clock className="h-3 w-3" />,
        className: "bg-secondary/20 text-secondary border-secondary/30"
      };
    case "confirmed":
      return {
        variant: "default" as const,
        icon: <CheckCircle className="h-3 w-3" />,
        className: "bg-accent/20 text-accent border-accent/30"
      };
    case "completed":
      return {
        variant: "default" as const,
        icon: <CheckCircle className="h-3 w-3" />,
        className: "bg-primary/20 text-primary border-primary/30"
      };
    case "cancelled":
      return {
        variant: "destructive" as const,
        icon: <XCircle className="h-3 w-3" />,
        className: "bg-destructive/20 text-destructive border-destructive/30"
      };
    default:
      return {
        variant: "default" as const,
        icon: <AlertCircle className="h-3 w-3" />,
        className: ""
      };
  }
};

export const EventsTable = ({ events }: EventsTableProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-soft-gradient rounded-lg border shadow-soft">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No events yet</h3>
        <p className="text-muted-foreground">
          Start by scheduling your first event with one of our partner organizations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-soft border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-foreground">NGO Name</TableHead>
            <TableHead className="font-semibold text-foreground">Event Date</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const statusConfig = getStatusConfig(event.status);
            return (
              <TableRow key={event.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-foreground">{event.ngoName}</TableCell>
                <TableCell className="text-muted-foreground">{event.eventDate}</TableCell>
                <TableCell>
                  <Badge 
                    variant={statusConfig.variant}
                    className={`inline-flex items-center gap-1 ${statusConfig.className}`}
                  >
                    {statusConfig.icon}
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};