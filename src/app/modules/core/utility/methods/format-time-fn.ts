export function formatTime(value: string | Date): string {
    try {
        // Check if value is a string and does have correct fracture and timezone parts
        if (typeof value === 'string') {
            const dotIndex = value.lastIndexOf(".");
            if (dotIndex !== -1) {
                const dateTimeTail = value.substring(dotIndex + 1, dotIndex + 4);
                let fractureNumberStr = "";
                for(let i = 0; i < 3; i ++) {
                    if (/\d/.test(dateTimeTail[i])) fractureNumberStr += dateTimeTail[i];
                    else break;
                }
                value = `${value.substring(0, dotIndex+1)}${fractureNumberStr.padEnd(3, "0")}Z`
            } else {
                value += ".000Z";
            }
        }

        value = new Date(value);

        // Get the hours and minutes in UTC
        const hours = value.getUTCHours();
        const minutes = value.getUTCMinutes();

        // Format the hours and minutes as strings with leading zeros if necessary
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');

        // Combine the hours and minutes into a time string
        const time = `${hoursStr}:${minutesStr}`;

        return time;
    } catch(err) {
        return "";
    }
}
