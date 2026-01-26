// date-picker.tsx
// Put this file in your /components/ui/date-picker.tsx

"use client";

import * as React from "react";
import {fr} from "react-day-picker/locale";
import {CalendarIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import type {DateRange} from "react-day-picker";

interface DatePickerProps {
    value?: DateRange;
    onChange?: (date: DateRange | undefined) => void;
    id?: string;
    placeholder?: string;
    disabled?: boolean;
    disabledDates?: Date[];
}

const RangePicker = ({
                         value,
                         onChange,
                         id,
                         placeholder,
                         disabled,
                         disabledDates = []
                     }: DatePickerProps) => {
    const [open, setOpen] = React.useState(false);
    const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

    React.useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id={id}
                    className="w-full justify-between font-normal"
                    disabled={disabled}
                >
                    {(value?.from && value?.to) ? (value.from?.toLocaleDateString() + " au " + value.to?.toLocaleDateString()) : placeholder || "Select date"}
                    <CalendarIcon className="size-3.5"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                <Calendar
                    disabled={date => {
                        const d = new Date()
                        d.setDate(d.getDate() - 1)
                        return (date < d || disabledDates.map(date => date.getTime()).includes(date.getTime()))
                    }
                    }
                    mode="range"
                    selected={value}
                    locale={fr}
                    weekStartsOn={1}
                    startMonth={new Date()}
                    endMonth={new Date(2050, 11)}
                    className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                    captionLayout="dropdown"
                    buttonVariant="ghost"
                    timeZone={timeZone}
                    onSelect={(date) => {
                        onChange?.(date);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
};

export {RangePicker};
