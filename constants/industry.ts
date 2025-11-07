const values = process.env.NEXT_PUBLIC_INDUSTRY_VALUES?.split(",").map(i => i.trim()) || [];

export const INDUSTRY_OPTIONS = values.map(value => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));