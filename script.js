const curriculumData = {
  "Ciclo 1": [
    "Atención integral",
    "Desarrollo humano",
    "English I",
    "Fundamentos de la promoción de salud",
    "Integración de estructura y función del organismo humano",
    "Lenguaje I"
  ],
  "Ciclo 2": {
    "English II": ["English I"],
    "Integración morfofuncional del sistema nervioso": ["Integración de estructura y función del organismo humano"],
    "Lenguaje II": ["Lenguaje I"],
    "Pensamiento matemático": [],
    "Procesos químico-biológicos y nutrición": ["Atención integral"],
    "Práctica y profesionalismo médico I": []
  },
  "Ciclo 3": {
    "Bioestadística": ["Pensamiento matemático"],
    "Bioquímica y biología molecular": ["Procesos químico-biológicos y nutrición"],
    "English III": ["English II"],
    "Integración morfofuncional del sistema cardio-circulatorio": ["Integración morfofuncional del sistema nervioso"],
    "Integración morfofuncional del sistema respiratorio": ["Integración morfofuncional del sistema nervioso"],
    "Nutrición y estilos de vida saludable": ["Procesos químico-biológicos y nutrición"],
    "Práctica y profesionalismo médico II": ["Práctica y profesionalismo médico I"]
  },
  // Aquí continuarías con los demás ciclos 4–14, igual que en los anteriores
};

let courseStates = JSON.parse(localStorage.getItem("courseStates")) || {};

function renderCurriculum() {
  const container = document.getElementById("curriculum");
  container.innerHTML = "";

  Object.entries(curriculumData).forEach(([cycle, courses]) => {
    const cycleDiv = document.createElement("div");
    cycleDiv.className = "cycle";
    cycleDiv.innerHTML = `<h2>${cycle}</h2>`;

    const coursesDiv = document.createElement("div");
    coursesDiv.className = "courses";

    Object.entries(Array.isArray(courses) ? Object.fromEntries(courses.map(c => [c, []])) : courses).forEach(([course, prereqs]) => {
      const courseDiv = document.createElement("div");
      courseDiv.className = "course";
      courseDiv.textContent = course;
      courseDiv.dataset.name = course;
      courseDiv.dataset.prereqs = JSON.stringify(prereqs);

      const state = courseStates[course] || "locked";
      courseDiv.classList.add(state);

      courseDiv.addEventListener("click", () => handleClick(courseDiv));
      coursesDiv.appendChild(courseDiv);
    });

    cycleDiv.appendChild(coursesDiv);
    container.appendChild(cycleDiv);
  });
}

function handleClick(el) {
  const course = el.dataset.name;
  const current = courseStates[course] || "locked";

  let next;
  if (current === "locked" || current === "unlocked") next = "taken";
  else if (current === "taken") next = "simulated";
  else next = prerequisitesMet(course) ? "unlocked" : "locked";

  courseStates[course] = next;
  saveProgress();
  updateStates();
}

function prerequisitesMet(course) {
  const allCourses = document.querySelectorAll(".course");
  const prereqs = JSON.parse(document.querySelector(`[data-name="${course}"]`).dataset.prereqs || "[]");

  return prereqs.every(p => courseStates[p] === "taken");
}

function updateStates() {
  const allCourses = document.querySelectorAll(".course");
  allCourses.forEach(el => {
    const course = el.dataset.name;
    const prereqs = JSON.parse(el.dataset.prereqs || "[]");

    if (!courseStates[course]) {
      courseStates[course] = prerequisitesMet(course) ? "unlocked" : "locked";
    }

    el.className = "course " + courseStates[course];
  });
}

function saveProgress() {
  localStorage.setItem("courseStates", JSON.stringify(courseStates));
}

document.getElementById("reset").addEventListener("click", () => {
  if (confirm("¿Estás segura de que deseas reiniciar tu progreso?")) {
    localStorage.removeItem("courseStates");
    courseStates = {};
    renderCurriculum();
    updateStates();
  }
});

renderCurriculum();
updateStates();
