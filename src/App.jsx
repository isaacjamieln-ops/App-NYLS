import React from 'react';

// Datos JSON
const schedule = {
  title: "Northside Youth Soccer League App",
  
  courses: {
    F101: {
      id: "F101",
      meets: "MWF 11:00-11:50",
      title: "Computer Science: Concepts, Philosophy, and Connections"
    },
    F110: {
      id: "F110",
      meets: "MWF 10:00-10:50",
      title: "Intro Programming for non-majors"
    },
    S313: {
      id: "S313",
      meets: "TuTh 15:30-16:50",
      title: "Tangible Interaction Design and Learning"
    },
    S314: {
      id: "S314",
      meets: "TuTh 9:30-10:50",
      title: "Tech & Human Interaction"
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
