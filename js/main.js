const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const cleanContainer = (selector) => $(selector).innerHTML = ""

const hideElement = (selector) => $(selector).style.display = "none"
const showElement = (selector) => $(selector).style.display = "flex"

const getJobs = (jobId = "") => {
    fetch(`https://6487a5a4beba62972790debd.mockapi.io/jobs/${jobId}`)
        .then(res => res.json())
        .then(job => {
            if (jobId === "") {
                renderJobs(job)
            } else {
                renderJobDetail(job)
            }
        })
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
    for (const { id, name, image, category, location} of jobs) {
        $("#jobs-container").innerHTML += `
            <div class="job-card">
                <img class="job-image" src="">
                <h3>${name}</h3>
                <p class="text">${location}</p>
                <p class="text">${category}</p>
                <button class="see-details-btn" onclick="getJobs('${id}')">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `
    }

    for (const btn of $$(".see-details-btn")){
        btn.addEventListener("click" , () => {
            hideElement(".banner")
            hideElement("#jobs-container")
            showElement("#job-container")
        })
    }
}

const renderJobDetail = (job) => {
    console.log(job)
    const { id, name, image, description, category, location, salary, fruits } = job
    cleanContainer(".job-content")
    $(".job-content").innerHTML += `
        <h2>${name}</h2>
        <p><i class="fa-solid fa-location-dot"></i> ${location}</p>
        <p><i class="fa-solid fa-grid-2"></i> ${category}</p>
        <button data-id="${id}">Editar</button>
        <button data-id="${id}">Eliminar</button>
        <p>Job description</p>
        <p>${description}</p>
        <p>Salary: ${salary}</p>
        <p>Fruit: $${fruits}</p>
    `
}

const saveJob = () => {     
    return {
        name: $("#name").value,
        image: $("#image").value,
        description: $("#description").value,
        category: $("#category").value,
        location: $("#location").value,
        salary: $("#salary").value,
        fruits: $(".radio").value,
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

// cambiar url!!
