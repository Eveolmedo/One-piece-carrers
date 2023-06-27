const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const cleanContainer = (selector) => $(selector).innerHTML = ""

const hideElement = (selector) => $(selector).style.display = "none"
const showElement = (selector) => $(selector).style.display = "block"

let isSubmit = false 

const getJobs = (jobId = "") => {
    fetch(`https://6487a5a4beba62972790debd.mockapi.io/jobs/${jobId}`)
        .then(res => res.json())
        .then(job => {
            if (jobId === "") {
                renderJobs(job)
            } else {
                renderJobDetail(job)
                populateForm(job)
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

const editJob = (jobId) => {
    fetch(`https://6487a5a4beba62972790debd.mockapi.io/jobs/${jobId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJob())
    }).finally(() => window.location.reload())
}

const deleteJob = (jobId) => {
    fetch(`https://6487a5a4beba62972790debd.mockapi.io/jobs/${jobId}`, {
        method: "DELETE",
    }).finally(() => window.location.reload())
}

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
        <button class="btn-edit" data-id="${id}">Editar</button>
        <button class="btn-delete" data-id="${id}">Eliminar</button>
        <p>Job description</p>
        <p>${description}</p>
        <p>Salary: ${salary}</p>
        <p>Fruit: $${fruits}</p>
    `

    for (const btn of $$(".btn-edit")) {
        btn.addEventListener("click", () => {
            showElement("#modal-container")
            hideElement(".submit-btn")
            showElement("#edit-btn")
            const jobId = btn.getAttribute("data-id")
            $("#edit-btn").setAttribute("data-id", jobId)
            getJobs(jobId)
            isSubmit = false
        })
    }

    for (const btn of $$(".btn-delete")) {
        btn.addEventListener("click", () => {
            hideElement("#job-container")
            showElement("#alert")
            const jobId = btn.getAttribute("data-id")
            $("#delete-btn").setAttribute("data-id", jobId)
            $("#job-selected").innerText = `${jobId}`
        })
    }
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

const populateForm = ({ name, image, description, category, location, salary, fruits }) => {
    $("#name").value = name
    $("#image").value = image
    $("#description").value = description
    $("#category").value = category
    $("#location").value = location
    $("#salary").value = salary
    $(".radio").value = fruits
}

$(".create-job-btn").addEventListener("click", (e) => {
    showElement("#modal-container")
    hideElement("#edit-btn")
    isSubmit = true 
})

$("#btn-close-modal").addEventListener("click", () => {
    $("#modal-container").style.display = "none"
})

$("#form").addEventListener("submit", (e) => {  
    e.preventDefault() 
    if (isSubmit) {
        registerJob()
    } else {
        const jobId = $("#edit-btn").getAttribute("data-id")
        editJob(jobId)
    }
    $("#form").reset()
})

$("#delete-btn").addEventListener("click", () => {
    const jobId = $("#delete-btn").getAttribute("data-id")
    deleteJob(jobId)
})

$("#cancel").addEventListener("click", () => {
    hideElement("#alert")
    showElement("#job-container")
})


window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        $("#modal-container").style.display = "none"
    }
})

window.addEventListener("load", () => {
    getJobs()
})


// cambiar url!!
