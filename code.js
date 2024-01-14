// Globals
const nav = document.getElementsByTagName('nav')[0];
const title = document.getElementById('label');
const today = document.getElementById('today');
const tomorrow = document.getElementById('tomorrow');
const provinces = document.getElementById('provinces');
const municipalities = document.getElementById('municipalities');

let provCod, provName, munCod, munName;

// -> Home
fetch('https://www.el-tiempo.net/api/json/v2/home')
.then(res =>res.json())
.then(home => {

  today.innerHTML = '';
  home.today.p.forEach(p => {
    today.innerHTML += `<p>${p}</p>`;
  });

  tomorrow.innerHTML = '';
  home.tomorrow.p.forEach(p => {
    tomorrow.innerHTML += `<p>${p}</p>`;
  });

  // Select: Provincies
  home.provincias.forEach(prov => {
    let province = document.createElement('option');
    province.value = prov.CODPROV;
    province.textContent = prov.NOMBRE_PROVINCIA;
    provinces.append(province);
  });

  provinces.addEventListener('change', (event) => {
    municipalities.innerHTML = '<option disabled selected>- Elige un municipio -</option>'; // Clean municipalities
    
    provName = provinces.querySelector('option:checked').textContent;
    title.textContent = `El tiempo en la provincia de ${provName}`;

    provCod = event.target.value;
    fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${provCod}`)
    .then(res =>res.json())
    .then(data => {
      // -> Province
      today.innerHTML = `<p>${data.today.p}</p>`;
      tomorrow.innerHTML = `<p>${data.tomorrow.p}</p>`;
      // Select: Municipalities
      fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${provCod}/municipios`)
      .then(res =>res.json())
      .then(data => {
        data.municipios.forEach(mun => {
          let municipality = document.createElement('option');
          municipality.value = mun.CODIGOINE.slice(0, 5);
          municipality.textContent = mun.NOMBRE;
          municipalities.append(municipality);
        });
      });
    });
  });

  // -> Municipalities
  municipalities.addEventListener('change', (event) => {
    munName = municipalities.querySelector('option:checked').textContent;
    title.textContent = `El tiempo en ${provName} - ${munName}`;

    munCod = event.target.value;
    console.log(munCod);
    fetch(`https://www.el-tiempo.net/api/json/v2/provincias/${provCod}/municipios/${munCod}`)
    .then(res =>res.json())
    .then(data => {
      today.innerHTML = `
        <!-- today -->
        <table>
          <thead>
            <tr>
              <th rowspan="2">Estado_cielo</th>
              <th rowspan="2">Humedad</th>
              <th rowspan="2">Lluvia</th>
              <th colspan="3">Temperatura</th>
            </tr>
            <tr>
              <th>Actual</th>
              <th>Min</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.stateSky.description}</td>
              <td>${data.humedad} %</td>
              <td>${data.lluvia} %</td>
              <td>${data.temperatura_actual} ºC</td>
              <td>${data.temperaturas.min} ºC</td>
              <td>${data.temperaturas.max} ºC</td>
            </tr>
          </tbody>
        </table>
      `;
      tomorrow.innerHTML = `
        <!-- tomorrow -->
        <table>
          <thead>
            <tr>
              <th rowspan="2">Humedad</th>
              <th rowspan="2">Prob. tormenta</th>
              <th rowspan="2">Prob. Precipitacion</th>
              <th colspan="2">Temperatura</th>
            </tr>
            <tr>
              <th>Min</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${Math.min(...data.pronostico.manana.humedad_relativa)} - ${Math.max(...data.pronostico.manana.humedad_relativa)} %</td>
              <td>${Math.min(...data.pronostico.manana.prob_tormenta)} - ${Math.max(...data.pronostico.manana.prob_tormenta)} %</td>
              <td>${Math.min(...data.pronostico.manana.prob_precipitacion)} - ${Math.max(...data.pronostico.manana.prob_precipitacion)} %</td>
              <td>${Math.min(...data.pronostico.manana.temperatura)} ºC</td>
              <td>${Math.max(...data.pronostico.manana.temperatura)} ºC</td>
            </tr>
          </tbody>
        </table>
      `;
    });
  });
});
