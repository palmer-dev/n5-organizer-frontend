"use client";

import moment from "moment/min/moment-with-locales";
import {useState, type ComponentType, type SyntheticEvent} from "react";
import {
    type CalendarProps,
    Views,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {momentLocalizer} from "react-big-calendar";
import type {EventInteractionArgs} from "react-big-calendar/lib/addons/dragAndDrop";
import type {SlotInfo} from "react-big-calendar";
import type {CalendarEvent} from "@/types/CalendarEvent";
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar.ts";

moment.locale("fr");
const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop<CalendarEvent>(
    ShadcnBigCalendar as ComponentType<CalendarProps<CalendarEvent>>
);

const messages = {
    allDay: "Tous les jours",
    previous: "Précédent",
    next: "Suivant",
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    agenda: "Agenda",
    date: "Date",
    time: "Heure",
    event: "Évènement",
};

type CalendarPropsUI = {
    className?: string
    events: CalendarEvent[];
    date: Date;
    onNavigate?: (date: Date) => void;
    onSelectSlot?: (slot: SlotInfo) => void;
    onSelectEvent?: (event: CalendarEvent, e: SyntheticEvent<HTMLElement, Event>) => void;
    onEventDrop?: (args: EventInteractionArgs<CalendarEvent>) => void;
    onEventResize?: (args: EventInteractionArgs<CalendarEvent>) => void;
};

export function Calendar({
                             className,
                             events,
                             date,
                             onNavigate,
                             onSelectSlot,
                             onSelectEvent,
                             onEventDrop,
                             onEventResize,
                         }: CalendarPropsUI) {
    // Gère le view interne
    const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.WEEK);

    const handleViewChange = (newView: typeof Views[keyof typeof Views]) => {
        setView(newView);
    };

    const eventPropGetter: CalendarProps<CalendarEvent>["eventPropGetter"] = (event) => {
        const variant = event.variant ?? "primary";
        return {
            className: `event-variant-${variant}`,
        };
    };

    return (
        <DnDCalendar
            localizer={localizer}
            style={{height: 600, width: "100%"}}
            className={className + " border-border border-rounded-md border-solid border-2 rounded-lg"}
            culture="fr"
            selectable
            popup
            resizable
            draggableAccessor={() => true}
            resizableAccessor={() => true}
            date={date}
            view={view} // ici on utilise le state interne
            events={events.map(e => ({...e, start: e.startDate, end: e.endDate}))}
            messages={messages}
            formats={{dayFormat: "ddd Do"}}
            onNavigate={onNavigate}
            onView={handleViewChange} // met à jour le view interne
            onSelectSlot={onSelectSlot}
            onSelectEvent={onSelectEvent}
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            eventPropGetter={eventPropGetter}
        />
    );
}
