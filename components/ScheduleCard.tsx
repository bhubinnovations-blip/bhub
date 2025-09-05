"use client";

interface Props {
  time: string | null;
  date: string | null;
  takePlaceAt: string | null;
}

export default function ScheduleCard({ time, date, takePlaceAt }: Props) {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg mb-6">
      <p>{time ?? "--:--"}</p>
      <p>{date ?? "Day 0"}</p>
      <p>{takePlaceAt ?? "Loading..."}</p>
    </div>
  );
}