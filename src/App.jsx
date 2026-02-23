import React from 'react';

// Datos JSON
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

// Banner
const Banner = ({ title }) => (
  <div className="bg-dark text-white text-center py-4 mb-4 rounded">
    <h1 className="fw-bold">{title}</h1>
  </div>
);

// Tarjeta individual
const Course = ({ course }) => (
  <div className="col-md-6 col-lg-4 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-primary">{course.id}</h5>
        <p className="card-text">{course.title}</p>
        <p className="card-text">
          <small className="text-muted">{course.meets}</small>
        </p>
      </div>
    </div>
  </div>
);

// Lista de cursos
const CourseList = ({ courses }) => (
  <div className="row">
    {Object.values(courses).map(course => (
      <Course key={course.id} course={course} />
    ))}
  </div>
);

// Componente principal
function App() {
  return (
    <div className="container mt-4">
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
    </div>
  );
}

export default App;
