import React from 'react';

// Datos JSON
const schedule = {
  title: "Northside Youth Soccer League App",
  
  courses: {
    Partido1: {
      id: "Partido 1: Mexico vs Inglaterra ",
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
      id: "Partido 4: España vs Francia ",
      meets: "Horario: 9:30-10:50",
      title: "La gran final"
    }
  }
};

// Componente Banner
const Banner = ({ title }) => (
  <h1>{title}</h1>
);

// Componente Course
const Course = ({ course }) => (
  <div style={{ 
    border: "1px solid gray", 
    padding: "10px", 
    margin: "10px",
    borderRadius: "8px"
  }}>
    <h2>{course.id}</h2>
    <p>{course.title}</p>
    <p><strong>{course.meets}</strong></p>
  </div>
);

// Lista de cursos
const CourseList = ({ courses }) => (
  <div>
    {Object.values(courses).map(course => (
      <Course key={course.id} course={course} />
    ))}
  </div>
);

// Componente principal
function App() {
  return (
    <div>
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
    </div>
  );
}

export default App;
