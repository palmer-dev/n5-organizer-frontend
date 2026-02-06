import type {AppointmentId} from "@/types/IAppointment.ts";

export type CalendarEvent = {
    id: AppointmentId;
    title: string;
    startDate: Date;
    endDate: Date;
    variant?: "primary" | "secondary" | "outline" | "destructive";
};