// DOM Elements
const barsContainer = document.getElementById("barsContainer");
const arraySize = document.getElementById("arraySize");
const generateArrayBtn = document.getElementById("generateArray");
const startSortingBtn = document.getElementById("startSorting");
const stopSortingBtn = document.getElementById("stopSorting"); // Stop button
const algorithmSelect = document.getElementById("algorithm");
const speedSlider = document.getElementById("speedSlider");

// Initial Array
let array = [];
let isSorting = false;  // Flag to control sorting process

// Generate Array
function generateArray() {
    const size =  arraySize.value;
    console.log(size);// Ensure minimum size is 40
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 19) - 9); // Numbers between -9 and 9
    renderArray();
}

// Render Bars with Values
// Generate Array with Color Representation
function renderArray() {
    
    barsContainer.innerHTML = ""; // Clear previous bars and values
    array.forEach((value, index) => {
        // Create Bar Element
        const barWrapper = document.createElement("div");
        barWrapper.style.display = "flex";
        barWrapper.style.flexDirection = "column";
        barWrapper.style.alignItems = "center";

        // Create Bar
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${Math.abs(value) * 30}px`; // Height increased to *30 for better visibility
        bar.style.width = 30 + `px`;

        // Set Bar Color based on Value
        if (value < 0) {
            bar.style.backgroundColor = "red"; // Red for negative values
        } else {
            bar.style.backgroundColor = "blue"; // Blue for positive values
        }

        // Create Value Label
        const valueLabel = document.createElement("div");
        valueLabel.classList.add("value");
        valueLabel.style.marginTop = "5px";  // Space between bar and value
        valueLabel.textContent = value;

        // Set Value Label Color based on Value
        if (value < 0) {
            valueLabel.style.color = "red"; // Red for negative values
        } else {
            valueLabel.style.color = "blue"; // Blue for positive values
        }

        // Append Bar and Value
        barWrapper.appendChild(bar);
        barWrapper.appendChild(valueLabel);
        barsContainer.appendChild(barWrapper);
    });
}

// Sorting Algorithms
async function startSorting() {
    if (isSorting) return;  // Prevent multiple starts of sorting

    isSorting = true;  // Set flag to true when sorting starts
    startSortingBtn.disabled = true;  // Disable the start button while sorting
    const algorithm = algorithmSelect.value;

    if (algorithm === "bubble") await bubbleSort();
    if (algorithm === "selection") await selectionSort();
    if (algorithm === "insertion") await insertionSort();
    if (algorithm === "merge") await mergeSort(0, array.length - 1);
    if (algorithm === "quick") await quickSort(0, array.length - 1);

    renderArray(); // Ensure the final state is rendered
    isSorting = false;  // Reset sorting flag when done
    startSortingBtn.disabled = false;  // Re-enable the start button when done
}

// Bubble Sort
async function bubbleSort() {
    const bars = document.querySelectorAll(".bar");
    const speed = Math.max(50, 300 - speedSlider.value * 30); // Minimum delay is 50ms

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting) return;  // Stop sorting if flag is false

            bars[j].style.background = "red";
            bars[j + 1].style.background = "red";

            if (array[j] > array[j + 1]) {
                await sleep(speed);
                swap(j, j + 1, bars);
            }

            bars[j].style.background = "#6200ea";
            bars[j + 1].style.background = "#6200ea";
        }
        bars[array.length - i - 1].style.background = "green"; // Mark sorted
    }
}

// Selection Sort
async function selectionSort() {
    const bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length; i++) {
        if (!isSorting) return;  // Stop sorting if flag is false

        let minIndex = i;
        bars[minIndex].style.background = "green";
        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.background = "red";
            if (array[j] < array[minIndex]) {
                bars[minIndex].style.background = "#6200ea";
                minIndex = j;
                bars[minIndex].style.background = "green";
            }
            await new Promise((resolve) =>
                setTimeout(resolve, 300 / speedSlider.value)
            );
            bars[j].style.background = "#6200ea";
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            renderArray();
        }
        bars[minIndex].style.background = "#6200ea";
    }
}

// Insertion Sort
async function insertionSort() {
    const bars = document.getElementsByClassName("bar");
    for (let i = 1; i < array.length; i++) {
        if (!isSorting) return;  // Stop sorting if flag is false

        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key) {
            bars[j].style.background = "red";
            array[j + 1] = array[j];
            renderArray();
            await new Promise((resolve) =>
                setTimeout(resolve, 300 / speedSlider.value)
            );
            bars[j].style.background = "#6200ea";
            j--;
        }
        array[j + 1] = key;
        renderArray();
    }
}

// Merge Sort
async function mergeSort(left, right) {
    if (!isSorting) return;  // Stop sorting if flag is false
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
}

async function merge(left, mid, right) {
    const speed = Math.max(50, 300 - speedSlider.value * 30); // Minimum delay is 50ms

    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    let i = 0,
        j = 0,
        k = left;

    while (i < leftArr.length && j < rightArr.length) {
        if (!isSorting) return;  // Stop sorting if flag is false

        await sleep(speed);
        if (leftArr[i] <= rightArr[j]) {
            array[k++] = leftArr[i++];
        } else {
            array[k++] = rightArr[j++];
        }
        renderArray();
    }
    while (i < leftArr.length) array[k++] = leftArr[i++];
    while (j < rightArr.length) array[k++] = rightArr[j++];
    renderArray();
}

// Quick Sort
async function quickSort(start, end) {
    if (!isSorting) return;  // Stop sorting if flag is false
    if (start >= end) return;

    const pivotIndex = await partition(start, end);
    await quickSort(start, pivotIndex - 1);
    await quickSort(pivotIndex + 1, end);
}

async function partition(start, end) {
    const bars = document.querySelectorAll(".bar");
    const pivot = array[end];
    let i = start - 1;

    for (let j = start; j < end; j++) {
        if (!isSorting) return;  // Stop sorting if flag is false

        bars[j].style.background = "red";
        if (array[j] <= pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            renderArray();
        }
        bars[j].style.background = "#6200ea";
    }

    [array[i + 1], array[end]] = [array[end], array[i + 1]];
    renderArray();
    return i + 1;
}

// Utility Functions
// Swap Function with Value Label Movement
function swap(i, j, bars) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    // Move bar heights
    bars[i].style.height = `${Math.abs(array[i]) * 30}px`;
    bars[j].style.height = `${Math.abs(array[j]) * 30}px`;
    
    // Set Bar Colors
    bars[i].style.backgroundColor = array[i] < 0 ? "red" : "blue";
    bars[j].style.backgroundColor = array[j] < 0 ? "red" : "blue";

    // Move the value labels and update their colors
    const valueLabels = document.querySelectorAll('.value');
    valueLabels[i].textContent = array[i];
    valueLabels[j].textContent = array[j];

    valueLabels[i].style.color = array[i] < 0 ? "red" : "blue";
    valueLabels[j].style.color = array[j] < 0 ? "red" : "blue";
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Generate Array with Color Representation
function renderArray() {
    barsContainer.innerHTML = ""; // Clear previous bars and values
    array.forEach((value, index) => {
        // Create Bar Element
        const barWrapper = document.createElement("div");
        barWrapper.style.display = "flex";
        barWrapper.style.flexDirection = "column";
        barWrapper.style.alignItems = "center";

        // Create Bar
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${Math.abs(value) * 30}px`; // Height increased to *30 for better visibility
        bar.style.width = 30 + `px`;

        // Set Initial Bar Color based on Value
        if (value < 0) {
            bar.style.backgroundColor = "red"; // Red for negative values
        } else {
            bar.style.backgroundColor = "blue"; // Blue for positive values
        }

        // Create Value Label
        const valueLabel = document.createElement("div");
        valueLabel.classList.add("value");
        valueLabel.style.marginTop = "5px";  // Space between bar and value
        valueLabel.textContent = value;

        // Set Value Label Color based on Value
        if (value < 0) {
            valueLabel.style.color = "red"; // Red for negative values
        } else {
            valueLabel.style.color = "blue"; // Blue for positive values
        }

        // Append Bar and Value
        barWrapper.appendChild(bar);
        barWrapper.appendChild(valueLabel);
        barsContainer.appendChild(barWrapper);
    });
}

