import * as React from "react"
import {CalendarIcon} from "lucide-react"

import {fr} from "react-day-picker/locale";
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Input} from "@/components/ui/input"
import {cn} from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useFormField} from "@/components/ui/form.tsx";

type DatePickerInputProps = {
    value?: Date
    onChange: (date: Date | undefined) => void
    placeholder?: string
    className?: string
    disabledDates?: Date[]
}

function formatDate(date: Date | undefined): string {
    if (!date) return "";

    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    return date instanceof Date && !isNaN(date.getTime())
}

export function DatePicker({
                               value,
                               onChange,
                               placeholder = "Select date...",
                               className,
                               disabledDates = []
                           }: DatePickerInputProps) {
    const {error} = useFormField()
    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState<Date | undefined>(value)
    const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)


    const [inputValue, setInputValue] = React.useState(formatDate(value));

    React.useEffect(() => {
        setInputValue(formatDate(value))
        if (isValidDate(value)) setMonth(value !== undefined ? new Date(value) : new Date())
    }, [value])

    React.useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [])

    return (
        <div className="relative">
            <Input
                value={inputValue}
                placeholder={placeholder}
                className={cn("bg-background pr-10", className)}
                aria-invalid={!!error}
                readOnly={true}
                // onChange={(e) => {
                //     const date = new Date(e.target.value)
                //     setInputValue(e.target.value)
                //     if (isValidDate(date)) {
                //         onChange(date)
                //         setMonth(date)
                //     }
                // }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setOpen(true)
                    }
                }}
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                        <CalendarIcon className="size-3.5"/>
                        <span className="sr-only">Select date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Calendar
                        disabled={date => {
                            const d = new Date()
                            d.setDate(d.getDate() - 1)
                            return (date < d || disabledDates.map(date => date.getTime()).includes(date.getTime()))
                        }
                        }
                        mode="single"
                        selected={value ? new Date(value) : new Date()}
                        captionLayout="dropdown"
                        month={month}
                        locale={fr}
                        weekStartsOn={1}
                        startMonth={new Date()}
                        endMonth={new Date(2050, 11)}
                        onMonthChange={setMonth}
                        className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                        buttonVariant="ghost"
                        timeZone={timeZone}
                        onSelect={(date) => {
                            onChange(date)
                            setInputValue(formatDate(date))
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
