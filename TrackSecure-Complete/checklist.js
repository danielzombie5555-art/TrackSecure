const defaultChecklistItems = [
    {
        id: "water",
        name: "Drinking Water",
        category: "food",
        icon: "💧",
        required: true
    },
    {
        id: "energy-food",
        name: "Energy Food",
        category: "food",
        icon: "🍫",
        required: true
    },
    {
        id: "hiking-shoes",
        name: "Hiking Shoes",
        category: "essential",
        icon: "🥾",
        required: true
    },
    {
        id: "backpack",
        name: "Hiking Backpack",
        category: "essential",
        icon: "🎒",
        required: true
    },
    {
        id: "raincoat",
        name: "Raincoat",
        category: "clothing",
        icon: "🌧️",
        required: true
    },
    {
        id: "extra-shirt",
        name: "Extra Shirt",
        category: "clothing",
        icon: "👕",
        required: false
    },
    {
        id: "jacket",
        name: "Warm Jacket",
        category: "clothing",
        icon: "🧥",
        required: false
    },
    {
        id: "cap",
        name: "Cap or Hat",
        category: "clothing",
        icon: "🧢",
        required: false
    },
    {
        id: "first-aid",
        name: "First Aid Kit",
        category: "safety",
        icon: "🩹",
        required: true
    },
    {
        id: "headlamp",
        name: "Headlamp",
        category: "safety",
        icon: "🔦",
        required: true
    },
    {
        id: "whistle",
        name: "Emergency Whistle",
        category: "safety",
        icon: "📣",
        required: true
    },
    {
        id: "power-bank",
        name: "Power Bank",
        category: "safety",
        icon: "🔋",
        required: false
    },
    {
        id: "phone",
        name: "Mobile Phone",
        category: "personal",
        icon: "📱",
        required: true
    },
    {
        id: "identification",
        name: "Identification Card",
        category: "personal",
        icon: "🪪",
        required: true
    },
    {
        id: "medicine",
        name: "Personal Medicine",
        category: "personal",
        icon: "💊",
        required: false
    },
    {
        id: "sunblock",
        name: "Sun Protection",
        category: "personal",
        icon: "☀️",
        required: false
    }
];

const categoryInformation = {
    essential: {
        title: "Essential Equipment",
        description: "Basic hiking equipment.",
        icon: "🎒"
    },

    clothing: {
        title: "Clothing",
        description: "Suitable clothing for changing weather.",
        icon: "👕"
    },

    food: {
        title: "Food & Water",
        description: "Maintain energy and hydration.",
        icon: "💧"
    },

    safety: {
        title: "Safety Equipment",
        description: "Items for safety and emergencies.",
        icon: "🚨"
    },

    personal: {
        title: "Personal Items",
        description: "Personal belongings and documents.",
        icon: "👤"
    }
};

const checklistCategories =
    document.getElementById("checklistCategories");

const checklistSearch =
    document.getElementById("checklistSearch");

const progressText =
    document.getElementById("progressText");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressBarFill =
    document.getElementById("progressBarFill");

const progressMessage =
    document.getElementById("progressMessage");

const selectAllBtn =
    document.getElementById("selectAllBtn");

const resetChecklistBtn =
    document.getElementById("resetChecklistBtn");

const checklistEmptyState =
    document.getElementById("checklistEmptyState");

const customItemForm =
    document.getElementById("customItemForm");

const customItemInput =
    document.getElementById("customItemInput");

const customCategoryInput =
    document.getElementById("customCategoryInput");

function getSavedCheckedItems() {
    try {
        return JSON.parse(
            localStorage.getItem("checkedPackingItems")
        ) || [];
    } catch (error) {
        return [];
    }
}

function getCustomItems() {
    try {
        return JSON.parse(
            localStorage.getItem("customPackingItems")
        ) || [];
    } catch (error) {
        return [];
    }
}

function saveCheckedItems(items) {
    localStorage.setItem(
        "checkedPackingItems",
        JSON.stringify(items)
    );
}

function saveCustomItems(items) {
    localStorage.setItem(
        "customPackingItems",
        JSON.stringify(items)
    );
}

function getAllChecklistItems() {
    return [
        ...defaultChecklistItems,
        ...getCustomItems()
    ];
}

function createChecklistItem(item, checkedItems) {
    const itemLabel =
        document.createElement("label");

    itemLabel.className = "packing-checklist-item";

    const isChecked =
        checkedItems.includes(item.id);

    itemLabel.innerHTML = `
        <input
            type="checkbox"
            data-item-id="${item.id}"
            ${isChecked ? "checked" : ""}
        >

        <span class="packing-item-icon">
            ${item.icon}
        </span>

        <span class="packing-item-details">
            <strong>${item.name}</strong>

            <small>
                ${item.required
                    ? "Recommended"
                    : "Optional"}
            </small>
        </span>

        ${
            item.custom
                ? `
                    <button
                        type="button"
                        class="delete-custom-item-btn"
                        data-delete-id="${item.id}"
                        aria-label="Delete ${item.name}"
                    >
                        ×
                    </button>
                `
                : ""
        }
    `;

    return itemLabel;
}

