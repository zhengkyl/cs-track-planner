class Track{
    //these are  lists of CourseOption
    //except for equired - its a list of lists of CourseOption
    constructor(required, elective){
        this.required = required
        this.elective = elective
    }
}
class CourseOption{
    //contains 1 or more Courses
    constructor(courses, type){
        this.courses = courses
        this.type = type
    }
}
class Course{
    constructor(id, name){
        this.id = id
        this.name = name
    }
}

var tracks;

fetch("data/data.json")
    .then(response => response.json())
    .then(json => console.log(json))
