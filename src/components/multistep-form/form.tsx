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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {MultiSelect} from "@/components/multi-select.tsx";
import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {usersQueryOptions} from "@/features/users/users-query-options.ts";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";
import {searchAppointmentsMutationOptions} from "@/features/appointments/search-query-options.ts";
import type {UserId} from "@/types/IUser.ts";
import {RangePicker} from "@/components/range-picker.tsx";
import type {AvailableSlot} from "@/models/available-slot.ts";
import {Calendar} from "@/components/agenda/calendar.tsx";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";

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
                        issue.input === undefined ? "À partir de is required" : "Invalid date",
                }),
            to: z
                .date({
                    error: (issue) =>
                        issue.input === undefined ? "À partir de is required" : "Invalid date",
                }),
        }),
    users: z
        .array(z.string()),
    timeslot: z
        .string(),
});

type FormSchema = z.infer<typeof formSchema>;

export const MultiForm = ({onSubmit: onFormSubmitted}: { onSubmit: (data: FormSchema) => Promise<void> }) => {
    const {data, isLoading} = useSuspenseQuery(usersQueryOptions);
    const searchAppointmentsMutation = useMutation(searchAppointmentsMutationOptions())

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
            title: "",
            range: undefined,
            users: [],
            timeslot: "",
        },
        mode: "onChange",
    });

    const usersList = useMemo(() => {
        if (Array.isArray(data)) {
            return data.map(item => ({value: item.id, label: `${item.firstname} ${item.lastname}`}));
        }

        return [];
    }, [data]);

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
        if (!availableSlots.some(s => s.id === values.timeslot)) {
            form.setError("timeslot", {
                type: "manual",
                message: "Le créneau sélectionné n’est plus disponible",
            });
            return;
        }

        await onFormSubmitted(values)
            .then(() => toast.success("Évènement enregistré"))
            .catch(() => toast.error("Erreur lors de l'enregistrement"));
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
                                                Voici les dates disponibles
                                            </FieldLabel>
                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={false}
                                            >
                                                <SelectTrigger
                                                    id="timeslot"
                                                    aria-invalid={fieldState.invalid}
                                                >
                                                    <SelectValue placeholder=""/>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Choisissez un créneau</SelectLabel>
                                                            {availableSlots.map((item) => (
                                                                <SelectItem key={item.id} value={item.id}>
                                                                    {item.start.toLocaleString()} à {item.end.toLocaleString()}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </SelectTrigger>
                                            </Select>
                                            {/*<AgendaViewer></AgendaViewer>*/}
                                            <Calendar date={date} onNavigate={setDate}
                                                      events={availableSlots.map(e => e.toCalendarEvent())}/>
                                            <FieldDescription></FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    </FormItem>
                                );
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