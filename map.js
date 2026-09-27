"use strict";


/* =========================================================
   TRACKSECURE MAP
   ========================================================= */


/* =========================================================
   1. GET TRAIL DATA
   ========================================================= */

const allTrails = window.TRACKSECURE_TRAILS || [];


/*
   Only show trails located in Tawau.
*/
const trails = allTrails.filter(
    trail =>
        String(trail.district || "").toLowerCase() === "tawau"
);


/* =========================================================
   2. MAP SETUP
   ========================================================= */

const map = L.map("hikingMap", {
    scrollWheelZoom: true,
    zoomControl: true
}).setView(
    [4.40, 117.93],
    11
);


/* =========================================================
   3. OPENSTREETMAP TILE
   ========================================================= */

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,

        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


/* =========================================================
   4. MARKER LAYER
   ========================================================= */

const layer = L.layerGroup().addTo(map);


/* =========================================================
   5. DOM ELEMENTS
   ========================================================= */

const input =
    document.getElementById("mapSearchInput");

const searchButton =
    document.getElementById("mapSearchBtn");

const trailList =
    document.getElementById("mapTrailList");

const resultCount =
    document.getElementById("mapResultCount");

const resetButton =
    document.getElementById("resetMapBtn");

const filterButtons =
    document.querySelectorAll(".map-filter-btn");


/* =========================================================
   6. CURRENT FILTER
   ========================================================= */

let selectedDifficulty = "all";


/* =========================================================
   7. HELPER - ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   8. NORMALIZE DIFFICULTY
   ========================================================= */

function getDifficulty(trail) {

    const difficulty =
        String(
            trail.difficulty || "medium"
        )
        .toLowerCase()
        .trim();

    if (
        difficulty === "easy" ||
        difficulty === "medium" ||
        difficulty === "hard"
    ) {
        return difficulty;
    }

    return "medium";
}


/* =========================================================
   9. DIFFICULTY LABEL
   ========================================================= */

function getDifficultyLabel(difficulty) {

    const labels = {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard"
    };

    return labels[difficulty] || "Medium";
}


/* =========================================================
   10. DIFFICULTY ICON
   ========================================================= */

function getDifficultyIcon(difficulty) {

    const icons = {
        easy: "🌿",
        medium: "🥾",
        hard: "⛰️"
    };

    return icons[difficulty] || "🥾";
}


/* =========================================================
   11. CREATE CUSTOM MAP MARKER
   ========================================================= */

function createMarker(trail) {

    const difficulty =
        getDifficulty(trail);

    const icon =
        getDifficultyIcon(difficulty);


    return L.divIcon({

        className: "custom-map-marker",

        html: `
            <div class="marker-pin ${difficulty}-marker">
                <span>${icon}</span>
            </div>
        `,

        iconSize: [45, 45],

        iconAnchor: [23, 45],

        popupAnchor: [0, -42]

    });
}


/* =========================================================
   12. CREATE POPUP
   ========================================================= */

function createPopup(trail) {

    const difficulty =
        getDifficulty(trail);

    const difficultyLabel =
        getDifficultyLabel(difficulty);

    const icon =
        getDifficultyIcon(difficulty);


    const name =
        escapeHtml(trail.name || "Hiking Trail");

    const location =
        escapeHtml(
            trail.location ||
            trail.district ||
            "Tawau"
        );

    const distance =
        escapeHtml(
            trail.distance ||
            "Distance unavailable"
        );

    const duration =
        escapeHtml(
            trail.duration ||
            "Duration unavailable"
        );

    const id =
        encodeURIComponent(
            trail.id || ""
        );


    return `

        <div class="trail-map-popup">

            <span class="popup-difficulty ${difficulty}">
                ${icon} ${difficultyLabel}
            </span>


            <h3>
                ${name}
            </h3>


            <p>
                📍 ${location}
            </p>


            <div class="popup-trail-info">

                <span>
                    🥾 ${distance}
                </span>

                <span>
                    ⏱️ ${duration}
                </span>

            </div>


            <a
                class="popup-details-btn"
                href="trail-details.html?id=${id}"
            >
                View Trail Details
            </a>


            <a
                class="popup-route-btn"
                href="routes.html?id=${id}"
            >
                🗺️ View Hiking Route
            </a>

        </div>

    `;
}


