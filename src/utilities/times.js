// src/utilities/times.js

// Función para transformar datos de Firebase al formato que espera la App
export const addScheduleTimes = (schedule) => {
  console.log("🔄 Transformando schedule:", schedule);
  
  if (!schedule) {
    console.log("⚠️ Schedule es null o undefined");
    return { title: "CS Courses", courses: [] };
  }
  
  // Si schedule.courses es un objeto (como viene de Firebase), convertirlo a arreglo
  let coursesArray = [];
  
  if (schedule.courses && typeof schedule.courses === 'object') {
    console.log("📚 Courses es un objeto, convirtiendo a arreglo");
    // Convertir objeto de Firebase a arreglo
    coursesArray = Object.keys(schedule.courses).map(key => {
      const course = schedule.courses[key];
      return {
        ...course,
        id: key,
        key: key
      };
    });
    console.log(`✅ Convertidos ${coursesArray.length} cursos`);
  } else if (Array.isArray(schedule.courses)) {
    console.log("📚 Courses ya es un arreglo");
    coursesArray = schedule.courses;
  } else {
    console.log("⚠️ Courses no es ni objeto ni arreglo:", schedule.courses);
  }
  
  const result = {
    title: schedule.title || "CS Courses for 2018-2019",
    courses: coursesArray
  };
  
  console.log("✨ Resultado final:", result);
  return result;
};

// (El resto de tus funciones auxiliares: parseMeets, timeToMinutes, overlaps, hasConflict)
export const parseMeets = (meets) => {
  if (!meets) return null;
  if (meets.startsWith("Horario:")) {
    meets = meets.replace("Horario:", "").trim();
  }
  const [days, time] = meets.split(" ");
  if (!time) {
    const [start, end] = meets.split("-");
    return { days: "LMD", start, end };
  }
  const [start, end] = time.split("-");
  return { days, start, end };
};

export const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

export const overlaps = (course1, course2) => {
  if (!course1.meets || !course2.meets) return false;
  const c1 = parseMeets(course1.meets);
  const c2 = parseMeets(course2.meets);
  if (!c1 || !c2) return false;
  if (![...c1.days].some(d => c2.days.includes(d))) return false;
  const start1 = timeToMinutes(c1.start);
  const end1 = timeToMinutes(c1.end);
  const start2 = timeToMinutes(c2.start);
  const end2 = timeToMinutes(c2.end);
  return start1 < end2 && start2 < end1;
};

export const hasConflict = (course, selected) => {
  return selected.some(selectedCourse => overlaps(course, selectedCourse));
};