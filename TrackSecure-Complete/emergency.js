const getLocationBtn =
    document.getElementById("getLocationBtn");

const refreshLocationBtn =
    document.getElementById("refreshLocationBtn");

const stopTrackingBtn =
    document.getElementById("stopTrackingBtn");

const copyLocationBtn =
    document.getElementById("copyLocationBtn");

const openMapBtn =
    document.getElementById("openMapBtn");

const locationStatus =
    document.getElementById("locationStatus");

const latitudeValue =
    document.getElementById("latitudeValue");

const longitudeValue =
    document.getElementById("longitudeValue");

const accuracyValue =
    document.getElementById("accuracyValue");

const locationError =
    document.getElementById("locationError");

const mapAccuracyText =
    document.getElementById("mapAccuracyText");

const emergencyContactForm =
    document.getElementById("emergencyContactForm");

const emergencyContactName =
    document.getElementById("emergencyContactName");

const emergencyContactPhone =
    document.getElementById("emergencyContactPhone");

const savedEmergencyContact =
    document.getElementById("savedEmergencyContact");

const emergencyMessage =
    document.getElementById("emergencyMessage");

const addLocationToMessageBtn =
    document.getElementById("addLocationToMessageBtn");

const copyEmergencyMessageBtn =
    document.getElementById("copyEmergencyMessageBtn");

const whatsappEmergencyBtn =
    document.getElementById("whatsappEmergencyBtn");

let currentLocation = null;
let locationWatchId = null;

let userMarker = null;
let accuracyCircle = null;
let firstLocationDetected = false;

/* ================================
   LEAFLET MAP
================================ */

const emergencyMap = L.map("emergencyMap").setView(
    [5.9804, 116.0735],
    8
);
L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
        subdomains: "abcd",
        maxZoom: 20,
        attribution:
            "&copy; OpenStreetMap contributors &copy; CARTO"
    }
).addTo(emergencyMap);

/* Fix map display after page loads */
window.addEventListener(
    "load",
    function () {
        setTimeout(
            function () {
                emergencyMap.invalidateSize();
            },
            300
        );
    }
);

/* ================================
   EMERGENCY CONTACT
================================ */