/* =========================================================
   13. ADD TRAIL MARKER
   ========================================================= */

function addTrailMarker(trail) {

    const latitude =
        Number(trail.latitude);

    const longitude =
        Number(trail.longitude);


    /*
       Ignore invalid coordinates.
    */

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        return null;
    }


    const marker =
        L.marker(
            [latitude, longitude],
            {
                icon: createMarker(trail)
            }
        );


    marker
        .bindPopup(
            createPopup(trail),
            {
                maxWidth: 300
            }
        );


    marker.addTo(layer);


    return marker;
}


/* =========================================================
   14. CREATE SIDEBAR CARD
   ========================================================= */

function createTrailCard(trail) {

    const difficulty =
        getDifficulty(trail);

    const difficultyLabel =
        getDifficultyLabel(difficulty);

    const icon =
        getDifficultyIcon(difficulty);


    const name =
        escapeHtml(
            trail.name || "Hiking Trail"
        );

    const location =
        escapeHtml(
            trail.location ||
            trail.district ||
            "Tawau"
        );

    const distance =
        escapeHtml(
            trail.distance ||
            "N/A"
        );

    const duration =
        escapeHtml(
            trail.duration ||
            "N/A"
        );

    const id =
        encodeURIComponent(
            trail.id || ""
        );


    return `

        <article
            class="map-trail-list-card ${difficulty}-card"
            data-id="${id}"
        >

            <div class="map-card-top">

                <div>

                    <span class="map-card-kicker">
                        ${icon} Tawau Trail
                    </span>

                    <h3>
                        ${name}
                    </h3>

                </div>


                <span
                    class="map-card-difficulty ${difficulty}"
                >
                    ${difficultyLabel}
                </span>

            </div>


            <p>
                📍 ${location}
            </p>


            <div class="map-card-info">

                <span>
                    🥾 ${distance}
                </span>

                <span>
                    ⏱️ ${duration}
                </span>

            </div>


            <div class="map-card-actions">

                <a
                    class="map-details-link"
                    href="trail-details.html?id=${id}"
                >
                    Details
                </a>


                <a
                    class="map-route-link"
                    href="routes.html?id=${id}"
                >
                    🗺️ Route
                </a>

            </div>

        </article>

    `;
}


/* =========================================================
   15. FILTER TRAILS
   ========================================================= */

function getFilteredTrails() {

    const query =
        String(
            input?.value || ""
        )
        .toLowerCase()
        .trim();


    return trails.filter(trail => {

        const difficulty =
            getDifficulty(trail);


        const searchableText = `

            ${trail.name || ""}

            ${trail.location || ""}

            ${trail.district || ""}

            ${trail.description || ""}

            ${trail.distance || ""}

            ${trail.duration || ""}

        `
        .toLowerCase();


        const matchesSearch =
            searchableText.includes(query);


        const matchesDifficulty =
            selectedDifficulty === "all" ||
            difficulty === selectedDifficulty;


        return (
            matchesSearch &&
            matchesDifficulty
        );
    });
}


/* =========================================================
   16. RENDER MAP
   ========================================================= */

function renderMap() {

    const filteredTrails =
        getFilteredTrails();


    /*
       Remove existing markers.
    */

    layer.clearLayers();


    /*
       Remove existing sidebar cards.
    */

    trailList.innerHTML = "";


    /* =============================================
       EMPTY RESULT
       ============================================= */

    if (filteredTrails.length === 0) {

        resultCount.textContent =
            "0 Tawau trails";


        trailList.innerHTML = `

            <div class="map-empty-message">

                <span>
                    🔎
                </span>

                <h3>
                    No trails found
                </h3>

                <p>
                    Try another trail name or
                    difficulty filter.
                </p>

            </div>

        `;

        return;
    }


    /* =============================================
       RESULT COUNT
       ============================================= */

    resultCount.textContent =
        `${filteredTrails.length} Tawau trail${
            filteredTrails.length === 1
                ? ""
                : "s"
        }`;


    /* =============================================
       ADD TRAILS
       ============================================= */

    filteredTrails.forEach(trail => {

        addTrailMarker(trail);


        trailList.insertAdjacentHTML(
            "beforeend",
            createTrailCard(trail)
        );

    });


    /* =============================================
       CARD INTERACTION
       ============================================= */

    setupCardInteractions();
}


