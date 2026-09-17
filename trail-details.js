"use strict";

const trails = window.TRACKSECURE_TRAILS || [];
const id = new URLSearchParams(location.search).get("id");
const t = trails.find(x => x.id === id) || trails[0];

const set = (i, v) => {
    const e = document.getElementById(i);
    if (e) e.textContent = v;
};

if (t) {
    document.getElementById("detailsHero").style.backgroundImage =
        `linear-gradient(rgba(0,0,0,.15),rgba(0,0,0,.65)),url('${t.image}')`;

    set("trailName", t.name);
    set("trailLocation", "📍 " + t.location);
    set("trailDistance", t.distance);
    set("trailDuration", t.duration);
    set("trailElevation", t.elevation);
    set("trailType", t.type);
    set("trailDescription", t.description);
    set("trailParking", t.parking);
    set("trailWater", t.water);
    set("trailToilet", t.toilet);
    set("trailPermit", t.permit);
    set("trailFee", t.fee);
    set("trailSignal", t.signal);
    set("recommendedHiker", t.recommended);

    const d = document.getElementById("trailDifficulty");

    d.textContent = t.difficultyLabel;
    d.className = "difficulty " + t.difficulty;

    const prep = document.getElementById("preparationChecklist");

    if (prep) {
        prep.innerHTML = t.preparation
            .map(x =>
                `<label class="checklist-item">
                    <input type="checkbox">
                    <span>${x}</span>
                </label>`
            )
            .join("");
    }

    const tips = document.getElementById("safetyTips");

    if (tips) {
        tips.innerHTML = t.tips
            .map((x, i) =>
                `<div class="safety-tip">
                    <span>${i + 1}</span>
                    <p>${x}</p>
                </div>`
            )
            .join("");
    }

    document.querySelectorAll(".route-btn").forEach(a => {
        a.href = `routes.html?id=${encodeURIComponent(t.id)}`;
    });

    /* =========================
       TRAIL VIDEO
       ========================= */

    const videoSection = document.getElementById("trailVideoSection");
    const trailVideo = document.getElementById("trailVideo");

    if (videoSection && trailVideo) {
        if (t.video) {
            trailVideo.src = t.video;
            videoSection.style.display = "block";
        } else {
            videoSection.style.display = "none";
        }
    }

    /* =========================
       SAVE TO FAVOURITES
       ========================= */

    const save =
        document.getElementById("saveTrailBtn") ||
        document.querySelector(".save-trail-btn");

    if (save) {
        let fav = JSON.parse(
            localStorage.getItem("trackSecureFavourites") || "[]"
        );

        const update = () => {
            const on = fav.includes(t.id);

            save.textContent = on
                ? "Saved to Favourites"
                : "Save Trail";

            save.classList.toggle("saved", on);
        };

        save.onclick = () => {
            fav = fav.includes(t.id)
                ? fav.filter(x => x !== t.id)
                : [...fav, t.id];

            localStorage.setItem(
                "trackSecureFavourites",
                JSON.stringify(fav)
            );

            update();
        };

        update();
    }
}