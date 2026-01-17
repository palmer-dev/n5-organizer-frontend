"use client";

import {EventForm} from "@/components/shadcn-big-calendar/event-form";
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Plus} from "lucide-react";
import moment from 'moment/min/moment-with-locales';
import {type ComponentType, type SetStateAction, type SyntheticEvent, useState} from "react";
import {type CalendarProps} from "react-big-calendar";
import {momentLocalizer, type SlotInfo, Views} from "react-big-calendar";
import type {EventInteractionArgs} from "react-big-calendar/lib/addons/dragAndDrop";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import type {CalendarEvent} from "@/types/CalendarEvent.ts";
import {useSuspenseQuery} from "@tanstack/react-query";
import {agendaAppointmentsQueryOptions} from "@/features/agendas/agenda-appointments-query-options.ts";

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
    event: "Evenement",
};

const AgendaViewer = ({calendarId}: { calendarId: string }) => {
    const {data: appointments, isLoading, isError} = useSuspenseQuery(agendaAppointmentsQueryOptions(calendarId))

    const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.WEEK);
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>((appointments ?? [])?.map(app => app.toCalendarEvent()));
    const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

    moment.locale('fr');

    const localizer = momentLocalizer(moment);

    const eventPropGetter: CalendarProps<CalendarEvent>["eventPropGetter"] = (event) => {
        const variant = event.variant ?? "primary";
        return {
            className: `event-variant-${variant}`,
        };
    };

    const handleNavigate = (newDate: Date) => {
        setDate(newDate);
    };

    const handleViewChange = (newView: SetStateAction<typeof Views[keyof typeof Views]>) => {
        setView(newView);
    };

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        setSelectedSlot(slotInfo);
    };

    const handleCreateEvent = (data: {
        title: string;
        startDate: Date;
        endDate: Date;
        users: string[]
    }) => {
        const newEvent: CalendarEvent = {
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
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
                <DialogContent>
                    <DialogTitle>Planifier une réunion</DialogTitle>
                    {selectedSlot && (
                        <EventForm
                            startDate={selectedSlot.start}
                            endDate={selectedSlot.end}
                            onSubmit={handleCreateEvent}
                            onCancel={() => setSelectedSlot(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <DnDCalendar
                localizer={localizer}
                style={{height: 600, width: "100%"}}
                className="border-border border-rounded-md border-solid border-2 rounded-lg"
                selectable
                culture={'fr'}
                date={date}
                onNavigate={handleNavigate}
                view={view}
                onView={handleViewChange}
                showMultiDayTimes={true}
                resizable
                popup={true}
                draggableAccessor={() => true}
                resizableAccessor={() => true}
                events={events.map(event => ({...event, start: event.startDate, end: event.endDate}))}
                eventPropGetter={eventPropGetter}
                onSelectSlot={handleSelectSlot}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
                onSelectEvent={handleSelectEvent}
                formats={{
                    dayFormat: 'ddd Do',
                }}
                messages={messages}
            />
        </section>
    );
};
export default AgendaViewer