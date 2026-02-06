"use client";

import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldGroup,
} from "@/components/ui/field";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import {MultiSelect} from "@/components/multi-select.tsx";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {usersQueryOptions} from "@/features/users/users-query-options.ts";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";
import {searchAppointmentsMutationOptions} from "@/features/appointments/search-mutation-options.ts";
import type {UserId} from "@/types/IUser.ts";
import {RangePicker} from "@/components/range-picker.tsx";
import {AvailableSlot} from "@/models/available-slot.ts";
import {Calendar} from "@/components/agenda/calendar.tsx";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {minutesToTime} from "@/utils/dates";
import type {Appointment} from "@/models/appointment.ts";
import type {AppointmentId} from "@/types/IAppointment.ts";
import {authClient} from "@/lib/auth-client.ts";

const formSchema = z.object({
    title: z
        .string()
        .min(1, "Nom de la réunion is required")
        .max(255, "Nom de la réunion must be at most 255 characters"),
    range: z
        .object({
            from: z
                .date({
                    error: (issue) =>
                        issue.input === undefined ? "Date range needs a start" : "Invalid date",
                }),
            to: z
                .date({
                    error: (issue) =>
                        issue.input === undefined ? "Date range needs an end" : "Invalid date",
                }),
        }),
    users: z
        .array(z.string()),
    duration: z.int({error: (issue) => issue.input === undefined ? "The duration must be defined" : "Invalid duration"}),
    timeslot: z
        .object({
            from: z
                .date({
                    error: (issue) =>
                        issue.input === undefined ? "Time slot need a start" : "Invalid date",
                }),
            to: z
                .date({
                    error: (issue) =>
                        issue.input === undefined ? "Time slot need an end" : "Invalid date",
                }),
        }, {
            error: (issue) => {
                return issue.input === undefined ? "Timeslot is required" : "Invalid slot"
            }
        }),
});

type FormSchema = z.infer<typeof formSchema>;

const steps = [
    {
        title: "Recherche de créneaux",
        description: "Recherche de disponibilité de chacun des participants",
        fields: ["range", "users"],
    },
    {
        title: "Choix du créneau",
        description: "Blockage du créneau de la réunion",
        fields: ["title", "timeslot"],
    },
];

