const REQUIRED_STYLE = {
    title: "Required",
    poolClass: "required-pool"
}
const ELECTIVE_STYLE = {
    title: "Elective",
    poolClass: "elective-pool"
}

const requiredSidebar = document.getElementById("required-selected")
const electiveSidebar = document.getElementById("elective-selected")

const REQUIRED_DATA = {
    map: new Map(),
    array: [],
    sidebar: requiredSidebar,
}
const ELECTIVE_DATA = {
    map: new Map(),
    array: [],
    sidebar: electiveSidebar,
}

const tracksDiv = document.getElementById("tracks-div")

//tracks is defined in data/data.js
tracks.forEach((track) => {
    const column = document.createElement("div")
    column.className = "track-column"
    const title = document.createTextNode(track.id)

    column.appendChild(title)

    const requiredParent = createCoursesPoolParent(track.required, REQUIRED_STYLE)
    const electiveParent = createCoursesPoolParent(track.elective, ELECTIVE_STYLE)

    track.required.options.forEach(
        (courseOption) => createCoursesPool(courseOption, requiredParent, REQUIRED_DATA, ELECTIVE_DATA)
    )
    track.elective.options.forEach(
        (courseOption) => createCoursesPool(courseOption, electiveParent, ELECTIVE_DATA, REQUIRED_DATA)
    )
    column.append(requiredParent)
    column.append(electiveParent)
    tracksDiv.appendChild(column)
})

function createCoursesPool(courseOption, pool, main, alt) {
    let parent;
    if (courseOption.type == "none") {
        parent = pool
    }
    else if (courseOption.type == "choose" || courseOption.type == "overflow") {
        parent = document.createElement("div")
        parent.className = "choose-div"
        parent.innerHTML = "Choose 1"
        pool.appendChild(parent)
    }

    courseOption.courses.forEach((course) => {
        const courseButton = createToggleButton(course.id, main, alt)
        parent.appendChild(courseButton)

        if (main.map.has(course.id)) {
            const newList = main.map.get(course.id);
            newList.push(courseButton)
            main.map.set(course.id, newList)
        } else {
            main.map.set(course.id, [courseButton])
        }
    })
}

function createCoursesPoolParent(trackPool, style) {
    const pool = document.createElement("div")
    pool.className = "course-type-div"
    pool.classList.add(style.poolClass)
    const poolTitle = document.createTextNode(style.title)
    const poolCourseReq = document.createTextNode(" "+trackPool.num)
    pool.appendChild(poolTitle)
    pool.appendChild(poolCourseReq)

    return pool
}

function createToggleButton(text, main, alt) {
    const button = document.createElement("button")
    button.innerHTML = text
    button.className = "toggle"

    button.addEventListener("mouseover", () => {
        main.map.get(text).forEach((courseButton) => {
            courseButton.classList.add("hover-course")
        })
        if (alt.map.has(text)) {
            alt.map.get(text).forEach((courseButton) => {
                courseButton.classList.add("hover-conflict-course")
            })
        }
    })
    button.addEventListener("mouseout", () => {
        main.map.get(text).forEach((courseButton) => {
            courseButton.classList.remove("hover-course")
        })
        if (alt.map.has(text)) {
            alt.map.get(text).forEach((courseButton) => {
                courseButton.classList.remove("hover-conflict-course")
            })
        }
    })


    button.addEventListener("click", () => {
        //Deselect course
        let mainFunc;
        let altFunc;
        if (button.classList.contains("selected-course")) {
            main.array.splice(main.array.indexOf(text), 1)
            mainFunc = function (courseButton) {
                courseButton.classList.remove("selected-course")
            }
            altFunc = function (courseButton) {
                courseButton.classList.remove("selected-conflict-course")
            }
            removeFromSidebar(text, main.sidebar)
        }
        //Switches course to opposite type
        else if (button.classList.contains("selected-conflict-course")) {
            alt.array.splice(alt.array.indexOf(text), 1)
            main.array.push(text)
            mainFunc = function (courseButton) {
                courseButton.classList.remove("selected-conflict-course")
                courseButton.classList.add("selected-course")
            }
            altFunc = function (courseButton) {
                courseButton.classList.remove("selected-course")
                courseButton.classList.add("selected-conflict-course")
            }
            removeFromSidebar(text, alt.sidebar)
            addToSidebar(text, main.sidebar, main, alt)
        }
        //Select course
        else {
            main.array.push(text)
            mainFunc = function (courseButton) {
                courseButton.classList.add("selected-course")
            }
            altFunc = function (courseButton) {
                courseButton.classList.add("selected-conflict-course")
            }
            addToSidebar(text, main.sidebar, main, alt)
        }

        main.map.get(text).forEach((courseButton) => {
            mainFunc(courseButton)
        })
        if (alt.map.has(text)) {
            alt.map.get(text).forEach((courseButton) => {
                altFunc(courseButton)
            })
        }
    })
    return button
}

function addToSidebar(title, sidebar, main, alt) {
    const button = document.createElement("button")
    button.innerHTML = title
    button.className = "sidebar-button"
    button.id = title.replace(" ", "-")
    //TODO button event handlers
    sidebar.appendChild(button)

    button.addEventListener("mouseover", () => {
        main.map.get(title).forEach((courseButton) => {
            courseButton.classList.add("hover-course")
        })
        if (alt.map.has(title)) {
            alt.map.get(title).forEach((courseButton) => {
                courseButton.classList.add("hover-conflict-course")
            })
        }
    })
    button.addEventListener("mouseout", () => {
        main.map.get(title).forEach((courseButton) => {
            courseButton.classList.remove("hover-course")
        })
        if (alt.map.has(title)) {
            alt.map.get(title).forEach((courseButton) => {
                courseButton.classList.remove("hover-conflict-course")
            })
        }
    })
    button.addEventListener("click", ()=>{
        // console.log("hello")
        main.map.get(title).forEach((courseButton) => {
            courseButton.classList.remove("hover-course")
        })
        if (alt.map.has(title)) {
            alt.map.get(title).forEach((courseButton) => {
                courseButton.classList.remove("hover-conflict-course")
            })
        }
        main.map.get(title).forEach((courseButton) => {
            courseButton.classList.remove("selected-course")
        })
        if (alt.map.has(title)) {
            alt.map.get(title).forEach((courseButton) => {
                courseButton.classList.remove("selected-conflict-course")
            })
        }
        sidebar.removeChild(button)
    })

}
function removeFromSidebar(title, sidebar) {
    const button = document.getElementById(title.replace(" ", "-"))
    sidebar.removeChild(button)
}