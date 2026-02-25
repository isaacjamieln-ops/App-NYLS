import React, { useEffect, useState } from "react";
import CourseList from "./components/CourseList.jsx";
import { 
  useData,
  signInWithGoogle,
  firebaseSignOut,
  useUserState,
  writeData,
  updateData 
} from "./firebase";
import { addScheduleTimes } from "./utilities/times";

// --------------------
// TUS DATOS ORIGINALES (PARTIDOS)
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
  jadeVerySoft: "#6cb364",
  gold: "#D4AF37",
  background: "#FFFFFF",
  cardBg: "#F8F9FA",
  textDark: "#212529",
  textLight: "#6C757D",
  border: "#E9ECEF"
};

// --------------------
// MODAL DE EDICIÓN DE CURSO
// --------------------
const CourseEditModal = ({ isOpen, onClose, course, onSave }) => {
  const [formData, setFormData] = useState({
    term: "",
    number: "",
    title: "",
    meets: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (course) {
      setFormData({
        term: course.term || "",
        number: course.number || "",
        title: course.title || "",
        meets: course.meets || ""
      });
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.term || !formData.number || !formData.title) {
      setError("Los campos Term, Number y Title son obligatorios");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">✏️ Editar Curso</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
              <label className="form-label">Término</label>
              <select 
                className="form-control"
                name="term"
                value={formData.term}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Número</label>
              <input
                type="text"
                className="form-control"
                name="number"
                value={formData.number}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Horario</label>
              <input
                type="text"
                className="form-control"
                name="meets"
                value={formData.meets}
                onChange={handleChange}
                placeholder="Ej: MWF 10:00-10:50"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-success" onClick={handleSubmit}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------
// MODAL DE EDICIÓN GENERAL
// --------------------
const EditModal = ({ isOpen, onClose, onSave, currentData }) => {
  const [jsonData, setJsonData] = useState(JSON.stringify(currentData, null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentData) {
      setJsonData(JSON.stringify(currentData, null, 2));
    }
  }, [currentData]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonData);
      onSave(parsed);
      onClose();
    } catch (e) {
      setError("JSON inválido: " + e.message);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">✏️ Editar Base de Datos</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="text-muted">Modifica el JSON directamente. Los cambios se guardarán en Firebase.</p>
            <textarea
              className="form-control font-monospace"
              rows="15"
              value={jsonData}
              onChange={(e) => {
                setJsonData(e.target.value);
                setError("");
              }}
            />
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-success" onClick={handleSave}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------
// COMPONENTES PRINCIPALES
// --------------------

const Banner = ({ title, user, onEdit }) => (
  <div className="text-center py-5 mb-5 rounded shadow-sm position-relative"
       style={{
         background: `linear-gradient(135deg, ${colors.jadeLight}, ${colors.jadeMedium})`,
         color: "white",
         transition: "all 0.3s ease",
         cursor: user ? "pointer" : "default",
         border: user ? "2px solid white" : "none"
       }}
       onDoubleClick={user ? onEdit : null}>
    <h1 className="fw-bold display-5">{title}</h1>
    
    {user && (
      <button
        onClick={onEdit}
        className="btn btn-light btn-sm position-absolute top-0 end-0 m-3"
        style={{ borderRadius: "20px" }}
      >
        ✏️ Editar Horarios
      </button>
    )}
  </div>
);

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
// FUNCIONES AUXILIARES
// --------------------

const getCourseTerm = (course) => course.term;
const getCourseNumber = (course) => course.number;

const toggle = (course, selected) =>
  selected.includes(course)
    ? selected.filter(x => x !== course)
    : [...selected, course];

const parseMeets = (meets) => {
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
// COMPONENTE COURSE CON DOBLE CLICK PARA EDITAR (CORREGIDO)
// --------------------
const Course = ({ course, selected, setSelected, user, onEdit }) => {
  const isSelected = selected.some(c => c.number === course.number);
  const isDisabled = !isSelected && selected.some(c => overlaps(course, c));
  const [clickTimeout, setClickTimeout] = useState(null);

  const toggleCourse = () => {
    if (isSelected) {
      setSelected(selected.filter(c => c.number !== course.number));
    } else {
      setSelected([...selected, course]);
    }
  };

  const handleClick = () => {
    if (isDisabled) return;
    
    if (user) {
      // Si hay usuario, esperamos para ver si es doble click
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
      }
      
      const timeout = setTimeout(() => {
        toggleCourse();
        setClickTimeout(null);
      }, 250); // Espera 250ms para ver si es doble click
      
      setClickTimeout(timeout);
    } else {
      // Si no hay usuario, ejecuta toggle inmediatamente
      toggleCourse();
    }
  };

  const handleDoubleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    
    if (user) {
      onEdit(course);
    }
  };

  const style = {
    backgroundColor: isSelected
      ? colors.jadeVerySoft
      : isDisabled
      ? "#f0f0f0"
      : colors.cardBg,
    color: colors.textDark,
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    borderRadius: "12px",
    border: `2px solid ${
      isSelected ? colors.jadeDark : colors.jadeLight
    }`,
    height: "100%",
    opacity: isDisabled ? 0.6 : 1,
    boxShadow: isSelected
      ? "0 0 20px rgba(0, 168, 107, 0.4)"
      : "0 4px 12px rgba(0,0,0,0.05)",
    position: "relative"
  };

  return (
    <div
      className="card h-100 shadow-sm"
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = isSelected
            ? "0 0 25px rgba(0, 168, 107, 0.6)"
            : "0 15px 30px rgba(0, 168, 107, 0.15)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isSelected
          ? "0 0 20px rgba(0, 168, 107, 0.4)"
          : "0 4px 12px rgba(0,0,0,0.05)";
      }}
    >
      {user && (
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-warning text-dark" style={{ fontSize: "0.7rem" }}>
            Doble click para editar
          </span>
        </div>
      )}
      <div className="card-body">
        <h5
          className="card-title fw-bold"
          style={{ color: isSelected ? colors.jadeDark : colors.jadeMedium }}
        >
          {getCourseTerm(course)} {getCourseNumber(course)}
        </h5>
        <p className="card-text">{course.title}</p>
        <p className="card-text">
          <small style={{ color: colors.textLight }}>
            {course.meets || "Horario no disponible"}
          </small>
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
// BOTONES
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

const SignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button 
      className="btn btn-success btn-sm px-4"
      onClick={handleSignIn}
      disabled={isLoading}
      style={{ borderRadius: "25px" }}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Cargando...
        </>
      ) : (
        <>
          <i className="bi bi-google me-2"></i>
          Iniciar sesión con Google
        </>
      )}
    </button>
  );
};

