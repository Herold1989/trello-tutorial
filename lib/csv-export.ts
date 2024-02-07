import { UserListSchema } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import * as z from "zod"
type User = z.infer<typeof UserListSchema>;



export function convertToCSV(array: User[], columns: ColumnDef<User>[]): string {
  // Define the keys you want to include in the CSV
  const includedKeys: (keyof User)[] = ["name", "email", "role", "company"];

  // Safely extract column headers
  const headers = columns
    .map(col => {
      if ('accessorKey' in col && includedKeys.includes(col.accessorKey as keyof User)) {
        return col.accessorKey as keyof User;
      }
      return null; // Exclude columns without a matching accessorKey
    })
    .filter(Boolean) as (keyof User)[];

  // Convert array of objects into a string
  let csvString = headers.join(",") + "\n"; // Add the headers and a new line

  // Loop over the rows
  array.forEach(item => {
    let row = headers.map(header => {
      let cell = item[header] ? item[header].toString() : "";
      cell = cell.replace(/"/g, '""'); // Escape double quotes
      return `"${cell}"`; // Wrap cell contents in double quotes
    }).join(",");
    csvString += row + "\n"; // Add the row and a new line
  });

  return csvString;
}
