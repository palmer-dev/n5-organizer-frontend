export type CalendarEvent = {
    title: string;
    startDate: Date;
    endDate: Date;
    variant?: "primary" | "secondary" | "outline";
};