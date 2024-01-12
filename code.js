// Globales
const title = document.getElementById('label');
const today = document.getElementById('today');
const tomorrow = document.getElementById('tomorrow');

// -> Home
fetch('https://www.el-tiempo.net/api/json/v2/home')
.then(res =>res.json())
.then(data => {
  today.innerHTML = '';
  data.today.p.forEach(p => {
    today.innerHTML += `<p>${p}</p>`;
  });
  tomorrow.innerHTML = '';
  data.tomorrow.p.forEach(p => {
    tomorrow.innerHTML += `<p>${p}</p>`;
  });
  // Select Provincias
  fetch('https://www.el-tiempo.net/api/json/v2/provincias')
  .then(res =>res.json())
  .then(data => {
    const nav = document.getElementsByTagName('nav')[0];
    nav.innerHTML = ''; // Vaciar la barra de navegacion
    const provinces = document.createElement('select');
    provinces.name = 'provinces';
    provinces.id = 'provinces';
    provinces.addEventListener('change', (event) => {
      event.target
      fetch(`https://www.el-tiempo.net/api/json/v2/provincias/[CODPROV]/municipios`)
      .then(res =>res.json())
      .then(data => {
      });
    });
    // Options
    data.provincias.forEach(prov => {
      let province = document.createElement('option');
      province.value = prov.CODPROV;
      province.textContent = prov.NOMBRE_PROVINCIA;
      provinces.append(province);
    });
    nav.append(provinces);
  });
});
