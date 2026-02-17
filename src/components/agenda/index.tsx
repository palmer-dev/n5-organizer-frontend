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
import {
    updateDescriptionAppointmentsMutationOptions
} from "@/features/appointments/update-description-mutation-options";
import {EditAppointmentForm} from "@/components/edit-appointment-form";
import {AppointmentDetailsModal} from "@/components/appointment-details-modal";
import type {Appointment} from "@/models/appointment";

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
    const updateDescriptionAppointment = useMutation(
        updateDescriptionAppointmentsMutationOptions(calendarId)
    );
    const deleteAppointment = useMutation(
        deleteAppointmentsMutationOptions(calendarId)
    );

    const [date, setDate] = useState(new Date());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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

    const handleViewDetails = useCallback(
        (event: CalendarEvent) => {
            const appointment = appointments?.find(app => app.id === event.id);
            if (appointment) {
                setSelectedAppointment(appointment);
                setDetailsDialogOpen(true);
            }
        },
        [appointments]
    );

    const handleEditEvent = useCallback(
        (event: CalendarEvent) => {
            const appointment = appointments?.find(app => app.id === event.id);
            if (appointment) {
                setSelectedAppointment(appointment);
                setEditDialogOpen(true);
            }
        },
        [appointments]
    );

    const handleEditFromDetails = useCallback(() => {
        setDetailsDialogOpen(false);
        setEditDialogOpen(true);
    }, []);

    const handleDeleteFromDetails = useCallback(() => {
        if (!selectedAppointment) return;
        void deleteAppointment.mutateAsync(selectedAppointment.id);
        setDetailsDialogOpen(false);
        setSelectedAppointment(null);
    }, [selectedAppointment, deleteAppointment]);

    const handleUpdateDescription = async (data: { notes: string }) => {
        if (!selectedAppointment) return;

        await updateDescriptionAppointment.mutateAsync({
            id: selectedAppointment.id,
            notes: data.notes,
        });

        setEditDialogOpen(false);
        setSelectedAppointment(null);
    };

    const contextMenuItems: CustomContextMenuItem[] = useMemo(
        () => [
            {
                title: "Voir les détails",
                onClick: handleViewDetails,
            },
            {
                title: "Éditer",
                onClick: handleEditEvent,
            },
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
        [handleChangeState, handleDeleteEvent, handleEditEvent, handleViewDetails]
    );

    return (
        <section className="space-y-6 col-span-full">
            {/* Header amélioré */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border">
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-primary/10">
                            <CalendarDays className="h-4 w-4 text-primary"/>
                        </div>
                        <h2 className="text-lg font-semibold capitalize">
                            {moment(date).format("dddd D MMMM YYYY")}
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                        Gérez vos rendez-vous et créez-en de nouveaux avec l'assistant de planification.
                        <span className="hidden sm:inline"> Faites un clic droit sur un événement pour accéder aux actions disponibles.</span>
                    </p>
                </div>

                <Button
                    onClick={() => setDialogOpen(true)}
                    size="default"
                    className="sm:self-start shadow-sm hover:shadow-md transition-shadow"
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Planifier une réunion
                </Button>
            </div>

            {/* Dialog création */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                {dialogOpen && <MultiForm onSubmit={handleCreateEvent}/>}
            </Dialog>

            {/* Dialog détails */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                {detailsDialogOpen && selectedAppointment && (
                    <AppointmentDetailsModal
                        appointment={selectedAppointment}
                        onEdit={handleEditFromDetails}
                        onDelete={handleDeleteFromDetails}
                    />
                )}
            </Dialog>

            {/* Dialog édition */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                {editDialogOpen && selectedAppointment && (
                    <EditAppointmentForm
                        appointment={selectedAppointment}
                        onSubmit={handleUpdateDescription}
                    />
                )}
            </Dialog>

            {/* Empty state amélioré */}
            {events.length === 0 && (
                <div className="rounded-xl border-2 border-dashed bg-muted/20 p-12 text-center">
                    <div className="mx-auto max-w-md space-y-4">
                        <div className="mx-auto w-fit p-4 rounded-full bg-primary/10">
                            <CalendarDays className="h-10 w-10 text-primary"/>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                Aucun rendez-vous planifié
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Votre calendrier est vide pour le moment. Commencez par créer votre premier rendez-vous pour organiser votre agenda.
                            </p>
                        </div>
                        <Button
                            onClick={() => setDialogOpen(true)}
                            variant="default"
                            size="sm"
                            className="mt-4"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Créer un rendez-vous
                        </Button>
                    </div>
                </div>
            )}

            {/* Calendar amélioré */}
            {events.length > 0 && (
                <div className="rounded-xl border bg-card shadow-md overflow-hidden">
                    <Calendar
                        events={events}
                        date={date}
                        contextMenuItems={contextMenuItems}
                        onNavigate={setDate}
                    />
                </div>
            )}
        </section>
    );
};

export default AgendaViewer;