function getSavedContact() {
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

function saveContact(contact) {
    localStorage.setItem(
        "trackSecureEmergencyContact",
        JSON.stringify(contact)
    );
}

function displaySavedContact() {
    const contact = getSavedContact();

    if (!contact) {
        savedEmergencyContact.innerHTML = `
            <div class="no-emergency-contact">
                <span>👤</span>

                <div>
                    <strong>
                        No emergency contact saved
                    </strong>

                    <p>
                        Add someone who can be contacted
                        during an emergency.
                    </p>
                </div>
            </div>
        `;

        whatsappEmergencyBtn.classList.add(
            "disabled-link"
        );

        whatsappEmergencyBtn.href = "#";

        return;
    }

    savedEmergencyContact.innerHTML = `
        <div class="saved-contact-information">

            <div>
                <span>👤</span>

                <div>
                    <p>
                        Saved Emergency Contact
                    </p>

                    <strong>
                        ${contact.name}
                    </strong>

                    <small>
                        ${contact.phone}
                    </small>
                </div>
            </div>

            <button
                type="button"
                id="removeEmergencyContactBtn"
            >
                Remove
            </button>

        </div>
    `;

    emergencyContactName.value =
        contact.name;

    emergencyContactPhone.value =
        contact.phone;

    const removeButton =
        document.getElementById(
            "removeEmergencyContactBtn"
        );

    removeButton.addEventListener(
        "click",
        function () {
            localStorage.removeItem(
                "trackSecureEmergencyContact"
            );

            emergencyContactName.value = "";
            emergencyContactPhone.value = "";

            displaySavedContact();
        }
    );

    updateWhatsAppLink();
}

/* ================================
   LOCATION DISPLAY
================================ */

function updateLocationDisplay(position) {
    const latitude =
        position.coords.latitude;

    const longitude =
        position.coords.longitude;

    const accuracy =
        position.coords.accuracy;

    currentLocation = {
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy
    };

    locationStatus.textContent =
        "Live location active";

    latitudeValue.textContent =
        latitude.toFixed(6);

    longitudeValue.textContent =
        longitude.toFixed(6);

    accuracyValue.textContent =
        Math.round(accuracy) +
        " metres";

    mapAccuracyText.textContent =
        "Estimated accuracy: " +
        Math.round(accuracy) +
        " metres";

    locationError.textContent = "";

    copyLocationBtn.disabled = false;
    stopTrackingBtn.disabled = false;

    openMapBtn.classList.remove(
        "disabled-link"
    );

    openMapBtn.href =
        "https://www.google.com/maps?q=" +
        latitude +
        "," +
        longitude;

    openMapBtn.target = "_blank";
    openMapBtn.rel =
        "noopener noreferrer";

    const coordinates = [
        latitude,
        longitude
    ];

    /* Create or update marker */
    if (!userMarker) {
        userMarker = L.marker(
            coordinates
        ).addTo(emergencyMap);

        userMarker.bindPopup(
            "<strong>You are here</strong><br>" +
            "Accuracy: " +
            Math.round(accuracy) +
            " metres"
        );
    } else {
        userMarker.setLatLng(
            coordinates
        );

        userMarker.setPopupContent(
            "<strong>You are here</strong><br>" +
            "Accuracy: " +
            Math.round(accuracy) +
            " metres"
        );
    }

    /* Create or update accuracy circle */
    if (!accuracyCircle) {
        accuracyCircle = L.circle(
            coordinates,
            {
                radius: accuracy
            }
        ).addTo(emergencyMap);
    } else {
        accuracyCircle.setLatLng(
            coordinates
        );

        accuracyCircle.setRadius(
            accuracy
        );
    }

    /* Move map to current position */
    if (!firstLocationDetected) {
        let zoomLevel = 16;

        if (accuracy <= 20) {
            zoomLevel = 18;
        } else if (accuracy <= 50) {
            zoomLevel = 17;
        } else if (accuracy > 500) {
            zoomLevel = 14;
        }

        emergencyMap.setView(
            coordinates,
            zoomLevel
        );

        userMarker.openPopup();

        firstLocationDetected = true;
    } else {
        emergencyMap.panTo(
            coordinates
        );
    }

    emergencyMap.invalidateSize();

    updateWhatsAppLink();
}

/* ================================
   LOCATION ERROR
================================ */

function displayLocationError(error) {
    getLocationBtn.disabled = false;

    getLocationBtn.textContent =
        "📍 Start Live Location";

    stopTrackingBtn.disabled = true;

    mapAccuracyText.textContent =
        "Location unavailable";

    locationStatus.textContent =
        "Unable to detect location";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            locationError.textContent =
                "Location permission was blocked. Click the lock icon beside the website address, allow Location, then refresh the page.";
            break;

        case error.POSITION_UNAVAILABLE:
            locationError.textContent =
                "Your device cannot find a location. Turn on Windows Location Services or phone GPS.";
            break;

        case error.TIMEOUT:
            locationError.textContent =
                "Location detection timed out. Try again or test using a phone with GPS.";
            break;

        default:
            locationError.textContent =
                "Location error: " +
                error.message;
    }

    console.error(
        "Geolocation error:",
        error.code,
        error.message
    );
}

/* ================================
   START LIVE LOCATION
================================ */

function requestLocation() {
    if (!navigator.geolocation) {
        locationStatus.textContent =
            "Geolocation is not supported";

        locationError.textContent =
            "Your browser does not support location detection.";

        return;
    }

    if (locationWatchId !== null) {
        locationStatus.textContent =
            "Live location is already active";

        return;
    }

    locationStatus.textContent =
        "Searching for GPS signal...";

    mapAccuracyText.textContent =
        "Searching for location...";

    locationError.textContent = "";

    getLocationBtn.disabled = true;

    getLocationBtn.textContent =
        "📡 Tracking Location...";

    locationWatchId =
        navigator.geolocation.watchPosition(
            updateLocationDisplay,
            displayLocationError,
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            }
        );
}

/* ================================
   STOP LIVE LOCATION
================================ */

function requestLocation() {
    if (!navigator.geolocation) {
        locationStatus.textContent =
            "Geolocation is not supported";

        locationError.textContent =
            "Your browser does not support location detection.";

        return;
    }

    if (
        window.location.protocol !== "https:" &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
    ) {
        locationStatus.textContent =
            "Secure connection required";

        locationError.textContent =
            "Open this website using Live Server, localhost or HTTPS.";

        return;
    }

    if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(
            locationWatchId
        );

        locationWatchId = null;
    }

    locationStatus.textContent =
        "Requesting location permission...";

    mapAccuracyText.textContent =
        "Searching for location...";

    locationError.textContent = "";

    getLocationBtn.disabled = true;

    getLocationBtn.textContent =
        "📡 Detecting Location...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            updateLocationDisplay(position);

            getLocationBtn.textContent =
                "📡 Live Location Active";

            locationWatchId =
                navigator.geolocation.watchPosition(
                    updateLocationDisplay,
                    function (error) {
                        console.warn(
                            "Live tracking error:",
                            error
                        );
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 60000,
                        maximumAge: 5000
                    }
                );
        },

        function (error) {
            getLocationBtn.disabled = false;

            getLocationBtn.textContent =
                "📍 Start Live Location";

            displayLocationError(error);
        },

        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000
        }
    );
}

