import React, { useEffect, useState } from "react";

// --------------------
// TUS DATOS ORIGINALES
// --------------------
const schedule = {
  title: "Northside Youth Soccer League App",
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
// COMPONENTES
// --------------------

const Banner = ({ title }) => (
  <div className="bg-dark text-white text-center py-4 mb-4 rounded">
    <h1 className="fw-bold">{title}</h1>
  </div>
);

const Card = ({ title, subtitle, extra }) => (
  <div className="col-md-6 col-lg-4 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-primary">{title}</h5>
        <p className="card-text">{subtitle}</p>
        <p className="card-text">
          <small className="text-muted">{extra}</small>
        </p>
      </div>
    </div>
  </div>
);

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
    <label className="btn btn-success m-1 p-2" htmlFor={term}>
      {term}
    </label>
  </>
);

const TermSelector = ({ term, setTerm }) => (
  <div className="btn-group mb-4">
    {Object.values(terms).map(value => (
      <TermButton
        key={value}
        term={value}
        setTerm={setTerm}
        checked={value === term}
      />
    ))}
  </div>
);

// --------------------
// APP
// --------------------

function App() {
  const [externalCourses, setExternalCourses] = useState([]);
  const [externalTitle, setExternalTitle] = useState("");
  const [term, setTerm] = useState("Fall"); // 👈 estado del término

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

  // 👇 FILTRADO POR TERMINO
  const filteredCourses = externalCourses.filter(
    course => course.term === term
  );

  return (
    <div className="container mt-4">

      <Banner title={schedule.title} />

      {/* ------------------ */}
      {/* TUS PARTIDOS */}
      {/* ------------------ */}
      <h2 className="mb-3">Partidos Programados</h2>
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

      <hr className="my-5" />

      {/* ------------------ */}
      {/* CURSOS FILTRADOS */}
      {/* ------------------ */}

      <h2 className="mb-3">{externalTitle}</h2>

      <TermSelector term={term} setTerm={setTerm} />

      <div className="row">
        {filteredCourses.map((course, index) => (
          <Card
            key={index}
            title={`${course.term} ${course.number}`}
            subtitle={course.title}
            extra={course.meets}
          />
        ))}
      </div>

    </div>
  );
}

export default App;