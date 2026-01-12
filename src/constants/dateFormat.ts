export const DATE_FORMATS = {
    date: {
      display: 'dd/MM/yyyy',           // 12/01/2026
    },
    time: {
      display: 'hh:mm a',             // 03:30 PM
    },
    datetime: {
      display: 'dd/MM/yyyy, hh:mm a', // 12/01/2026, 03:30 PM
    },
  } as const;
  
  export type DateMode = keyof typeof DATE_FORMATS;