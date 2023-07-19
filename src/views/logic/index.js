console.log("Aquí andamos");

function renderWeather(weather) {
  console.log("wenas profe :>");
  var contenedorResultados = document.querySelector("#weatherResults");

  contenedorResultados.innerHTML = "";
  //crear h2 para el nombre de la ciudad
  var ciudad = document.createElement("h2");
  ciudad.textContent = weather.name;
  contenedorResultados.append(ciudad);
  // crear p para la humedad, viento, descripción y temp
  var temperatura = document.createElement("p");
  temperatura.innerHTML = "Temperatura: <b>" + weather.main.temp + " °C </b>";
  contenedorResultados.append(temperatura);

  var humedad = document.createElement("p");
  humedad.innerHTML = "Humedad: <b>" + weather.main.humidity + " %</b>";
  contenedorResultados.append(humedad);

  var clima = document.createElement("p");
  clima.innerHTML = "Clima: <b>" + weather.weather[0].description + "</b>";
  contenedorResultados.append(clima);

  //almacenando las variables que se van a usar entre páginas en localStorage
  //para que nunca se pierda su varlor
  var descripcionActual = weather.weather[0].description; //descripción
  localStorage.setItem("descripcionActualGlobal", descripcionActual);
  console.log(localStorage.getItem("descripcionActualGlobal"));

  var ciudadActual = weather.name; //ciudad
  localStorage.setItem("ciudadActualGlobal", ciudadActual);
  console.log(localStorage.getItem("ciudadActualGlobal"));
  
  localStorage.setItem("consultaHecha", true);
}

async function fetchWeather(consulta) {
  const urlApi =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    consulta +
    "&appid=fbe5057281a1b42134ab417cd59eb2e8&lang=sp&units=metric";

  const response = await fetch(urlApi);
  const jsonData = await response.json();
  console.log(jsonData);
  renderWeather(jsonData);
}

function publicarComentario(comentario) {
  const descripcionActual = localStorage.getItem("descripcionActualGlobal");
  const ciudadActual = localStorage.getItem("ciudadActualGlobal");
  const hoy = new Date();
  const fechaHoraActual = hoy.toLocaleString();
  const nombreUsuario = document.getElementById("nombreUsuario").value;
  localStorage.setItem("consultaHecha", false); 

  var espacioComentarios = document.querySelector("#espacioComentarios");

  var comentarioIndividual =
    `
    <div class="card mb-1">
        <div class="card-header">
            ` + fechaHoraActual + ` <b>Nombre:</b> ` + nombreUsuario + `
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><b>` + descripcionActual + "</b> en <b>" + ciudadActual +`</b></li>
            <li class="list-group-item">` + comentario + `</li>
        </ul>
    </div>
    `;

  espacioComentarios.insertAdjacentHTML("afterbegin", comentarioIndividual);
}

function seRealizoConsulta(){
  if( localStorage.getItem("consultaHecha") == "true") {
    return true;
  } else {
    return false;
  }
  
}
