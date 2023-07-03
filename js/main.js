const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const cleanContainer = (selector) => $(selector).innerHTML = ""

// Show or hide handlers
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
    }).finally(() => window.location.reload())
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
    .then(data => {
        renderJobs(data)
        history.replaceState(null, '', `?${url}`)
    })
}

// FILTER

const getParams = () => {
    const location = $("#filter-location").value
    const category = $("#filter-category").value
    const fruit = $("#filter-fruit").value

    if (location != "Location") {
        return new URLSearchParams( { location } ).toString()
    } if (category != "Category") {
        return new URLSearchParams( { category } ).toString()
    } else {
        return new URLSearchParams(`devilFruit=${fruit}`).toString()
    }

}

const renderJobs = (jobs) => {
    showElement("#spinner")
    if (jobs) {
        cleanContainer("#jobs-container")
        setTimeout(() => {
            hideElement("#spinner")
            for (const { id, name, category, location, devilFruit} of jobs) {
                $("#jobs-container").innerHTML += `
                    <div class="job-card">
                        <img class="card-img" src="./assets/category-photos/${category}.jpg">
                        <h3>${name}</h3>
                        <p>${location}</p>
                        <p>${category}</p>
                        <p><img class="fruit-img" src="./assets/evil-fruit.png"> ${devilFruit.join(" or ")}</p>
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
                    hideElement("footer")
                    showElement("#job-container")
                })
            }
        } , 2000)
    }
}

const renderJobDetail = (job) => {
    const { id, name, description, category, benefits: { vacations, onePiece }, location, salary, devilFruit } = job
    cleanContainer(".job-content")
    $(".job-content").innerHTML += `
        <h2>${name}</h2>
        <p><i class="fa-solid fa-location-dot"></i> ${location} <a href="https://odamap.khooz.com/" target="_blank" class="btn-location">See location</a></p>
        <p><i class="fa-solid fa-list"></i> ${category}</p>
        <button class="btn-edit" data-id="${id}"><i class="fa-solid fa-pencil"></i></button>
        <button class="btn-delete" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
        <p>Job description</p>
        <p>${description}</p>
        <p>Salary: $${salary} berries</p>
        <p>Vacations: ${vacations}</p>
        <p>${onePiece ? `Possibility of finding the One Piece` : ""}
        <p>Necessary devil fruits: ${devilFruit.join(" or ")}</p>
        <button class="btn-edit" data-id="${id}"><i class="fa-solid fa-pencil"></i></button>
        <button class="btn-delete" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
        <a class="btn-home" href="index.html"><i class="fa-solid fa-house"></i></a>
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
            hideElement("header")
            showElement("#alert")
            const jobId = btn.getAttribute("data-id")
            $("#delete-btn").setAttribute("data-id", jobId)
            $("#job-selected").innerText = `${jobId}`
        })
    }
}

const saveJob = () => {    
    let selectedFruits = []
    const checkboxes = $$(".fruit")
    
    for (var i = 0; i < 3; i++) {
      if (checkboxes[i].checked) {
        selectedFruits.push(checkboxes[i].value)
      }
    }

    return {
        name: $("#name").value,
        description: $("#description").value,
        category: $("#category").value,
        benefits: {
            vacations: $("#vacations").value,
            onePiece: $('input[name="one-piece"]:checked').value
        },
        salary: $("#salary").value,
        location: $("#location").value,
        devilFruit: selectedFruits,
    }
}

// FORM

const populateForm = ({ name, description, category, benefits: { vacations, onePiece }, location, salary, devilFruit }) => {
    $("#name").value = name
    $("#description").value = description
    $("#category").value = category
    $("#vacations").value = vacations
    $("#salary").value = salary
    $("#location").value = location
    
    const radioButtons = $$(".one-piece")
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].value === onePiece.toString()) {
        radioButtons[i].checked = true
        }
    }

    const checkboxes = $$(".fruit")
    for (var i = 0; i < 3; i++) {
        const checkbox = checkboxes[i]
        if (devilFruit.includes(checkbox.value)) {
            checkbox.checked = true
        }
    }
}

const validateForm = () => {
    const name = $("#name").value
    const description = $("#description").value
    const vacations = $("#vacations").value
    const salary = $("#salary").value
    const devilFruit = [...$$(".fruit")]

    if (name == "") {
        showElement([".name-error"])
    } else {
        hideElement([".name-error"])
    }

    if (description == "") {
        showElement([".description-error"])
    } else {
        hideElement([".description-error"])
    }

    if (salary == "") {
        showElement([".salary-error"])
    } else {
        hideElement([".salary-error"])
    }

    if (vacations == "") {
        showElement([".vacations-error"])
    } else {
        hideElement([".vacations-error"])
    }

    const oneSelected = devilFruit.some((checkbox) => checkbox.checked )
    
    if (!oneSelected) {
        showElement([".fruit-error"])
    } else {
        hideElement([".fruit-error"])
    }

    return name !== "" && description !== "" && vacations !== "" && salary !== "" && oneSelected != false
}

const initializeApp = () => {
    
    getJobs()

    // BUTTONS

    const buttonsCreateJob = $$(".create-job-btn")
    for (const button of buttonsCreateJob) {
        button.addEventListener("click", () => {
            $("#form").reset()
            showElement("#modal-container")
            hideElement("#edit-btn")
            isSubmit = true 
        })
    }

    $("#btn-close-modal").addEventListener("click", () => {
        $("#modal-container").style.display = "none"
    })

    $("#form").addEventListener("submit", (e) => {  
        e.preventDefault() 
        if (validateForm()) {
            if (isSubmit) {
                registerJob()
                $("#form").reset()
            } else {
                const jobId = $("#edit-btn").getAttribute("data-id")
                editJob(jobId)
            }
        }
    })

    $("#delete-btn").addEventListener("click", () => {
        const jobId = $("#delete-btn").getAttribute("data-id")
        deleteJob(jobId)
    })

    $("#cancel-btn").addEventListener("click", () => {
        hideElement("#alert")
        showElement("#job-container")
        showElement("header")
    })

    $("#filter-category").addEventListener("click", () => {
        $("#filter-location").disabled = true
        $("#filter-fruit").disabled = true
    })
    
    $("#filter-location").addEventListener("click", () => {
        $("#filter-category").disabled = true
        $("#filter-fruit").disabled = true
    })
    
    $("#filter-fruit").addEventListener("click", () => {
        $("#filter-location").disabled = true
        $("#filter-category").disabled = true
    })

    $(".search-btn").addEventListener("click", (e) => {
        e.preventDefault()
        const url = getParams()
        filterJob(url)
    })

    $(".burger-menu").addEventListener("click", () => {
        showElement(".menu-container")
        showElement(".close-burger-menu")
        hideElement(".burger-menu")
    })

    $(".close-burger-menu").addEventListener("click", () => {
        showElement(".burger-menu")
        hideElement(".menu-container")
        hideElement(".close-burger-menu")
    })

    $(".reset-btn").addEventListener("click", () => {
        $("#filter-location").disabled = false
        $("#filter-category").disabled = false
        $("#filter-fruit").disabled = false
        $(".search-form").reset()
        getJobs()
    })

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            $("#modal-container").style.display = "none"
        }
    })

}

window.addEventListener("load", initializeApp)