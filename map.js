"use strict";

const allTrails = window.TRACKSECURE_TRAILS || [];
const trails = allTrails.filter(t => String(t.district).toLowerCase() === "tawau");

const map = L.map("hikingMap", { scrollWheelZoom: true }).setView([4.40, 117.93], 11);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const layer = L.layerGroup().addTo(map);
const input = document.getElementById("mapSearchInput");
const list = document.getElementById("mapTrailList");
const count = document.getElementById("mapResultCount");
let selected = "all";

function render() {
    const q = (input?.value || "").toLowerCase().trim();
    const filtered = trails.filter(t => {
        const text = `${t.name} ${t.location} ${t.description || ""}`.toLowerCase();
        return text.includes(q) && (selected === "all" || t.difficulty === selected);
    });

    layer.clearLayers();
    list.innerHTML = "";

    filtered.forEach(t => {
        L.marker([t.latitude, t.longitude])
            .addTo(layer)
            .bindPopup(`
                <strong>${t.name}</strong><br>
                ${t.location}<br>
                🥾 ${t.distance}<br>
                <a href="trail-details.html?id=${encodeURIComponent(t.id)}">View details</a><br>
                <a href="routes.html?id=${encodeURIComponent(t.id)}">🗺️ View hiking route</a>
            `);

        list.insertAdjacentHTML("beforeend", `
            <button class="map-trail-item" data-id="${t.id}">
                <strong>${t.name}</strong>
                <span>${t.location}</span>
                <small>${t.distance} • ${t.duration}</small>
            </button>
        `);
    });

    count.textContent = `${filtered.length} Tawau trails`;

    list.querySelectorAll(".map-trail-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const t = trails.find(x => x.id === btn.dataset.id);
            if (!t) return;
            map.flyTo([t.latitude, t.longitude], 14, { duration: 0.8 });
        });
    });
}

document.querySelectorAll(".map-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".map-filter-btn").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        selected = btn.dataset.difficulty || "all";
        render();
    });
});

document.getElementById("mapSearchBtn")?.addEventListener("click", render);
input?.addEventListener("input", render);

document.getElementById("resetMapBtn")?.addEventListener("click", () => {
    if (input) input.value = "";
    selected = "all";
    document.querySelectorAll(".map-filter-btn").forEach(x => x.classList.remove("active"));
    document.querySelector('.map-filter-btn[data-difficulty="all"]')?.classList.add("active");
    render();
    map.flyTo([4.40, 117.93], 11, { duration: 0.8 });
});

render();
