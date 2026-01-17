"use client";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {MultiSelect} from "@/components/multi-select.tsx";
import {useSuspenseQuery} from "@tanstack/react-query";
import {usersQueryOptions} from "@/features/users/users-query-options.ts";
import {useMemo} from "react";
import {DatePicker} from "@/components/date-picker.tsx";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    startDate: z.date(),
    endDate: z.date(),
    users: z.array(z.string()),
})
    .refine(
        (data) => {
            if (isNaN(data.endDate.getTime())) return false;
            if (isNaN(data.startDate.getTime())) return false;
            return data.endDate > data.startDate;
        },
        {
            message: "La date de fin doit après celle de début",
            path: ["endDate"],
        }
    );

type EventFormProps = {
    startDate: Date;
    endDate: Date;
    onSubmit: (data: z.infer<typeof formSchema>) => void;
    onCancel: () => void;
};

export function EventForm({startDate, endDate, onSubmit, onCancel}: EventFormProps) {
    const {data, isLoading} = useSuspenseQuery(usersQueryOptions);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            startDate: startDate,
            endDate: endDate,
        },
    });

    const usersList = useMemo(() => {
        if (Array.isArray(data)) {
            return data.map(item => ({value: item.id, label: `${item.firstname} ${item.lastname}`}));
        }

        return [];
    }, [data]);

    if (isLoading) return (<div>Loading...</div>)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full p-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nom de la réunion</FormLabel>
                            <FormControl>
                                <Input placeholder="Saisissez un nom..." {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>À partir de</FormLabel>
                            <FormDescription>Date à partir de laquelle la réunion peut être proposée.</FormDescription>
                            <FormControl>
                                <DatePicker onChange={field.onChange} value={field.value} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="endDate"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Jusqu'au</FormLabel>
                            <FormDescription>Date jusqu'à laquelle la réunion peut être proposée.</FormDescription>
                            <FormControl>
                                <DatePicker onChange={field.onChange} value={field.value} disabledDates={[new Date(2025, 11, 22)]}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="users"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Participants</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={usersList}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="w-full sm:w-auto"
                                    placeholder="Choisissez des participants..."
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="submit">Créer une réunion</Button>
                </div>
            </form>
        </Form>
    );
}