/* =========================================================
   17. SIDEBAR CARD INTERACTION
   ========================================================= */

function setupCardInteractions() {

    const cards =
        trailList.querySelectorAll(
            ".map-trail-list-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                /*
                   Do not trigger map movement
                   when clicking Details / Route.
                */

                if (
                    event.target.closest("a")
                ) {
                    return;
                }


                const id =
                    card.dataset.id;


                const trail =
                    trails.find(
                        item =>
                            String(item.id) ===
                            String(
                                decodeURIComponent(id)
                            )
                    );


                if (!trail) {
                    return;
                }


                const latitude =
                    Number(trail.latitude);

                const longitude =
                    Number(trail.longitude);


                if (
                    !Number.isFinite(latitude) ||
                    !Number.isFinite(longitude)
                ) {
                    return;
                }


                map.flyTo(
                    [latitude, longitude],
                    14,
                    {
                        duration: 0.8
                    }
                );


                /*
                   Open popup after movement.
                */

                setTimeout(() => {

                    layer.eachLayer(marker => {

                        const position =
                            marker.getLatLng?.();


                        if (!position) {
                            return;
                        }


                        if (
                            Math.abs(
                                position.lat -
                                latitude
                            ) < 0.00001 &&

                            Math.abs(
                                position.lng -
                                longitude
                            ) < 0.00001
                        ) {

                            marker.openPopup();

                        }

                    });

                }, 850);

            }
        );

    });
}


/* =========================================================
   18. SEARCH BUTTON
   ========================================================= */

searchButton?.addEventListener(
    "click",
    () => {

        renderMap();

    }
);


/* =========================================================
   19. LIVE SEARCH
   ========================================================= */

input?.addEventListener(
    "input",
    () => {

        renderMap();

    }
);


/* =========================================================
   20. ENTER KEY SEARCH
   ========================================================= */

input?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            renderMap();

        }

    }
);


/* =========================================================
   21. DIFFICULTY FILTER
   ========================================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            /*
               Remove active from all buttons.
            */

            filterButtons.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            /*
               Activate clicked button.
            */

            button.classList.add("active");


            /*
               Update selected difficulty.
            */

            selectedDifficulty =
                String(
                    button.dataset.difficulty ||
                    "all"
                )
                .toLowerCase();


            renderMap();

        }
    );

});


/* =========================================================
   22. RESET MAP
   ========================================================= */

resetButton?.addEventListener(
    "click",
    () => {

        /*
           Clear search.
        */

        if (input) {
            input.value = "";
        }


        /*
           Reset difficulty.
        */

        selectedDifficulty = "all";


        /*
           Reset active button.
        */

        filterButtons.forEach(
            button =>
                button.classList.remove(
                    "active"
                )
        );


        document
            .querySelector(
                '.map-filter-btn[data-difficulty="all"]'
            )
            ?.classList.add("active");


        /*
           Render all trails.
        */

        renderMap();


        /*
           Return to Tawau overview.
        */

        map.flyTo(
            [4.40, 117.93],
            11,
            {
                duration: 0.8
            }
        );

    }
);


/* =========================================================
   23. INITIAL RENDER
   ========================================================= */

renderMap();


/* =========================================================
   24. FIX LEAFLET SIZE
   ========================================================= */

setTimeout(() => {

    map.invalidateSize();

}, 300);


/* =========================================================
   25. FIX MAP WHEN WINDOW RESIZES
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        map.invalidateSize();

    }
);