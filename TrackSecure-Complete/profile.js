const profileForm =
    document.getElementById("profileForm");

const profileName =
    document.getElementById("profileName");

const profilePhone =
    document.getElementById("profilePhone");

const profileEmail =
    document.getElementById("profileEmail");

const profileExperience =
    document.getElementById("profileExperience");

const profileSaveMessage =
    document.getElementById("profileSaveMessage");

const completedTrailCount =
    document.getElementById("completedTrailCount");

const favouriteTrailCount =
    document.getElementById("favouriteTrailCount");

const checklistProgress =
    document.getElementById("checklistProgress");

const profileEmergencyContact =
    document.getElementById("profileEmergencyContact");

const locationPermissionStatus =
    document.getElementById("locationPermissionStatus");

const notificationToggle =
    document.getElementById("notificationToggle");

const resetProfileDataBtn =
    document.getElementById("resetProfileDataBtn");


/* =====================================
   PROFILE STORAGE
===================================== */

function getSavedProfile() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "trackSecureProfile"
            )
        );
    } catch (error) {
        return null;
    }
}

function saveProfile(profile) {
    localStorage.setItem(
        "trackSecureProfile",
        JSON.stringify(profile)
    );
}


/* =====================================
   DISPLAY PROFILE
===================================== */

function displaySavedProfile() {
    const profile = getSavedProfile();

    if (!profile) {
        return;
    }

    profileName.value =
        profile.name || "";

    profilePhone.value =
        profile.phone || "";

    profileEmail.value =
        profile.email || "";

    profileExperience.value =
        profile.experience || "Beginner";
}


/* =====================================
   SAVE PROFILE FORM
===================================== */

profileForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const name =
            profileName.value.trim();

        const phone =
            profilePhone.value.trim();

        const email =
            profileEmail.value.trim();

        const experience =
            profileExperience.value;

        if (!name) {
            profileSaveMessage.textContent =
                "Please enter your full name.";

            profileSaveMessage.classList.add(
                "error"
            );

            return;
        }

        saveProfile({
            name: name,
            phone: phone,
            email: email,
            experience: experience
        });

        profileSaveMessage.textContent =
            "Profile saved successfully.";

        profileSaveMessage.classList.remove(
            "error"
        );

        setTimeout(
            function () {
                profileSaveMessage.textContent = "";
            },
            3000
        );
    }
);


/* =====================================
   COMPLETED TRAILS
===================================== */

function getCompletedTrails() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "trackSecureCompletedTrails"
            )
        ) || [];
    } catch (error) {
        return [];
    }
}

function displayCompletedTrailsCount() {
    const completedTrails =
        getCompletedTrails();

    completedTrailCount.textContent =
        completedTrails.length;
}


/* =====================================
   FAVOURITE TRAILS
===================================== */

function getFavouriteTrails() {
    const possibleStorageKeys = [
        "trackSecureFavourites",
        "favouriteTrails",
        "favorites",
        "favourites"
    ];

    for (
        let index = 0;
        index < possibleStorageKeys.length;
        index++
    ) {
        const key =
            possibleStorageKeys[index];

        try {
            const storedData =
                JSON.parse(
                    localStorage.getItem(key)
                );

            if (Array.isArray(storedData)) {
                return storedData;
            }
        } catch (error) {
            console.warn(
                "Unable to read favourites:",
                key
            );
        }
    }

    return [];
}

function displayFavouriteCount() {
    const favourites =
        getFavouriteTrails();

    favouriteTrailCount.textContent =
        favourites.length;
}


/* =====================================
   CHECKLIST PROGRESS
===================================== */

function getChecklistData() {
    const possibleStorageKeys = [
        "trackSecureChecklist",
        "packingChecklist",
        "checklistItems"
    ];

    for (
        let index = 0;
        index < possibleStorageKeys.length;
        index++
    ) {
        const key =
            possibleStorageKeys[index];

        try {
            const storedData =
                JSON.parse(
                    localStorage.getItem(key)
                );

            if (storedData) {
                return storedData;
            }
        } catch (error) {
            console.warn(
                "Unable to read checklist:",
                key
            );
        }
    }

    return null;
}

