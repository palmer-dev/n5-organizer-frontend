"use client";

import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/ui/dialog";
import {Plus} from "lucide-react";
import moment from 'moment/min/moment-with-locales';
import {type SyntheticEvent, useState} from "react";
import {type SlotInfo} from "react-big-calendar";
import type {EventInteractionArgs} from "react-big-calendar/lib/addons/dragAndDrop";
import type {CalendarEvent} from "@/types/CalendarEvent.ts";
import {useSuspenseQuery} from "@tanstack/react-query";
import {agendaAppointmentsQueryOptions} from "@/features/agendas/agenda-appointments-query-options.ts";
import {MultiForm} from "@/components/multistep-form/form.tsx";
import type {DateRange} from "react-day-picker";
import {Calendar} from "@/components/agenda/calendar.tsx";


moment.locale('fr');

const AgendaViewer = ({calendarId}: { calendarId: string }) => {
    const {data: appointments, isLoading, isError} = useSuspenseQuery(agendaAppointmentsQueryOptions(calendarId))

    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>((appointments ?? [])?.map(app => app.toCalendarEvent()));
    const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

    const handleCreateEvent = async (data: {
        title: string;
        range: DateRange;
        users: string[],
        timeslot: DateRange,
    }) => {
        const newEvent: CalendarEvent = {
            title: data.title,
            startDate: data.timeslot.from!,
            endDate: data.timeslot.to!,
            variant: "primary",
        };

        setEvents((previous) => [...previous, newEvent]);
        setSelectedSlot(null);
    };

    const handleEventDrop = ({event, start, end}: EventInteractionArgs<CalendarEvent>) => {
        const nextStart = new Date(start);
        const normalizedEnd = new Date(end);
        const updatedEvents = events.map((existingEvent) =>
            existingEvent === event
                ? {...existingEvent, start: nextStart, end: normalizedEnd}
                : existingEvent
        );
        setEvents(updatedEvents);
    };

    const handleEventResize = ({event, start, end}: EventInteractionArgs<CalendarEvent>) => {
        const nextStart = new Date(start);
        const nextEnd = new Date(end);
        const updatedEvents = events.map((existingEvent) =>
            existingEvent === event
                ? {...existingEvent, start: nextStart, end: nextEnd}
                : existingEvent
        );

        setEvents(updatedEvents);
    };

    const handleSelectEvent = (event: CalendarEvent, e: SyntheticEvent<HTMLElement, Event>) => {
        console.log('event', event);
        console.log('start', e);
    }

    if (isLoading) {
        return <div>Chargement..</div>
    }

    if (isError) {
        return <div>Erreur lors du chargement du calendrier</div>;
    }

    return (
        <section className="space-y-4 col-span-full">
            <div className="flex flex-wrap items-center gap-3 justify-between">
                <p className="text-muted-foreground">
                    Add a meeting, workshop, or reminder to the demo.
                </p>
                <Button
                    aria-label="Créer une nouvelle réunion"
                    onClick={() => setSelectedSlot({
                        start: new Date(),
                        end: new Date(),
                        slots: [],
                        action: "click"
                    })}
                >
                    <Plus/>
                    Planifier une réunion
                </Button>
            </div>

            <Dialog open={selectedSlot !== null} onOpenChange={() => setSelectedSlot(null)}>
                {selectedSlot && (
                    <MultiForm onSubmit={handleCreateEvent}/>
                )}
            </Dialog>

            <Calendar
                events={events}
                date={date}
                onNavigate={setDate}
                onSelectSlot={setSelectedSlot}
                onSelectEvent={handleSelectEvent}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
            />
        </section>
    );
};
export default AgendaViewer