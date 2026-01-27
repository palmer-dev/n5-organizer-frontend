import type {AvailableSlot} from "@/models/available-slot";

export const getDaysBetween = (start: Date, end: Date): Date[] => {
    const days: Date[] = [];
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const last = new Date(end);
    last.setHours(0, 0, 0, 0);

    while (current <= last) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
};

export const generateTimeSlots = (
    slot: AvailableSlot,
    day: Date
): Date[] => {
    const times: Date[] = [];

    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const start = new Date(Math.max(slot.start.getTime(), dayStart.getTime()));
    const end = new Date(Math.min(slot.end.getTime(), dayEnd.getTime()));

    const current = new Date(start);
    current.setMinutes(Math.ceil(current.getMinutes() / 15) * 15, 0, 0);

    while (current < end) {
        times.push(new Date(current));
        current.setMinutes(current.getMinutes() + 15);
    }

    return times;
};
