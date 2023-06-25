const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const cleanContainer = (selector) => $(selector).innerHTML = ""

const hideElement = (selector) => $(selector).style.display = "none"
const showElement = (selector) => $(selector).style.display = "flex"

const getJobs = () => {
    fetch(`https://6487a5a4beba62972790debd.mockapi.io/jobs`)
        .then(res => res.json())
        .then(job => renderJobs(job))
}

getJobs()

const renderJobs = (jobs) => {
    for (const {image, name, description} of jobs) {
        $("#job-container").innerHTML += `
            <div class="job-card">
                <img class="job-image" src="${image}">
                <h3>${name}</h3>
                <p class="text">${description.slice(0, 130)}...</p>
                <button class="details-btn">See Details</button>
            </div>
        `
    }
}

$(".create-job-btn").addEventListener("click", (e) => {
    $("#modal-container").style.display = "block"
})

$("#btn-close-modal").addEventListener("click", () => {
    $("#modal-container").style.display = "none"
})

window.addEventListener("click", (e) => {
    if (e.target == $("#modal-container")) {
        $("#modal-container").style.display = "none"
    }
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        $("#modal-container").style.display = "none"
    }
})