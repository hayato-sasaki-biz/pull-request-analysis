const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type d = typeof digits[number];

const digitsWithoutZero = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type oneToNine = typeof digitsWithoutZero[number];

//type YYYY = `19${d}${d}` | `20${d}${d}`;
type YYYY = `202${d}`;
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
type DD = `0${oneToNine}` | `${1 | 2}${d}` | `3${0 | 1}`;

export type YMDString = `${YYYY}-${MM}-${DD}`;
