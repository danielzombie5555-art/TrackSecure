"use strict";

const trails = window.TRACKSECURE_TRAILS || [];
const id = new URLSearchParams(location.search).get("id");
const trail = trails.find(t => t.id === id) || trails.find(t => t.district === "Tawau") || trails[0];

const $ = id => document.getElementById(id);

const routeProfiles = {
    "bukit-panchang": {
        steps: [
            "Start at the Sabah Forestry station / checkpoint near the foothill.",
            "Walk the initial gravel/plantation approach to the forest station.",
            "Enter the established forest trail. The early section contains the steep boulder segment.",
            "Continue through the marked ascent with 100 m distance markers and rope support.",
            "After about 800 m the gradient becomes less steep before the final approach.",
            "Finish at the summit platform and trig point at about 398 m."
        ],
        note: "Published information reports about 1,080 m one-way and a steep opening section. Ranger guidance is required according to the published source."
    },
    "bombalai-hill": {
        steps: [
            "Begin at the Tawau Hills Park / Bombalai trailhead.",
            "Follow the marked jungle trail and distance posts.",
            "Pass the 100 m, 200 m and subsequent trail markers toward the summit.",
            "The trail becomes steeper from around the 400 m section.",
            "Continue to the summit at approximately 530 m elevation.",
            "Return using the same established route."
        ],
        note: "A published Bombalai route map identifies the official route and waypoints. The trail map source should be used for the exact line."
    },
    "table-waterfall": {
        steps: [
            "Start from Tawau Hills Park headquarters / designated nature-trail access.",
            "Follow the nature trail along the Tawau River area.",
            "Continue through the rainforest toward the waterfall section.",
            "The published park information describes waterfall routes and Table Waterfall as a natural pool attraction.",
            "Return via the established park trail and follow current ranger signage."
        ],
        note: "The park publishes route descriptions and waterfall access information, but this app does not invent a GPS line where a downloadable track is not published."
    },
    "bukit-gemok": {
        steps: [
            "Start at Bukit Gemok Nature Centre / designated entrance.",
            "Follow the uphill forest trail and concrete steps at the lower section.",
            "Continue through the natural forest terrain and rest huts.",
            "Reach the Titian Selara canopy-walk area near the upper section.",
            "Return using the established trail."
        ],
        note: "Published descriptions report approximately 1 km to the canopy walkway and about one hour of hiking, but current access to the reserve/canopy facilities must be checked."
    },
    "bukit-membalua": {
        steps: [
            "Start from the Membalua Recreation Area / approved entrance.",
            "Follow the available recreation and forest walking paths.",
            "Use only marked or permitted paths inside the recreation area.",
            "Return to the recreation area using the same permitted path."
        ],
        note: "The available source confirms walking, jogging and hiking in the recreation area but does not publish a verified GPS hiking loop."
    },
    "bukit-sin-onn": {
        steps: [
            "Use the currently permitted local access point only.",
            "Follow the established local hill/jogging route if access is open.",
            "Do not enter private land, quarry work areas or restricted sections.",
            "Return by the same permitted route."
        ],
        note: "Historical Tawau hiking information documents Sin On Hill as a hiking/jogging destination, but current access and exact trail status require local verification."
    },
    "lim-man-kui": {
        steps: [
            "Confirm the current legal access point before starting.",
            "Follow the established concrete-road approach where permitted.",
            "Continue onto the rocky uphill section.",
            "Reach the hilltop viewpoint and return by the established route."
        ],
        note: "Historical trail information describes this as a popular Tawau hiking track, but current land and quarry conditions must be verified."
    },
    "sulphur-spring": {
        steps: [
            "Start at Tawau Hills Park and enter the designated nature trail.",
            "Follow the jungle route toward the sulphur spring area.",
            "Stay on marked paths and follow park signage/ranger instructions.",
            "Return using the established trail."
        ],
        note: "Published sources describe the spring route and distance, but this page does not fabricate a GPS line."
    },
    "mt-lucia-tawau": {
        steps: ["Register with Sabah Parks.", "Meet the required mountain guide.", "Follow the current Lucia mountain route supplied by the guide/park authority.", "Complete the planned summit and return according to the guide's itinerary."],
        note: "Mountain routes require current park registration, permit and guide arrangements."
    },
    "mt-magdalena-tawau": {
        steps: ["Register with Sabah Parks and obtain the required permit.", "Start the forest expedition with the required guide.", "Follow the current 14 km mountain route and designated overnight arrangements.", "Continue to the summit and descend according to the guide's route plan."],
        note: "Sabah Parks publishes a 14 km route and recommends a multi-day climb; use the current park route plan for exact navigation."
    },
    "mt-maria-tawau": {
        steps: ["Register with Sabah Parks and obtain the required permit.", "Start with the appointed mountain guide.", "Follow the current Maria mountain trail and guide instructions.", "Return using the approved route."],
        note: "Exact GPS line is not invented here; use the current Sabah Parks route/guide information."
    },
    "tiger-hill-tawau": {
        steps: ["Confirm permission and current access before entering.", "Use a verified local/community route if access is permitted.", "Follow the current GPS/community trail carefully.", "Return by the established route."],
        note: "A community GPS route exists online, but access conditions may involve plantation/private land and must be checked."
    }
};

if (trail) {
    $("routeTitle").textContent = trail.name;
    $("routeSubtitle").textContent = `${trail.location} • ${trail.distance} • ${trail.duration}`;
    $("routeLocation").textContent = `📍 ${trail.location}`;
    $("routeStats").textContent = `🥾 ${trail.distance}   ⛰️ ${trail.elevation}   ⏱️ ${trail.duration}`;
    $("navigationLink").href = `https://www.google.com/maps?q=${trail.latitude},${trail.longitude}`;
    $("routeStatus").textContent = trail.routeStatus || "Route information should be verified locally before hiking.";

    const profile = routeProfiles[trail.id] || {
        steps: [
            "Check the current trailhead and access conditions.",
            "Follow the marked/official trail.",
            "Use offline navigation and keep your emergency contact informed.",
            "Return via the established route."
        ],
        note: "No verified GPS track was supplied for this destination, so TrackSecure does not invent one."
    };

    $("routeSteps").innerHTML = profile.steps.map((step, i) =>
        `<div class="route-step"><span>${i + 1}</span><p>${step}</p></div>`
    ).join("");

    $("routeStatus").textContent += ` ${profile.note}`;

    const source = trail.routeSource || "";
    if (source.toLowerCase().endsWith(".pdf")) {
        $("routePreviewCard").style.display = "block";
        $("routePreview").src = source;
    }
    if (source) {
        $("sourceLink").href = source;
    } else {
        $("sourceLink").style.display = "none";
    }
}
