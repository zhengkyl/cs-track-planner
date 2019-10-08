var REQUIRED_STYLE = {
    title : "Required",
    poolClass : "required-pool"
}
var ELECTIVE_STYLE = {
    title : "Elective",
    poolClass : "elective-pool"
}

tracksDiv = document.getElementById("tracks-div")

var requiredCoursesMap = new Map()
var electiveCoursesMap = new Map()

//tracks is defined in data/data.js
tracks.forEach((track) => {
    var column = document.createElement("div")
    column.className = "track-column"
    var title = document.createTextNode(track.id)

    column.appendChild(title)

    var requiredParent = createCoursesPoolParent(track.required, REQUIRED_STYLE)
    var electiveParent = createCoursesPoolParent(track.elective, ELECTIVE_STYLE)

    track.required.options.forEach((courseOption)=>createCoursesPool(courseOption, requiredParent))
    track.elective.options.forEach((courseOption)=>createCoursesPool(courseOption, electiveParent))

    column.append(requiredParent)
    column.append(electiveParent)
    tracksDiv.appendChild(column)

})

function createCoursesPool(courseOption, pool) {
    var parent;
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
        var courseButton = createToggleButton(course.id)
        parent.appendChild(courseButton)
    })
}

function createCoursesPoolParent(trackPool, style) {
    var pool = document.createElement("div")
    pool.className = "course-type-div"
    pool.classList.add(style.poolClass)
    var poolTitle = document.createTextNode(style.title)
    var poolCourseReq = document.createTextNode(trackPool.num)
    pool.appendChild(poolTitle)
    pool.appendChild(poolCourseReq)

    return pool
}

function createToggleButton(text) {
    var button = document.createElement("button")
    button.innerHTML = text
    button.className = "toggle"

    //TODO 90% of the work is in the callback for mouse events



    return button
}