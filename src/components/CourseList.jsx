// src/components/CourseList.jsx
import React from "react";

const CourseList = ({ courses, selected, setSelected, colors, CourseComponent }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No hay cursos disponibles para este término</p>
      </div>
    );
  }

  return (
    <div className="row">
      {courses.map((course, index) => (
        <div key={index} className="col-md-6 col-lg-4 mb-3">
          <CourseComponent
            course={course}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseList;