"use client";

import moment from "moment/min/moment-with-locales";
import {
    useState,
    type SyntheticEvent,
    type CSSProperties, useCallback
} from "react";
import {
    type CalendarProps,
    Views,
} from "react-big-calendar";
import {momentLocalizer} from "react-big-calendar";
import type {EventInteractionArgs} from "react-big-calendar/lib/addons/dragAndDrop";
import type {SlotInfo} from "react-big-calendar";
import type {CalendarEvent} from "@/types/CalendarEvent";
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar.ts";
import {isInRange, isRangeFullyInside} from "@/utils/dates.ts";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from "@/components/ui/context-menu.tsx";
import type {CustomContextMenuItem} from "@/types/CustomContextMenuItem.ts";

moment.locale("fr");
const localizer = momentLocalizer(moment);

const DnDCalendar = ShadcnBigCalendar

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
    isSelectable?: boolean;
    unselectable?: Array<{ start: Date, end: Date }>;
    selectable?: Array<{ start: Date, end: Date }>;
    contextMenuItems?: CustomContextMenuItem[];
};

export function Calendar({
                             className,
                             events,
                             date,
                             onNavigate,
                             onSelectSlot,
                             onSelectEvent,
                             contextMenuItems = [],
                             unselectable = [],
                             selectable = [],
                             isSelectable = false
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

    // Désactiver la sélection pour certaines périodes
    const handleSelecting = (range: { start: Date; end: Date }) => {
        if (selectable.length > 0) {
            return selectable.some(zone => isRangeFullyInside(range, zone));
        }

        return !unselectable.some(zone =>
            range.start < zone.end && range.end > zone.start
        );
    };


    // Colorer les slots non sélectionnables
    // Slot prop getter avec context menu
    const slotStyleGetter: CalendarProps<CalendarEvent>["slotPropGetter"] = (date) => {
        const style: CSSProperties = {};
        let pointerEvents: CSSProperties["pointerEvents"] = "auto";

        // 🔒 selectable mode
        if (selectable.length > 0) {
            const isSlotSelectable = selectable.some(zone => isInRange(date, zone));
            if (!isSlotSelectable) {
                style.backgroundColor = "#f1f5f9"; // gris neutre
                pointerEvents = "none";
            } else {
                style.backgroundColor = "#dcfce7"; // vert clair
            }
        }

        // 🚫 unselectable mode
        for (const zone of unselectable) {
            if (isInRange(date, zone)) {
                style.backgroundColor = "#fee2e2"; // rouge clair
                pointerEvents = "none";
            }
        }

        return {
            style: {...style, pointerEvents},
        };
    };

    const contextMenuItemsFiltered = useCallback((event: CalendarEvent) => contextMenuItems.filter((ctxMenu => !ctxMenu.showIf || (ctxMenu.showIf && ctxMenu.showIf(event)))), [contextMenuItems])

    const EventComponent = useCallback(
        ({event}: { event: CalendarEvent }) => (
            contextMenuItemsFiltered(event).length > 0 ?
                <ContextMenu>
                    <ContextMenuTrigger className="contents">
                        <div className="h-full">{event.title}</div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        {contextMenuItemsFiltered(event).map((item, i) => (<ContextMenuItem key={'menu-' + i}
                                                                                            onClick={() => item.onClick(event)}>
                                {item.title}
                            </ContextMenuItem>)
                        )}
                    </ContextMenuContent>
                </ContextMenu>
                : <div className="h-full">{event.title}</div>
        ),
        [contextMenuItemsFiltered]
    )

    return (
        <div className="p-4 sm:p-6">
            <DnDCalendar
                enableAutoScroll
                localizer={localizer}
                style={{height: 650, width: "100%"}}
                className={`${className || ''} rbc-calendar-modern`}
                culture="fr"
                selectable={isSelectable}
                popup
                date={date}
                view={view}
                events={events.map(e => ({...e, start: e.startDate, end: e.endDate}))}
                messages={messages}
                formats={{dayFormat: "ddd Do"}}
                onNavigate={onNavigate}
                onView={handleViewChange}
                onSelectSlot={onSelectSlot}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventPropGetter}
                onSelecting={handleSelecting}
                slotPropGetter={slotStyleGetter}
                step={15}
                timeslots={4}
                showMultiDayTimes={true}
                components={{
                    event: EventComponent
                }}
            />
        </div>
    );
}
