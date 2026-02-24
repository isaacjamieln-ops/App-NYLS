import React from "react";
import { toggle, hasConflict } from "../utilities/times";

const Course = ({ course, selected, setSelected, colors }) => {

  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);

  const style = {
    backgroundColor: isDisabled
      ? "#f0f0f0"
      : isSelected
      ? colors.jadeVerySoft
      : colors.cardBg,
    cursor: isDisabled ? "not-allowed" : "pointer",
    borderRadius: "12px",
    border: `2px solid ${
      isSelected ? colors.jadeMedium : colors.jadeLight
    }`,
    transition: "all 0.3s ease",
    opacity: isDisabled ? 0.7 : 1
  };

  return (
    <div
      className="card h-100 shadow-sm"
      style={style}
      onClick={
        isDisabled
          ? null
          : () => setSelected(toggle(course, selected))
      }
    >
      <div className="card-body">
        <h5
          className="card-title fw-bold"
          style={{ color: colors.jadeMedium }}
        >
          {course.id}
        </h5>

        <p className="card-text">{course.title}</p>

        <p className="card-text">
          <small>{course.meets}</small>
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

export default Course;