// Swap Function with Special Colors for Current and Swapped Bars
function swap(i, j, bars) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    // Update bar heights
    bars[i].style.height = `${Math.abs(array[i]) * 30}px`;
    bars[j].style.height = `${Math.abs(array[j]) * 30}px`;

    // Set Bar Colors for Swapping
    bars[i].style.backgroundColor = "brown"; // Swapped bar is brown
    bars[j].style.backgroundColor = "brown"; // Swapped bar is brown

    // Move the value labels and update their colors
    const valueLabels = document.querySelectorAll('.value');
    valueLabels[i].textContent = array[i];
    valueLabels[j].textContent = array[j];

    valueLabels[i].style.color = array[i] < 0 ? "red" : "blue";
    valueLabels[j].style.color = array[j] < 0 ? "red" : "blue";
}

// Sorting Algorithms with Color Changes for Current Element, Swaps, and Pivots

async function bubbleSort() {
    const bars = document.querySelectorAll(".bar");
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            // Set current bar color (dark blue)
            bars[j].style.backgroundColor = "darkblue";
            bars[j + 1].style.backgroundColor = "darkblue";

            // Wait for a moment to visualize the current comparison
            await waitForDelay();

            // Swap if necessary
            if (array[j] > array[j + 1]) {
                swap(j, j + 1, bars);
            }

            // Reset colors after swap
            bars[j].style.backgroundColor = array[j] < 0 ? "red" : "blue";
            bars[j + 1].style.backgroundColor = array[j + 1] < 0 ? "red" : "blue";
        }
    }
}

