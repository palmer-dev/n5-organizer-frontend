import type {CalendarEvent} from "@/types/CalendarEvent.ts";

export type CustomContextMenuItem = {
    title: string,
    showIf?: (event: CalendarEvent) => boolean,
    onClick: (event: CalendarEvent) => void
}