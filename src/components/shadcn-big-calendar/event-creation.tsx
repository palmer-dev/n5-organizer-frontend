"use client"

import {EventForm, type EventFormProps} from "@/components/shadcn-big-calendar/event-form.tsx";
import {JSX, useEffect, useMemo, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {Field} from "@/components/ui/field.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";

type EventCreationProps = EventFormProps;

type FormStep = {
    title: string,
    description: string,
    component: JSX.Element,
}

export function EventCreation({startDate, endDate, onSubmit, onCancel}: EventCreationProps) {
    const steps: FormStep[] = useMemo(() => [
        {
            title: "",
            description: "",
            component: <EventForm endDate={endDate} startDate={startDate} onCancel={onCancel} onSubmit={onSubmit}/>,
        }
    ], [endDate, startDate, onCancel, onSubmit]);

    const [currentStep, setCurrentStep] = useState<number>(0)
    const [currentForm, setCurrentForm] = useState<FormStep>(steps[0])

    const progress = ((currentStep + 1) / steps.length) * 100;

    useEffect(() => {
        setCurrentForm(steps[currentStep])
    }, [currentStep, steps]);

    const handleNextButton = async () => {
        const currentFields = steps[currentStep].fields;

        const isValid = await form.trigger(currentFields);

        if (isValid && !isLastStep) {
        }
            setCurrentStep((prev) => prev + 1);
    };

    const handleBackButton = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const onSubmit = async (values: FormSchema) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Form successfully submitted");

        console.log(values);
    };

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <CardTitle>{currentForm.title}</CardTitle>
                        <p className="text-muted-foreground text-xs">
                            Step {currentStep + 1} of {steps.length}
                        </p>
                    </div>
                    <CardDescription>{currentForm.description}</CardDescription>
                </div>
                <Progress value={progress}/>
            </CardHeader>
            <CardContent>
                <form id="multi-form" onSubmit={form.handleSubmit(onSubmit)}>
                    {renderCurrentStepContent()}
                </form>
            </CardContent>
            <CardFooter>
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
            </CardFooter>
        </Card>
    )
}