/* ================================
   COPY TEXT
================================ */

async function copyText(
    text,
    successMessage
) {
    try {
        await navigator.clipboard.writeText(
            text
        );

        alert(successMessage);
    } catch (error) {
        const temporaryTextArea =
            document.createElement(
                "textarea"
            );

        temporaryTextArea.value =
            text;

        document.body.appendChild(
            temporaryTextArea
        );

        temporaryTextArea.select();

        document.execCommand(
            "copy"
        );

        temporaryTextArea.remove();

        alert(successMessage);
    }
}

/* ================================
   WHATSAPP LINK
================================ */

function updateWhatsAppLink() {
    const contact =
        getSavedContact();

    if (!contact) {
        whatsappEmergencyBtn.classList.add(
            "disabled-link"
        );

        whatsappEmergencyBtn.href = "#";

        return;
    }

    const cleanPhone =
        contact.phone.replace(
            /\D/g,
            ""
        );

    const messageText =
        emergencyMessage.value.trim();

    const whatsappUrl =
        "https://wa.me/" +
        cleanPhone +
        "?text=" +
        encodeURIComponent(
            messageText
        );

    whatsappEmergencyBtn.href =
        whatsappUrl;

    whatsappEmergencyBtn.target =
        "_blank";

    whatsappEmergencyBtn.rel =
        "noopener noreferrer";

    whatsappEmergencyBtn.classList.remove(
        "disabled-link"
    );
}

/* ================================
   BUTTON EVENTS
================================ */

getLocationBtn.addEventListener(
    "click",
    requestLocation
);

stopTrackingBtn.addEventListener(
    "click",
    stopLocationTracking
);

refreshLocationBtn.addEventListener(
    "click",
    function () {
        stopLocationTracking();

        firstLocationDetected =
            false;

        requestLocation();
    }
);

copyLocationBtn.addEventListener(
    "click",
    function () {
        if (!currentLocation) {
            alert(
                "Please detect your location first."
            );

            return;
        }

        copyText(
            getCoordinateText(),
            "Coordinates copied successfully."
        );
    }
);

/* ================================
   SAVE CONTACT
================================ */

emergencyContactForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const name =
            emergencyContactName.value.trim();

        const phone =
            emergencyContactPhone.value.trim();

        if (!name || !phone) {
            alert(
                "Please enter a contact name and phone number."
            );

            return;
        }

        saveContact({
            name: name,
            phone: phone
        });

        displaySavedContact();

        alert(
            "Emergency contact saved successfully."
        );
    }
);

/* ================================
   ADD LOCATION TO MESSAGE
================================ */

addLocationToMessageBtn.addEventListener(
    "click",
    function () {
        if (!currentLocation) {
            alert(
                "Please get your current location first."
            );

            return;
        }

        const mapLink =
            "https://www.google.com/maps?q=" +
            currentLocation.latitude +
            "," +
            currentLocation.longitude;

        const locationText =
            "\n\nCurrent location:\n" +
            getCoordinateText() +
            "\nAccuracy: " +
            Math.round(
                currentLocation.accuracy
            ) +
            " metres" +
            "\nMap: " +
            mapLink;

        if (
            emergencyMessage.value.includes(
                "Current location:"
            )
        ) {
            const messageBeforeLocation =
                emergencyMessage.value.split(
                    "\n\nCurrent location:"
                )[0];

            emergencyMessage.value =
                messageBeforeLocation +
                locationText;
        } else {
            emergencyMessage.value =
                emergencyMessage.value.trim() +
                locationText;
        }

        updateWhatsAppLink();
    }
);

/* ================================
   COPY EMERGENCY MESSAGE
================================ */

copyEmergencyMessageBtn.addEventListener(
    "click",
    function () {
        const message =
            emergencyMessage.value.trim();

        if (!message) {
            alert(
                "Emergency message is empty."
            );

            return;
        }

        copyText(
            message,
            "Emergency message copied successfully."
        );
    }
);

/* ================================
   MESSAGE INPUT
================================ */

emergencyMessage.addEventListener(
    "input",
    updateWhatsAppLink
);

/* ================================
   WHATSAPP BUTTON
================================ */

whatsappEmergencyBtn.addEventListener(
    "click",
    function (event) {
        if (
            whatsappEmergencyBtn.classList.contains(
                "disabled-link"
            )
        ) {
            event.preventDefault();

            alert(
                "Please save an emergency contact first."
            );
        }
    }
);

/* ================================
   PAGE INITIALIZATION
================================ */

displaySavedContact();