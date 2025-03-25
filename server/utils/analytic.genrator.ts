import { Document, Model } from "mongoose";

interface MonthData {
    month: string;
    count: number;
}

export async function generateLast12MonthData<T extends Document>(
    model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() );

    for (let i = 12; i >= 0; i--) {
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - i * 28 // Fixed month calculation
        );

        const startDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate() - 28
        );

        const monthYear = endDate.toLocaleString("default", {
            day: "numeric", // Fixed spelling from "numaric"
            month: "short",
            year: "numeric", // Fixed spelling from "number"
        });

        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        last12Months.push({ month: monthYear, count });
    }

    return { last12Months }; // Fixed return position
}
