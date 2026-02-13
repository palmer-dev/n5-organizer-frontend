"use client";

import {DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Calendar, Clock, Users, FileText, Pencil, Trash2} from "lucide-react";
import type {Appointment} from "@/models/appointment";
import moment from "moment/min/moment-with-locales";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

moment.locale("fr");

interface AppointmentDetailsModalProps {
    appointment: Appointment;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const AppointmentDetailsModal = ({
    appointment,
    onEdit,
    onDelete,
}: AppointmentDetailsModalProps) => {
    const getStatusBadge = () => {
        const variant = appointment.variant;
        const statusMap = {
            primary: {label: "Validé", variant: "default" as const},
            outline: {label: "En attente", variant: "outline" as const},
            destructive: {label: "Refusé", variant: "destructive" as const},
            secondary: {label: "Autre", variant: "secondary" as const},
        };
        return statusMap[variant] || statusMap.secondary;
    };

    const statusBadge = getStatusBadge();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <div className="space-y-2 pr-8">
                    <DialogTitle className="text-2xl">{appointment.name}</DialogTitle>
                    <Badge variant={statusBadge.variant} className="w-fit">{statusBadge.label}</Badge>
                </div>
            </DialogHeader>

            <div className="space-y-6">
                {/* Date et heure */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground"/>
                        <span>Date et heure</span>
                    </div>
                    <div className="pl-6 space-y-1">
                        <p className="text-sm">
                            <span className="font-medium">Début :</span>{" "}
                            {moment(appointment.startDate).format("dddd D MMMM YYYY [à] HH:mm")}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Fin :</span>{" "}
                            {moment(appointment.endDate).format("dddd D MMMM YYYY [à] HH:mm")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1"/>
                            Durée : {moment.duration(moment(appointment.endDate).diff(moment(appointment.startDate))).humanize()}
                        </p>
                    </div>
                </div>

                <Separator/>

                {/* Participants */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="h-4 w-4 text-muted-foreground"/>
                        <span>Participants</span>
                    </div>
                    <div className="pl-6">
                        {appointment.users && appointment.users.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {appointment.users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2"
                                    >
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(user.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{user.fullName}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Aucun participant</p>
                        )}
                    </div>
                </div>

                <Separator/>

                {/* Description */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground"/>
                        <span>Description</span>
                    </div>
                    <div className="pl-6">
                        {appointment.notes && appointment.notes.trim() !== "" && appointment.notes !== "<p></p>" ? (
                            <>
                                <style>{`
                                    .appointment-notes ul {
                                        list-style-type: disc;
                                        padding-left: 1.5rem;
                                        margin: 0.5rem 0;
                                    }
                                    .appointment-notes ol {
                                        list-style-type: decimal;
                                        padding-left: 1.5rem;
                                        margin: 0.5rem 0;
                                    }
                                    .appointment-notes li {
                                        display: list-item;
                                        margin: 0.25rem 0;
                                    }
                                    .appointment-notes p {
                                        margin: 0.5rem 0;
                                    }
                                    .appointment-notes strong {
                                        font-weight: 600;
                                    }
                                    .appointment-notes em {
                                        font-style: italic;
                                    }
                                `}</style>
                                <div
                                    className="prose prose-sm max-w-none text-sm appointment-notes"
                                    dangerouslySetInnerHTML={{__html: appointment.notes}}
                                />
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Aucune description
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {(onEdit || onDelete) && (
                    <>
                        <Separator/>
                        <div className="flex justify-end gap-2 pt-2">
                            {onEdit && (
                                <Button variant="outline" size="sm" onClick={onEdit}>
                                    <Pencil className="h-4 w-4 mr-1"/>
                                    Éditer
                                </Button>
                            )}
                            {onDelete && (
                                <Button variant="destructive" size="sm" onClick={onDelete}>
                                    <Trash2 className="h-4 w-4 mr-1"/>
                                    Supprimer
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </DialogContent>
    );
};
