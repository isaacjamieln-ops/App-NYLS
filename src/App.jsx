import React, { useEffect, useState } from "react";
import CourseList from "./components/CourseList.jsx";

// --------------------
// TUS DATOS ORIGINALES
// --------------------
const schedule = {
  title: "Aplicacion de Liga de Futbol Soccer Juvenil de Northside",
  courses: {
    Partido1: {
      id: "Partido 1: Mexico vs Inglaterra",
      meets: "Horario: 11:00-11:50",
      title: "Inauguracion de la CHAMPIONS"
    },
    Partido2: {
      id: "Partido 2: Russia vs Alemania",
      meets: "Horario: 10:00-10:50",
      title: "Primer partido"
    },
    Partido3: {
      id: "Partido 3: Suiza vs Irlanda",
      meets: "Horario: 15:30-16:50",
      title: "Reencuentro de titanes"
    },
    Partido4: {
      id: "Partido 4: España vs Francia",
      meets: "Horario: 9:30-10:50",
      title: "La gran final"
    }
  }
};

// --------------------
// TERMINOS
// --------------------
const terms = {
  Fall: "Fall",
  Winter: "Winter",
  Spring: "Spring"
};

// --------------------
// PALETA DE COLORES
// --------------------
const colors = {
  jadeLight: "#00A86B",
  jadeMedium: "#008B5E",
  jadeDark: "#006B45",
  jadeSoft: "#90EE90",
  jadeVerySoft: "#E8F5E9",
  gold: "#D4AF37",
  background: "#FFFFFF",
  cardBg: "#F8F9FA",
  textDark: "#212529",
  textLight: "#6C757D",
  border: "#E9ECEF"
};

// --------------------
// COMPONENTES
// --------------------

const Banner = ({ title }) => (
  <div className="text-center py-5 mb-5 rounded shadow-sm"
       style={{
         background: `linear-gradient(135deg, ${colors.jadeLight}, ${colors.jadeMedium})`,
         color: "white",
         transition: "all 0.3s ease",
         cursor: "pointer",
         border: "none"
       }}
       onMouseEnter={(e) => {
         e.currentTarget.style.background = `linear-gradient(135deg, ${colors.jadeMedium}, ${colors.jadeDark})`;
         e.currentTarget.style.transform = "scale(1.02)";
       }}
       onMouseLeave={(e) => {
         e.currentTarget.style.background = `linear-gradient(135deg, ${colors.jadeLight}, ${colors.jadeMedium})`;
         e.currentTarget.style.transform = "scale(1)";
       }}>
    <h1 className="fw-bold display-5">{title}</h1>
  </div>
);

// Componente Card para los partidos
const Card = ({ title, subtitle, extra }) => (
  <div className="col-md-6 col-lg-4 mb-4">
    <div className="card h-100 shadow-sm"
         style={{
           backgroundColor: colors.cardBg,
           color: colors.textDark,
           transition: "all 0.3s ease",
           cursor: "pointer",
           borderRadius: "12px",
           border: `2px solid ${colors.jadeLight}`
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = "translateY(-8px)";
           e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 168, 107, 0.15)";
           e.currentTarget.style.backgroundColor = "#FFFFFF";
           e.currentTarget.style.borderColor = colors.jadeDark;
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = "translateY(0)";
           e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
           e.currentTarget.style.backgroundColor = colors.cardBg;
           e.currentTarget.style.borderColor = colors.jadeLight;
         }}>
      <div className="card-body">
        <h5 className="card-title fw-bold" style={{ color: colors.jadeMedium }}>{title}</h5>
        <p className="card-text" style={{ color: colors.textDark }}>{subtitle}</p>
        <p className="card-text">
          <small style={{ color: colors.textLight }}>{extra}</small>
        </p>
      </div>
    </div>
  </div>
);

// --------------------
// FUNCIONES AUXILIARES PARA DETECCIÓN DE CONFLICTOS
// --------------------

const getCourseTerm = (course) => course.term;
const getCourseNumber = (course) => course.number;

const toggle = (course, selected) =>
  selected.includes(course)
    ? selected.filter(x => x !== course)
    : [...selected, course];

const parseMeets = (meets) => {
  if (!meets) return null;
  // Maneja formato "Horario: 11:00-11:50" de tus partidos
  if (meets.startsWith("Horario:")) {
    meets = meets.replace("Horario:", "").trim();
  }
  const [days, time] = meets.split(" ");
  // Si no hay días, asumimos que es un horario sin días específicos
  if (!time) {
    const [start, end] = meets.split("-");
    return { days: "LMD", start, end }; // LMD = Lunes a Domingo (todos los días)
  }
  const [start, end] = time.split("-");
  return { days, start, end };
};

const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

const overlaps = (course1, course2) => {
  if (!course1.meets || !course2.meets) return false;

  const c1 = parseMeets(course1.meets);
  const c2 = parseMeets(course2.meets);
  
  if (!c1 || !c2) return false;

  // Si no comparten días → no conflicto
  if (![...c1.days].some(d => c2.days.includes(d))) return false;

  const start1 = timeToMinutes(c1.start);
  const end1 = timeToMinutes(c1.end);
  const start2 = timeToMinutes(c2.start);
  const end2 = timeToMinutes(c2.end);

  return start1 < end2 && start2 < end1;
};

