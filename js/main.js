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

const registerJob = () => {
    fetch("https://6487a5a4beba62972790debd.mockapi.io/jobs", {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJob())
    })
}

getJobs()

const renderJobs = (jobs) => {
    for (const { name, category, location} of jobs) {
        $("#job-container").innerHTML += `
            <div class="job-card">
                <img class="job-image" src="">
                <h3>${name}</h3>
                <p class="text">${location}</p>
                <p class="text">${category}</p>
                <button class="see-details">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `
    }
}

const saveJob = () => {     
    return {
        name: $("#name").value,
        image: $("#image").value,
        description: $("#description").value,
        category: $("#category").value,
        description: $("#description").value,
        salary: $("#salary").value,
    }
}

$(".create-job-btn").addEventListener("click", (e) => {
    $("#modal-container").style.display = "block"
})

$("#btn-close-modal").addEventListener("click", () => {
    $("#modal-container").style.display = "none"
})


$("#form").addEventListener("submit", (e) => {  
    e.preventDefault() 
    registerJob()
    $("#form").reset()
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        $("#modal-container").style.display = "none"
    }
})

