import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as dateFns from "date-fns";
import React, { useEffect } from "react";

type DatePickerProps = {
  value?: Date;
  onChange?: (value: Date) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [month, setMonth] = React.useState("1");
  const [year, setYear] = React.useState("2020");
  const [date, setDate] = React.useState("1");

  console.log(value);

  useEffect(() => {
    const today = new Date();
    setDate(today.getDate().toString());
    setMonth((today.getMonth() + 1).toString());
    setYear(today.getFullYear().toString());
    onChange
      ? dateFns.parse(date + "-" + month + "-" + year, "d-M-yyyy", new Date())
      : null;
  }, [month, year, date]);

  const months = dateFns
    .eachMonthOfInterval({
      start: new Date(parseInt(year), 0, 1),
      end: new Date(parseInt(year), 11, 31),
    })
    .map((date) => ({
      value: dateFns.format(date, "MM"),
      label: dateFns.format(date, "MMMM"),
    }));
  const years = dateFns
    .eachYearOfInterval({
      start: new Date(1960, 0, 1),
      end: new Date(),
    })
    .map((date) => ({
      value: dateFns.format(date, "yyyy"),
      label: dateFns.format(date, "yyyy"),
    }));

  const daysInMonth = dateFns.getDaysInMonth(
    new Date(parseInt(year), parseInt(month) - 1),
  );

  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      value: day.toString(),
      label: day.toString().padStart(2, "0"),
    };
  });

  useEffect(() => {
    if (parseInt(date) > daysInMonth) {
      setDate(daysInMonth.toString());
    }
  }, [date, daysInMonth, setDate]);

  return (
    <div>
      <FormLabel className="self-center">Birth Date</FormLabel>
      <div className="flex gap-2 mt-2">
        <Select onValueChange={(v) => setDate(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Date">{date}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {dates.map((date) => (
              <SelectItem key={date.value} value={date.value}>
                {date.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setMonth(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Month">
              {months.find((m) => m.value === month)?.label || "Month"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setYear(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Year">{year}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
