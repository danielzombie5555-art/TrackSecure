"use strict";

// Homepage interactions. Search was intentionally removed from the homepage.
document.querySelectorAll(".details-btn[data-trail]").forEach(function (button) {
    button.addEventListener("click", function () {
        const id = button.dataset.trail;
        if (id) window.location.href = `trail-details.html?id=${encodeURIComponent(id)}`;
    });
});

document.querySelectorAll(".view-all-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        window.location.href = "trails.html";
    });
});

document.querySelectorAll(".profile-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        window.location.href = "profile.html";
    });
});
