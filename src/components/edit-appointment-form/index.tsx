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
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {RichTextEditor} from "@/components/rich-text-editor";
import type {Appointment} from "@/models/appointment.ts";

const formSchema = z.object({
    notes: z
        .string()
        .max(5000, "La description ne peut pas dépasser 5000 caractères"),
});

type FormSchema = z.infer<typeof formSchema>;

export const EditAppointmentForm = ({
    appointment,
    onSubmit: onFormSubmitted
}: {
    appointment: Appointment,
    onSubmit: (data: FormSchema) => Promise<void>
}) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            notes: appointment.notes ?? "",
        },
        mode: "onChange",
    });

    const onSubmit = async (values: FormSchema) => {
        await onFormSubmitted(values);
    };

    return (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Éditer le rendez-vous</DialogTitle>
                <DialogDescription>
                    Modifiez la description de "{appointment.name}"
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form id="edit-appointment-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FormField
                            name="notes"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <FormItem>
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="notes">
                                            Description
                                        </FieldLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Saisissez une description..."
                                                disabled={false}
                                            />
                                        </FormControl>
                                        <FieldDescription>
                                            Ajoutez des notes ou une description pour ce rendez-vous
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                </FormItem>
                            )}
                        />
                    </FieldGroup>
                </form>
            </Form>

            <DialogFooter>
                <Button
                    type="submit"
                    form="edit-appointment-form"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? <Spinner/> : "Enregistrer"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};
