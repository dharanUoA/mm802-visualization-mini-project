export function onlyUnique(
  value: string | number,
  index: number,
  array: (string | number)[]
) {
  return array.indexOf(value) === index;
}

export interface Option {
  label: string;
  value: number;
}

export const TopOptions: Option[] = [
  {
    label: "Top 10",
    value: 10,
  },
  {
    label: "Top 20",
    value: 20,
  },
  {
    label: "Top 50",
    value: 50,
  },
  {
    label: "Top 100",
    value: 100,
  },
  //   {
  //     label: "Overall",
  //     value: -1,
  //   },
];

export const YearOptions: Option[] = [
  {
    label: "Last 5 Years",
    value: 8,
  },
  {
    label: "Last 10 Years",
    value: 13,
  },
  {
    label: "Overall",
    value: -1,
  },
];
