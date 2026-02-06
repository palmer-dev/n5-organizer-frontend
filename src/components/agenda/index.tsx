"use client";

import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/ui/dialog";
import {Plus, CalendarDays} from "lucide-react";
import moment from "moment/min/moment-with-locales";
import {useCallback, useMemo, useState} from "react";
import type {CalendarEvent} from "@/types/CalendarEvent";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {agendaAppointmentsQueryOptions} from "@/features/agendas/agenda-appointments-query-options";
import {MultiForm} from "@/components/multistep-form/form";
import type {DateRange} from "react-day-picker";
import {Calendar} from "@/components/agenda/calendar";
import {createAppointmentsMutationOptions} from "@/features/appointments/create-mutation-options";
import AppointmentStatusType from "@/types/AppointmentStatusType";
import type {CustomContextMenuItem} from "@/types/CustomContextMenuItem";
import {deleteAppointmentsMutationOptions} from "@/features/appointments/delete-mutation-options";
import type {AgendaId} from "@/types/IAgenda";
import type {IUser} from "@/types/IUser";
import {updateStatusAppointmentsMutationOptions} from "@/features/appointments/update-status-mutation-options";

moment.locale("fr");

const AgendaViewer = ({calendarId}: { calendarId: AgendaId }) => {
    const {data: appointments} = useSuspenseQuery(
        agendaAppointmentsQueryOptions(calendarId)
    );

    // Mutations
    const createAppointment = useMutation(
        createAppointmentsMutationOptions(calendarId)
    );
    const updateStatusAppointment = useMutation(
        updateStatusAppointmentsMutationOptions(calendarId)
    );
    const deleteAppointment = useMutation(
        deleteAppointmentsMutationOptions(calendarId)
    );

    const [date, setDate] = useState(new Date());
    const [dialogOpen, setDialogOpen] = useState(false);

    const events = useMemo(
        () => (appointments ?? []).map((app) => app.toCalendarEvent()),
        [appointments]
    );

    const handleCreateEvent = async (data: {
        title: string;
        range: DateRange;
        users: string[];
        timeslot: DateRange;
    }) => {
        await createAppointment.mutateAsync({
            name: data.title,
            notes: "",
            startDate: data.timeslot.from!,
            endDate: data.timeslot.to!,
            users: data.users as unknown as IUser[],
        });

        setDialogOpen(false);
    };

    const handleChangeState = useCallback(
        (event: CalendarEvent, state: AppointmentStatusType) => {
            void updateStatusAppointment.mutateAsync({
                id: event.id,
                status: state,
            });
        },
        [updateStatusAppointment]
    );

    const handleDeleteEvent = useCallback(
        (event: CalendarEvent) => {
            void deleteAppointment.mutateAsync(event.id);
        },
        [deleteAppointment]
    );

    const contextMenuItems: CustomContextMenuItem[] = useMemo(
        () => [
            {
                title: "Valider la présence",
                showIf: (event) => event.variant !== "primary",
                onClick: (event) =>
                    handleChangeState(event, AppointmentStatusType.Validated),
            },
            {
                title: "Mettre en attente",
                showIf: (event) => event.variant !== "outline",
                onClick: (event) =>
                    handleChangeState(event, AppointmentStatusType.Pending),
            },
            {
                title: "Refuser le rendez-vous",
                showIf: (event) => event.variant !== "destructive",
                onClick: (event) =>
                    handleChangeState(event, AppointmentStatusType.Refused),
            },
            {
                title: "Supprimer",
                showIf: () => true,
                onClick: handleDeleteEvent,
            },
        ],
        [handleChangeState, handleDeleteEvent]
    );

    return (
        <section className="space-y-4 col-span-full">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <CalendarDays className="h-5 w-5"/>
                        <p className="font-medium">
                            {moment(date).format("dddd D MMMM YYYY")}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-3xl">
                        Gérez vos rendez vous, et créez de nouveau avec l'assistant de planification. Pour modifier un
                        évènement, clique droit sur l'évènement et différentes actions vous seront proposées
                    </p>
                </div>

                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1"/>
                    Planifier une réunion
                </Button>
            </div>

            {/* Dialog création */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                {dialogOpen && <MultiForm onSubmit={handleCreateEvent}/>}
            </Dialog>

            {/* Empty state */}
            {events.length === 0 && (
                <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">
                        Aucun rendez-vous planifié
                    </p>
                    <p>
                        Commencez par créer votre premier rendez-vous pour organiser votre
                        agenda.
                    </p>
                </div>
            )}

            {/* Calendar */}
            <div className="rounded-lg border bg-background shadow-sm">
                <Calendar
                    events={events}
                    date={date}
                    contextMenuItems={contextMenuItems}
                    onNavigate={setDate}
                />
            </div>
        </section>
    );
};

export default AgendaViewer;