const SignOutButton = () => (
  <button 
    className="btn btn-outline-danger btn-sm px-4"
    onClick={firebaseSignOut}
    style={{ borderRadius: "25px" }}
  >
    <i className="bi bi-box-arrow-right me-2"></i>
    Cerrar sesión
  </button>
);

const EditButton = ({ onEdit, user }) => {
  if (!user) return null;
  
  return (
    <button
      onClick={onEdit}
      className="btn btn-primary btn-sm ms-3 px-4"
      style={{ borderRadius: "25px" }}
    >
      ✏️ Editar JSON
    </button>
  );
};

const TermSelector = ({ term, setTerm, user, onEdit }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
      <div className="btn-group">
        {Object.values(terms).map(value => (
          <TermButton 
            key={value}
            term={value}
            setTerm={setTerm}
            checked={value === term}
          />
        ))}
      </div>
      
      <div className="d-flex gap-2 mt-2 mt-md-0">
        {user ? (
          <>
            <span className="badge bg-light text-dark p-2 align-self-center">
              👤 {user.email}
            </span>
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
        
        <EditButton onEdit={onEdit} user={user} />
      </div>
    </div>
  );
};

// --------------------
// APP PRINCIPAL
// --------------------

function App() {
  const [scheduleData, loading, error] = useData('/', addScheduleTimes);
  const [user] = useUserState();
  const [term, setTerm] = useState("Fall");
  const [selected, setSelected] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCourseEditModalOpen, setIsCourseEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    console.log("👤 Estado de autenticación:", user);
  }, [user]);

  // Obtener datos de Firebase
  const externalTitle = scheduleData?.title || "CS Courses for 2018-2019";
  const externalCourses = scheduleData?.courses
    ? Object.values(scheduleData.courses)
    : [];

  // Filtrar por término
  const filteredCourses = externalCourses.filter(course => course.term === term);

  // Resetear selección cuando cambia el término
  useEffect(() => {
    setSelected([]);
  }, [term]);

  // Función para guardar cambios en Firebase (edición general)
  const handleSaveData = (newData) => {
    if (!user) {
      alert("Debes iniciar sesión para modificar la base de datos");
      return;
    }
    
    writeData('/', newData)
      .then(() => {
        alert("✅ Datos guardados correctamente");
      })
      .catch(error => {
        alert("❌ Error al guardar: " + error.message);
      });
  };

  // Función para guardar cambios en un curso específico
  const handleSaveCourse = (updatedCourse) => {
    if (!user || !scheduleData || !scheduleData.courses) return;

    // Encontrar la clave del curso en el objeto
    const courseKey = Object.keys(scheduleData.courses).find(
      key => scheduleData.courses[key].number === editingCourse.number
    );

    if (!courseKey) return;

    const newData = {
      ...scheduleData,
      courses: {
        ...scheduleData.courses,
        [courseKey]: updatedCourse
      }
    };

    writeData('/', newData)
      .then(() => {
        alert("✅ Curso actualizado correctamente");
        setIsCourseEditModalOpen(false);
      })
      .catch(error => {
        alert("❌ Error al guardar: " + error.message);
      });
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div style={{ background: colors.background, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando cursos desde Firebase...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay
  if (error) {
    return (
      <div style={{ background: colors.background, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="text-center text-danger">
          <h3>Error al cargar datos</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

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
        <Banner 
          title={schedule.title} 
          user={user}
          onEdit={() => setIsEditModalOpen(true)}
        />

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

        {/* 📚 CURSOS DESDE FIREBASE */}
        <h2 className="mb-4 fw-bold"
            style={{
              color: colors.jadeMedium,
              borderLeft: `5px solid ${colors.jadeLight}`,
              paddingLeft: "15px",
              fontSize: "2.2rem"
            }}>
          {externalTitle}
        </h2>

        <TermSelector 
          term={term} 
          setTerm={setTerm} 
          user={user}
          onEdit={() => setIsEditModalOpen(true)}
        />

        <CourseList
          courses={filteredCourses}
          selected={selected}
          setSelected={setSelected}
          colors={colors}
          CourseComponent={(props) => (
            <Course 
              {...props} 
              user={user} 
              onEdit={(course) => {
                setEditingCourse(course);
                setIsCourseEditModalOpen(true);
              }}
            />
          )}
        />

        {/* Modal de edición general */}
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveData}
          currentData={scheduleData}
        />

        {/* Modal de edición de curso individual */}
        <CourseEditModal
          isOpen={isCourseEditModalOpen}
          onClose={() => setIsCourseEditModalOpen(false)}
          course={editingCourse}
          onSave={handleSaveCourse}
        />

      </div>
    </div>
  );
}

export default App;