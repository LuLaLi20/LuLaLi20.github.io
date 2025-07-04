let missions = [];
let currentMission = 0;
let pyodideReady = false;
let pyodide = null;

// Cargar y preparar Pyodide (Python)
async function initPyodide() {
  pyodide = await loadPyodide();
  pyodideReady = true;
  document.getElementById('feedback').textContent = "¡Entorno Python listo!";
}

// Cargar misiones desde JSON
async function loadMissions() {
  const res = await fetch('missions.json');
  missions = await res.json();
}

function showMission(mission) {
  document.getElementById('missionText').textContent = `${mission.npc}: ${mission.mensaje}`;
  document.getElementById('feedback').textContent = "";
  document.getElementById('codeEditor').value = "";
}

// Validar la misión según la salida del código Python
async function validateMission(userCode, mission) {
  if (!pyodideReady) {
    return "Cargando entorno Python...";
  }
  let output = "";
  let result = false;
  try {
    // Capturar la salida de print
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);
    await pyodide.runPythonAsync(userCode);
    output = pyodide.runPython("sys.stdout.getvalue().strip()");
    // Validar usando la función especificada en la misión
    // IMPORTANTE: Solo para pruebas, eval puede ser peligroso si el JSON no es seguro
    result = eval(mission.validacion)(userCode, output);
  } catch (e) {
    return "Error en el código: " + e;
  }
  if (result) {
    return "¡Correcto! " + (output ? "Salida: " + output : "");
  } else {
    return "Inténtalo de nuevo. " + (output ? "Salida: " + output : "");
  }
}

document.getElementById('submitCode').onclick = async function() {
  const userCode = document.getElementById('codeEditor').value;
  const mission = missions[currentMission];
  // La función de validación debe retornar true/false
  let feedback = await validateMission(userCode, mission);
  document.getElementById('feedback').textContent = feedback;
  if (feedback.startsWith("¡Correcto!")) {
    currentMission++;
    if (currentMission < missions.length) {
      setTimeout(() => {
        showMission(missions[currentMission]);
      }, 1200);
    } else {
      setTimeout(() => {
        document.getElementById('missionText').textContent = "¡Has completado todas las misiones!";
        document.getElementById('feedback').textContent = "";
      }, 1200);
    }
  }
};

window.onload = async function() {
  await loadMissions();
  await initPyodide();
  showMission(missions[currentMission]);
};
