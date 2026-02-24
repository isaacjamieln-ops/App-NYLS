// --------------------
// FUNCIONES DE TIEMPO Y CONFLICTOS
// --------------------

export const toggle = (course, selected) =>
  selected.includes(course)
    ? selected.filter(x => x !== course)
    : [...selected, course];

const parseMeets = (meets) => {
  if (!meets) return null;

  const clean = meets.replace("Horario:", "").trim();
  const [start, end] = clean.split("-");

  return { days: "M", start, end }; 
};

const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

export const overlaps = (course1, course2) => {
  if (!course1.meets || !course2.meets) return false;

  const c1 = parseMeets(course1.meets);
  const c2 = parseMeets(course2.meets);

  if (!c1 || !c2) return false;

  const start1 = timeToMinutes(c1.start);
  const end1 = timeToMinutes(c1.end);
  const start2 = timeToMinutes(c2.start);
  const end2 = timeToMinutes(c2.end);

  return start1 < end2 && start2 < end1;
};

export const hasConflict = (course, selected) =>
  selected.some(selectedCourse => overlaps(course, selectedCourse));