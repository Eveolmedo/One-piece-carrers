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

const filterJob = (url) => {
    fetch(`https://6487a5a4beba62972790debd.mockapi.io/jobs?${url}`)
        .then(res => res.json())
        .then(data => renderJobs(data))
}

const getParams = () => {
    const location = $("#filter-location").value
    const category = $("#filter-category").value
    const fruit = $("#filter-fruit").value

    if (location != "location") {
        const url = new URLSearchParams(`location=${location}`).toString()
        return url
    } if (category != "category") {
        const url = new URLSearchParams(`category=${category}`).toString()
        return url
    } else {
        const url = new URLSearchParams(`devilFruit=${fruit}`).toString()
        return url
    }
}

const renderJobs = (jobs) => {
    cleanContainer("#jobs-container")
    for (const { id, name, image, category, location} of jobs) {
        $("#jobs-container").innerHTML += `
            <div class="job-card">
                <img src="./assets/category-photos/${category}.jpg">
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
    const { id, name, description, category, benefits: { vacations, onePiece }, location, salary, devilFruit } = job
    cleanContainer(".job-content")
    $(".job-content").innerHTML += `
        <h2>${name}</h2>
        <p><i class="fa-solid fa-location-dot"></i> ${location}</p>
        <p><i class="fa-solid fa-list"></i> ${category}</p>
        <button class="btn-edit" data-id="${id}"><i class="fa-solid fa-pencil"></i></button>
        <button class="btn-delete" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
        <p>Job description</p>
        <p>${description}</p>
        <p>Salary: $${salary} berries</p>
        <p>Vacations: ${vacations}</p>
        <p>${onePiece ? `Possibility of finding the One Piece` : ""}
        <p>Necessary devil fruits: ${devilFruit} </p>
        <button class="btn-edit" data-id="${id}"><i class="fa-solid fa-pencil"></i></button>
        <button class="btn-delete" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
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
        description: $("#description").value,
        category: $("#category").value,
        location: $("#location").value,
        salary: $("#salary").valueAsNumber,
        fruits: $(".radio").value,
    }
}

const populateForm = ({ name, description, category, location, salary, fruits }) => {
    $("#name").value = name
    $("#description").value = description
    $("#category").value = category
    $("#location").value = location
    $("#salary").valueAsNumber = salary
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

$("#filter-category").addEventListener("click", () => {
    $("#filter-location").disabled = true;
    $("#filter-fruit").disabled = true;
});
  
$("#filter-location").addEventListener("click", () => {
    $("#filter-category").disabled = true;
    $("#filter-fruit").disabled = true;
});
  
$("#filter-fruit").addEventListener("click", () => {
    $("#filter-location").disabled = true;
    $("#filter-category").disabled = true;
});

$(".search-btn").addEventListener("click", (e) => {
    e.preventDefault()
    const url = getParams()
    filterJob(url)
})

$(".reset-btn").addEventListener("click", (e) => {
    e.preventDefault()
    $("#filter-location").disabled = false;
    $("#filter-category").disabled = false;
    $("#filter-fruit").disabled = false;
    $(".search-form").reset()
    getJobs()
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