function displayChecklist(searchKeyword = "") {
    const allItems = getAllChecklistItems();
    const checkedItems = getSavedCheckedItems();

    checklistCategories.innerHTML = "";

    let visibleItemCount = 0;

    Object.keys(categoryInformation).forEach(
        function (categoryId) {
            const category =
                categoryInformation[categoryId];

            const categoryItems =
                allItems.filter(function (item) {
                    const matchesCategory =
                        item.category === categoryId;

                    const matchesSearch =
                        item.name
                            .toLowerCase()
                            .includes(
                                searchKeyword.toLowerCase()
                            );

                    return (
                        matchesCategory &&
                        matchesSearch
                    );
                });

            if (categoryItems.length === 0) {
                return;
            }

            visibleItemCount +=
                categoryItems.length;

            const categorySection =
                document.createElement("section");

            categorySection.className =
                "packing-category-card";

            categorySection.innerHTML = `
                <div class="packing-category-header">

                    <span>${category.icon}</span>

                    <div>
                        <h2>${category.title}</h2>
                        <p>${category.description}</p>
                    </div>

                </div>

                <div class="packing-items-grid"></div>
            `;

            const itemGrid =
                categorySection.querySelector(
                    ".packing-items-grid"
                );

            categoryItems.forEach(function (item) {
                itemGrid.appendChild(
                    createChecklistItem(
                        item,
                        checkedItems
                    )
                );
            });

            checklistCategories.appendChild(
                categorySection
            );
        }
    );

    checklistEmptyState.style.display =
        visibleItemCount === 0
            ? "block"
            : "none";

    addChecklistEvents();
    updateProgress();
}

function addChecklistEvents() {
    const checkboxes =
        document.querySelectorAll(
            "[data-item-id]"
        );

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener(
            "change",
            function () {
                let checkedItems =
                    getSavedCheckedItems();

                const itemId =
                    checkbox.dataset.itemId;

                if (checkbox.checked) {
                    if (
                        !checkedItems.includes(itemId)
                    ) {
                        checkedItems.push(itemId);
                    }
                } else {
                    checkedItems =
                        checkedItems.filter(
                            function (savedItemId) {
                                return (
                                    savedItemId !== itemId
                                );
                            }
                        );
                }

                saveCheckedItems(checkedItems);
                updateProgress();
            }
        );
    });

    const deleteButtons =
        document.querySelectorAll(
            "[data-delete-id]"
        );

    deleteButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function (event) {
                event.preventDefault();

                deleteCustomItem(
                    button.dataset.deleteId
                );
            }
        );
    });
}

function updateProgress() {
    const allItems = getAllChecklistItems();
    const checkedItems = getSavedCheckedItems();

    const validCheckedItems =
        checkedItems.filter(function (itemId) {
            return allItems.some(
                function (item) {
                    return item.id === itemId;
                }
            );
        });

    const totalItems = allItems.length;
    const completedItems =
        validCheckedItems.length;

    const percentage =
        totalItems === 0
            ? 0
            : Math.round(
                completedItems /
                totalItems *
                100
            );

    progressText.textContent =
        completedItems +
        " of " +
        totalItems +
        " items prepared";

    progressPercentage.textContent =
        percentage + "%";

    progressBarFill.style.width =
        percentage + "%";

    if (percentage === 100) {
        progressMessage.textContent =
            "Your hiking equipment is fully prepared!";
    } else if (percentage >= 75) {
        progressMessage.textContent =
            "Almost ready. Check the remaining items.";
    } else if (percentage >= 40) {
        progressMessage.textContent =
            "Good progress. Continue your preparation.";
    } else {
        progressMessage.textContent =
            "Start preparing your hiking equipment.";
    }
}

function deleteCustomItem(itemId) {
    const customItems =
        getCustomItems();

    const updatedItems =
        customItems.filter(function (item) {
            return item.id !== itemId;
        });

    let checkedItems =
        getSavedCheckedItems();

    checkedItems =
        checkedItems.filter(function (id) {
            return id !== itemId;
        });

    saveCustomItems(updatedItems);
    saveCheckedItems(checkedItems);

    displayChecklist(
        checklistSearch.value.trim()
    );
}

checklistSearch.addEventListener(
    "input",
    function () {
        displayChecklist(
            checklistSearch.value.trim()
        );
    }
);

selectAllBtn.addEventListener(
    "click",
    function () {
        const allItemIds =
            getAllChecklistItems().map(
                function (item) {
                    return item.id;
                }
            );

        saveCheckedItems(allItemIds);

        displayChecklist(
            checklistSearch.value.trim()
        );
    }
);

resetChecklistBtn.addEventListener(
    "click",
    function () {
        const confirmed =
            window.confirm(
                "Reset all packing checklist items?"
            );

        if (!confirmed) {
            return;
        }

        saveCheckedItems([]);

        displayChecklist(
            checklistSearch.value.trim()
        );
    }
);

customItemForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const itemName =
            customItemInput.value.trim();

        if (!itemName) {
            return;
        }

        const customItems =
            getCustomItems();

        const newItem = {
            id:
                "custom-" +
                Date.now(),

            name: itemName,

            category:
                customCategoryInput.value,

            icon: "➕",

            required: false,

            custom: true
        };

        customItems.push(newItem);

        saveCustomItems(customItems);

        customItemInput.value = "";

        displayChecklist(
            checklistSearch.value.trim()
        );
    }
);

displayChecklist();