const hasConflict = (course, selected) => {
  return selected.some(selectedCourse => overlaps(course, selectedCourse));
};

// --------------------
// COMPONENTE COURSE (con detección de conflictos)
// --------------------
const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);

  const style = {
    backgroundColor: isDisabled
      ? "#f0f0f0"
      : isSelected
      ? colors.jadeVerySoft
      : colors.cardBg,
    color: colors.textDark,
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    borderRadius: "12px",
    border: `2px solid ${
      isSelected ? colors.jadeDark : colors.jadeLight
    }`,
    height: "100%",
    opacity: isDisabled ? 0.6 : 1
  };

  return (
    <div
      className="card h-100 shadow-sm"
      style={style}
      onClick={!isDisabled ? () => setSelected(toggle(course, selected)) : null}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 168, 107, 0.15)";
          e.currentTarget.style.borderColor = colors.jadeDark;
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = isSelected ? colors.jadeDark : colors.jadeLight;
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = colors.cardBg;
        }
      }}
    >
      <div className="card-body">
        <h5 className="card-title fw-bold" style={{ color: isSelected ? colors.jadeDark : colors.jadeMedium }}>
          {getCourseTerm(course)} {getCourseNumber(course)}
        </h5>
        <p className="card-text">{course.title}</p>
        <p className="card-text">
          <small style={{ color: colors.textLight }}>{course.meets || "Horario no disponible"}</small>
        </p>
        {isDisabled && (
          <div className="text-danger fw-bold mt-2">
            ⚠️ Conflicto de horario
          </div>
        )}
      </div>
    </div>
  );
};

// --------------------
// BOTONES DE TERMINO
// --------------------

const TermButton = ({ term, setTerm, checked }) => (
  <>
    <input
      type="radio"
      id={term}
      className="btn-check"
      checked={checked}
      autoComplete="off"
      onChange={() => setTerm(term)}
    />
    <label
      className="btn m-2 px-4 py-2"
      htmlFor={term}
      style={{
        backgroundColor: checked ? colors.jadeLight : "transparent",
        color: checked ? "white" : colors.jadeMedium,
        border: `2px solid ${colors.jadeLight}`,
        transition: "all 0.3s ease",
        transform: checked ? "scale(1.05)" : "scale(1)",
        fontWeight: "bold",
        borderRadius: "25px"
      }}
      onMouseEnter={(e) => {
        if (!checked) {
          e.currentTarget.style.backgroundColor = colors.jadeLight + "15";
          e.currentTarget.style.transform = "scale(1.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!checked) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
    >
      {term}
    </label>
  </>
);

const TermSelector = ({ term, setTerm }) => (
  <div className="btn-group mb-4">
    {Object.values(terms).map(value => (
      <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
    ))}
  </div>
);

// --------------------
// APP PRINCIPAL
// --------------------

function App() {
  const [externalCourses, setExternalCourses] = useState([]);
  const [externalTitle, setExternalTitle] = useState("");
  const [term, setTerm] = useState("Fall");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [term]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(
          "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php"
        );
        const data = await response.json();
        setExternalTitle(data.title);
        setExternalCourses(Object.values(data.courses));
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      }
    }
    fetchCourses();
  }, []);

  const filteredCourses = externalCourses.filter(course => course.term === term);

  return (
    <div style={{ 
      background: colors.background,
      minHeight: "100vh", 
      color: colors.textDark,
      margin: 0,
      padding: 0,
      width: "100%",
      maxWidth: "100%",
      overflowX: "hidden",
      position: "relative"
    }}>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 50% 50%, ${colors.jadeLight}08 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 0
      }}></div>

      <div className="container-fluid py-5" style={{ position: "relative", zIndex: 1 }}>
        <Banner title={schedule.title} />

        {/* ⚽ PARTIDOS */}
        <h2 className="mb-4 fw-bold"
            style={{
              color: colors.jadeMedium,
              borderLeft: `5px solid ${colors.jadeLight}`,
              paddingLeft: "15px",
              fontSize: "2.2rem"
            }}>
          ⚽ Partidos Programados
        </h2>

        <div className="row">
          {Object.values(schedule.courses).map((course, index) => (
            <Card
              key={index}
              title={course.id}
              subtitle={course.title}
              extra={course.meets}
            />
          ))}
        </div>

        <hr className="my-5" style={{ 
          borderColor: colors.jadeLight + "40",
          height: "2px",
          backgroundColor: colors.jadeLight + "20",
          border: "none"
        }} />

        {/* 📚 CURSOS CON DETECCIÓN DE CONFLICTOS */}
        <h2 className="mb-4 fw-bold"
            style={{
              color: colors.jadeMedium,
              borderLeft: `5px solid ${colors.jadeLight}`,
              paddingLeft: "15px",
              fontSize: "2.2rem"
            }}>
          {externalTitle}
        </h2>

        <TermSelector term={term} setTerm={setTerm} />

        <CourseList
          courses={filteredCourses}
          selected={selected}
          setSelected={setSelected}
          colors={colors}
          CourseComponent={Course}
        />

      </div>
    </div>
  );
}

export default App;