// Quick Sort with Pivot Coloring
async function quickSort(low, high) {
    const bars = document.querySelectorAll(".bar");

    if (low < high) {
        let pivotIndex = await partition(low, high, bars);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
}

async function partition(low, high, bars) {
    const pivotValue = array[high];
    const pivotBar = bars[high];

    // Set the pivot color to orange
    pivotBar.style.backgroundColor = "orange";

    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        // Set current bar to dark blue
        bars[j].style.backgroundColor = "darkblue";

        // Wait for a moment to visualize the current comparison
        await waitForDelay();

        // Compare and swap
        if (array[j] < pivotValue) {
            i++;
            swap(i, j, bars);
        }

        // Reset current bar color after processing
        bars[j].style.backgroundColor = array[j] < 0 ? "red" : "blue";
    }

    // Place pivot in the correct position
    swap(i + 1, high, bars);
    pivotBar.style.backgroundColor = "blue"; // Reset pivot color to blue
    return i + 1;
}

// Delay Function to Slow Down Sorting for Visualization
function waitForDelay() {
    return new Promise(resolve => setTimeout(resolve, speedSlider.value));
}

// Initialize Buttons and Events
generateArrayBtn.addEventListener("click", generateArray);
startSortingBtn.addEventListener("click", startSorting);
stopSortingBtn.addEventListener("click", () => {
    isSorting = false;
    startSortingBtn.disabled = false; // Re-enable the start button
});

// Event Listeners
generateArrayBtn.addEventListener("click", generateArray);
startSortingBtn.addEventListener("click", startSorting);
stopSortingBtn.addEventListener("click", () => {
    isSorting = false;  // Stop sorting when the stop button is clicked
    startSortingBtn.disabled = false; // Re-enable the start button
});

