import type {IDashboardStats} from "@/types/IDashboardStats.ts";

export class AgendaStats implements IDashboardStats {
    activeCollaborators: number;
    appointmentsThisWeek: number;
    mainCalendars: number;
    waitingValidation: number;

    constructor({
                    activeCollaborators,
                    appointmentsThisWeek,
                    mainCalendars,
                    waitingValidation
                }: IDashboardStats) {

        this.activeCollaborators = activeCollaborators;
        this.appointmentsThisWeek = appointmentsThisWeek;
        this.mainCalendars = mainCalendars;
        this.waitingValidation = waitingValidation;
    }
}