export const MultiForm = ({appointment, onSubmit: onFormSubmitted}: {
    appointment?: Appointment,
    onSubmit: (data: FormSchema) => Promise<void>
}) => {
    const {data: session} = authClient.useSession()

    const {data, isLoading} = useSuspenseQuery(usersQueryOptions);
    const searchAppointmentsMutation = useMutation(searchAppointmentsMutationOptions())

    const [date, setDate] = useState(new Date());
    const [currentStep, setCurrentStep] = useState(0);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);

    const currentForm = steps[currentStep];

    const isLastStep = currentStep === steps.length - 1;
    const progress = ((currentStep + 1) / steps.length) * 100;

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        shouldUnregister: false,
        defaultValues: {
            title: appointment?.name ?? "",
            range: undefined,
            users: appointment?.users.map(user => user.id) ?? [],
            duration: minutesToTime(15),
            timeslot: undefined,
        },
        mode: "onChange",
    });

    const usersList = useMemo(() => {
        if (Array.isArray(data)) {
            return data.filter(item => item.id !== session?.user.id).map(item => ({
                value: item.id,
                label: `${item.firstname} ${item.lastname}`
            }));
        }

        return [];
    }, [data, session]);

    const handleNextButton = async () => {
        const currentFields = steps[currentStep].fields;

        const isValid = await form.trigger(currentFields as unknown as keyof FormSchema);

        if (currentStep === steps.length - 2) {
            const result = await searchAppointmentsMutation.mutateAsync({
                startDate: form.getValues('range.from'),
                endDate: form.getValues('range.to'),
                users: form.getValues('users') as UserId[],
            })

            setAvailableSlots(result);
        }

        if (isValid && !isLastStep) {
            setCurrentStep((prev) => prev + 1);
        } else {
            console.log('ICI');
        }
    };

    const handleBackButton = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const onSubmit = async (values: FormSchema) => {
        if (!availableSlots.some(s => s.start.getTime() <= values.timeslot.from.getTime() && s.end.getTime() >= values.timeslot.to.getTime())) {
            form.setError("timeslot", {
                type: "manual",
                message: "Le créneau sélectionné n’est plus disponible",
            });
            return;
        }

        await onFormSubmitted(values)
            .then(() => toast.success("Évènement enregistré"))
            .catch((error) => toast.error("Erreur lors de l'enregistrement") && console.log(error));
    };

    if (isLoading) return (<span><Spinner/> Loading...</span>)

    const renderCurrentStepContent = () => {
        return (
            <>
                <div style={{display: currentStep === 0 ? "contents" : "none"}}>
                    <FieldGroup>
                        <FormField
                            name="range"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <FormItem>
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="range">Jusqu'au</FieldLabel>
                                        <RangePicker
                                            id="range"
                                            value={field.value}
                                            onChange={field.onChange}
                                            aria-invalid={fieldState.invalid}
                                            placeholder=""
                                            disabled={false}
                                        />
                                        <FieldDescription>
                                            Date jusqu'à laquelle la réunion peut être proposée.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="users"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <FormItem>
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="users">
                                            Select Field
                                        </FieldLabel>
                                        <MultiSelect
                                            id="users"
                                            options={usersList}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="w-full sm:w-auto"
                                            placeholder="Choisissez des participants..."
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <FieldDescription>Choisissez les participants voulus</FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                </FormItem>
                            )}
                        />
                    </FieldGroup>
                </div>
                <div style={{display: currentStep === 1 ? "contents" : "none"}}>
                    <FieldGroup>
                        <FormField
                            name="title"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <FormItem>
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="title">
                                            Nom de la réunion
                                        </FieldLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="title"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Saisissez un nom..."
                                                autoComplete="off"
                                                disabled={false}
                                            />
                                        </FormControl>
                                        <FieldDescription></FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="timeslot"
                            control={form.control}
                            render={({field, fieldState}) => {
                                return (
                                    <FormItem>
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="timeslot">
                                                Voici les slots disponibles
                                            </FieldLabel>
                                            <Calendar
                                                isSelectable={true}
                                                date={date}
                                                onNavigate={setDate}
                                                onSelectSlot={(slot) => {
                                                    console.log(slot);
                                                    field.onChange({from: slot.start, to: slot.end})
                                                }}
                                                selectable={availableSlots.map(slot => ({
                                                    start: slot.start,
                                                    end: slot.end
                                                }))}
                                                events={(field.value?.from && field.value?.to) ? [{
                                                    id: "ok" as unknown as AppointmentId,
                                                    title: "Nouveau RDV",
                                                    startDate: field.value.from,
                                                    endDate: field.value.to
                                                }] : []}
                                            />
                                            <FieldDescription></FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    </FormItem>
                                )
                            }}
                        />
                    </FieldGroup>
                </div>
            </>
        );
    };

    return (
        <DialogContent className={"max-h-[calc(100%-2rem)] overflow-y-auto"}>
            <DialogHeader className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle>{currentForm.title}</DialogTitle>
                        <p className="text-muted-foreground text-xs mr-8">
                            Step {currentStep + 1} of {steps.length}
                        </p>
                    </div>
                    <DialogDescription>{currentForm.description}</DialogDescription>
                </div>
                <Progress value={progress}/>
            </DialogHeader>

            <Form {...form}>
                <form id="multi-form" onSubmit={form.handleSubmit(onSubmit)}>
                    {renderCurrentStepContent()}
                </form>
            </Form>

            <DialogFooter className={"sticky bg-white"}>
                <Field className="justify-between" orientation="horizontal">
                    {currentStep > 0 && (
                        <Button type="button" variant="ghost" onClick={handleBackButton}>
                            <ChevronLeft/> Back
                        </Button>
                    )}
                    {!isLastStep && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleNextButton}
                        >
                            Next
                            <ChevronRight/>
                        </Button>
                    )}
                    {isLastStep && (
                        <Button
                            type="submit"
                            form="multi-form"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? <Spinner/> : "Submit"}
                        </Button>
                    )}
                </Field>
            </DialogFooter>
        </DialogContent>
    );
};