function calculateChecklistProgress() {
    const checklistData =
        getChecklistData();

    if (!checklistData) {
        checklistProgress.textContent =
            "0%";

        return;
    }

    let values = [];

    if (Array.isArray(checklistData)) {
        values = checklistData;
    } else if (
        typeof checklistData === "object"
    ) {
        values =
            Object.values(checklistData);
    }

    if (values.length === 0) {
        checklistProgress.textContent =
            "0%";

        return;
    }

    let completedItems = 0;

    values.forEach(
        function (item) {
            if (
                item === true ||
                item?.completed === true ||
                item?.checked === true
            ) {
                completedItems++;
            }
        }
    );

    const progress =
        Math.round(
            (
                completedItems /
                values.length
            ) * 100
        );

    checklistProgress.textContent =
        progress + "%";
}


/* =====================================
   EMERGENCY CONTACT
===================================== */

function getEmergencyContact() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "trackSecureEmergencyContact"
            )
        );
    } catch (error) {
        return null;
    }
}

function displayEmergencyContact() {
    const contact =
        getEmergencyContact();

    if (!contact) {
        profileEmergencyContact.innerHTML = `
            <div class="profile-no-contact">
                <span>📞</span>

                <div>
                    <strong>
                        No emergency contact saved
                    </strong>

                    <p>
                        Add an emergency contact from
                        the Emergency page.
                    </p>
                </div>
            </div>
        `;

        return;
    }

    profileEmergencyContact.innerHTML = `
        <div class="profile-contact-info">

            <span>📞</span>

            <div>
                <p>Emergency Contact</p>

                <strong>
                    ${contact.name}
                </strong>

                <small>
                    ${contact.phone}
                </small>
            </div>

        </div>
    `;
}


/* =====================================
   LOCATION PERMISSION
===================================== */

async function checkLocationPermission() {
    if (!navigator.geolocation) {
        locationPermissionStatus.textContent =
            "Not supported";

        locationPermissionStatus.className =
            "permission-denied";

        return;
    }

    if (!navigator.permissions) {
        locationPermissionStatus.textContent =
            "Available";

        locationPermissionStatus.className =
            "permission-available";

        return;
    }

    try {
        const permission =
            await navigator.permissions.query({
                name: "geolocation"
            });

        updatePermissionStatus(
            permission.state
        );

        permission.addEventListener(
            "change",
            function () {
                updatePermissionStatus(
                    permission.state
                );
            }
        );
    } catch (error) {
        locationPermissionStatus.textContent =
            "Available";

        locationPermissionStatus.className =
            "permission-available";
    }
}

function updatePermissionStatus(state) {
    if (state === "granted") {
        locationPermissionStatus.textContent =
            "Allowed";

        locationPermissionStatus.className =
            "permission-allowed";
    } else if (state === "denied") {
        locationPermissionStatus.textContent =
            "Blocked";

        locationPermissionStatus.className =
            "permission-denied";
    } else {
        locationPermissionStatus.textContent =
            "Not requested";

        locationPermissionStatus.className =
            "permission-prompt";
    }
}


/* =====================================
   NOTIFICATION SETTING
===================================== */

function loadNotificationSetting() {
    const notificationEnabled =
        localStorage.getItem(
            "trackSecureNotifications"
        );

    notificationToggle.checked =
        notificationEnabled === "true";
}

notificationToggle.addEventListener(
    "change",
    function () {
        localStorage.setItem(
            "trackSecureNotifications",
            notificationToggle.checked
        );
    }
);


/* =====================================
   RESET ALL DATA
===================================== */

resetProfileDataBtn.addEventListener(
    "click",
    function () {
        const confirmation =
            confirm(
                "Are you sure you want to reset all TrackSecure data?"
            );

        if (!confirmation) {
            return;
        }

        const trackSecureKeys = [
            "trackSecureProfile",
            "trackSecureEmergencyContact",
            "trackSecureCompletedTrails",
            "trackSecureFavourites",
            "trackSecureChecklist",
            "trackSecureNotifications",
            "favouriteTrails",
            "favorites",
            "favourites",
            "packingChecklist",
            "checklistItems"
        ];

        trackSecureKeys.forEach(
            function (key) {
                localStorage.removeItem(key);
            }
        );

        profileForm.reset();

        profileExperience.value =
            "Beginner";

        notificationToggle.checked =
            false;

        displayCompletedTrailsCount();
        displayFavouriteCount();
        calculateChecklistProgress();
        displayEmergencyContact();

        profileSaveMessage.textContent =
            "All TrackSecure data has been reset.";

        profileSaveMessage.classList.remove(
            "error"
        );
    }
);


/* =====================================
   PAGE INITIALIZATION
===================================== */

displaySavedProfile();
displayCompletedTrailsCount();
displayFavouriteCount();
calculateChecklistProgress();
displayEmergencyContact();
loadNotificationSetting();
checkLocationPermission();