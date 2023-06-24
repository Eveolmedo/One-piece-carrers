const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const cleanContainer = (selector) => $(selector).innerHTML = ""

const hideElement = (selector) => $(selector).style.display = "none"
const showElement = (selector) => $(selector).style.display = "block"

const getJobs = () => {
    fetch(`https://6487a5a4beba62972790debd.mockapi.io/jobs`)
        .then(res => res.json())
        .then(job => renderJobs(job))
}

getJobs()

const renderJobs = (jobs) => {
    for (const {image, name, category} of jobs) {
        $("#job-container").innerHTML += `
            <div class="job-card">
                <img class="job-image" src="${image}">
                <h3>${name}</h3>
                <p>${category}</p>
            </div>
        `
    }
}

