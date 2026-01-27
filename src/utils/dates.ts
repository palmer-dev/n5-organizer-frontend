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


export const minutesToTime = (minutes: number): number => {
    return minutes * 60000
}

export const generateDurations = (
    maxHours = 8,
    stepMinutes = 15
) => {
    const maxMinutes = maxHours * 60;

    return Array.from(
        { length: maxMinutes / stepMinutes },
        (_, i) => {
            const minutes = (i + 1) * stepMinutes;

            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;

            const label =
                hours > 0
                    ? mins > 0
                        ? `${hours}h${mins}`
                        : `${hours}h`
                    : `${mins}min`;

            return {
                label,
                value: minutesToTime(minutes),
            };
        }
    );
};

export const isInRange = (date: Date, range: { start: Date; end: Date }) =>
    date.getTime() >= range.start.getTime() &&
    date.getTime() < range.end.getTime();

export const intersects = (
    a: { start: Date; end: Date },
    b: { start: Date; end: Date }
) =>
    a.start.getTime() < b.end.getTime() &&
    a.end.getTime() > b.start.getTime();


export const isRangeFullyInside = (
    range: { start: Date; end: Date },
    zone: { start: Date; end: Date }
) =>
    range.start.getTime() >= zone.start.getTime() &&
    range.end.getTime() <= zone.end.getTime();