import { format, isToday, isYesterday, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function getSmartDateLabel(dateString: string): string {
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return "Subida hoy";
    }
    
    if (isYesterday(date)) {
      return "Ayer";
    }
    
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
  } catch {
    return dateString;
  }
}

export function sortByDateDesc<T extends { fecha: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.fecha).getTime();
    const dateB = new Date(b.fecha).getTime();
    return dateB - dateA;
  });
}
