// Загружает все тексты и зоны из XML и подставляет их на страницу

document.addEventListener('DOMContentLoaded', function() {
    // Главные элементы
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const zonesContainer = document.getElementById('zones-container');
    const attractionsContainer = document.getElementById('xml-attractions');

    fetch('/data/attractions.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
        .then(xml => {
            // Главный заголовок и описание
            if (mainTitle) mainTitle.textContent = xml.getElementsByTagName('mainTitle')[0]?.textContent || '';
            if (mainDescription) mainDescription.textContent = xml.getElementsByTagName('mainDescription')[0]?.textContent || '';

            // Зоны
            if (zonesContainer) {
                const zones = xml.getElementsByTagName('zone');
                let html = '';
                Array.from(zones).forEach(zone => {
                    const title = zone.getElementsByTagName('title')[0]?.textContent || '';
                    const desc = zone.getElementsByTagName('description')[0]?.textContent || '';
                    const img = zone.getElementsByTagName('image')[0]?.textContent || '';
                    html += `<div class="zone-item">
                        <div class="zone-content">
                            <h2>${title}</h2>
                            <p>${desc}</p>
                        </div>
                        <div class="zone-image">
                            <img src="${img}" alt="${title}">
                        </div>
                    </div>`;
                });
                zonesContainer.innerHTML = html;
            }

            // Аттракционы
            if (attractionsContainer) {
                const attractions = xml.getElementsByTagName('attraction');
                let html = '';
                Array.from(attractions).forEach(attr => {
                    const name = attr.getElementsByTagName('name')[0]?.textContent || '';
                    const desc = attr.getElementsByTagName('description')[0]?.textContent || '';
                    const height = attr.getElementsByTagName('height')[0]?.textContent;
                    const level = attr.getElementsByTagName('level')[0]?.textContent;
                    html += `<div class="xml-attraction">
                        <h3>${name}</h3>
                        <p>${desc}</p>
                        ${height ? `<p><b>Рост:</b> ${height} см</p>` : ''}
                        ${level ? `<p><b>Экстрим:</b> ${level}</p>` : ''}
                    </div>`;
                });
                attractionsContainer.innerHTML = html;
            }
        })
        .catch(err => {
            if (attractionsContainer) attractionsContainer.innerHTML = '<p>Не удалось загрузить данные из XML.</p>';
        });
}); 