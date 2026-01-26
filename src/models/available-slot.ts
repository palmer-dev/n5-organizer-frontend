import sha256 from "crypto-js/sha256";

import type {CalendarEvent} from "@/types/CalendarEvent.ts";
import {toDate} from "@/lib/utils.ts";

export interface IAvailableSlot {
    name: string,
    start: string;
    end: string;
}

export class AvailableSlot {
    id: string;
    name?: string;
    end: Date;
    start: Date;

    constructor(params: IAvailableSlot) {
        this.id = sha256(params.start + params.end).toString();
        this.name = params.name ?? "Nom par défaut";
        this.start = toDate(params.start)!;
        this.end = toDate(params.end)!;

    }

    toCalendarEvent() {
        return {
            title: this.name,
            startDate: this.start,
            endDate: this.end,
            variant: 'primary',
        } as CalendarEvent
    }
}