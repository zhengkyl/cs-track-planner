# Input/Output
CSV_FILE = "data.csv"
JSON_FILE = "data.json"

# Keywords used in the csv file and json
REQUIRED = "required"
ELECTIVE = "elective"
CHOOSE = "choose"
OVERFLOW = "overflow"

# JSON property names
TRACK_ID = "id"

COURSES_NEEDED = "num"
COURSE_OPTIONS_LIST = "options"

COURSE_OPTION_TYPE = "type"
COURSE_OPTION_COURSES = "courses"
ONE_COURSE = "none"

COURSE_ID = "id"
COURSE_TITLE = "title"

def format_courseOption(type):
    return '\t\t\t\t{\n\t\t\t\t\t"' + COURSE_OPTION_TYPE + '": "' + type + '",\n\t\t\t\t\t"'+COURSE_OPTION_COURSES+'": [\n'


def format_course(id, title):
    return '\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"'+COURSE_ID+'": "' + id + '",\n\t\t\t\t\t\t\t"'+COURSE_TITLE+'": "' + title + '"\n\t\t\t\t\t\t}'


def format_coursePool(type, row, rows):
    result = ''
    result += ",\n\t\t"
    result += '"' + type + '": '

    result += '{\n'
    result += '\t\t\t"'+COURSES_NEEDED+'": ' + rows[row][i+1] + ',\n'
    result += '\t\t\t"'+COURSE_OPTIONS_LIST+'": [\n'

    group = False
    while True:
        row += 1
        option = rows[row][i]
        if(option == ""):
            if group:
                result += '\t\t\t\t\t]\n\t\t\t\t}\n'
            break

        if option == CHOOSE or option == OVERFLOW:
            if group:
                result += '\t\t\t\t\t]\n\t\t\t\t},\n'

            result += format_courseOption(option)
            group = True
        else:
            if group:
                result += format_course(rows[row][i], rows[row][i+1])
                if rows[row+1][i] != "" and rows[row+1][i] != OVERFLOW and rows[row+1][i] != CHOOSE:
                    result += ',\n'
                else:
                    result += '\n'
            else:
                result += format_courseOption(ONE_COURSE)
                result += format_course(rows[row][i], rows[row][i+1])
                result += "\n"
                result += '\t\t\t\t\t]\n\t\t\t\t}'
                if rows[row+1][i] != "":
                    result += ',\n'
                else:
                    result += "\n"

    result += '\t\t\t]'
    result += '\n\t\t}'
    return result


with open(CSV_FILE, "r") as file:
    rows = [line.rstrip().split(",") for line in file]
    rows.append([""]*len(rows[0]))

with open(JSON_FILE, "w+") as json:

    json.write("[")

    for i in range(0, len(rows[0]), 3):
        if i:
            json.write(",")
        json.write('\n\t{\n\t\t"id": "' + rows[0][i] + '"')

        row = 0
        while row < len(rows)-1:
            row += 1
            cell = rows[row][i]
            if cell == "":
                continue
            if cell == REQUIRED:
                json.write(format_coursePool(REQUIRED, row, rows))

            elif cell == ELECTIVE:
                json.write(format_coursePool(ELECTIVE, row, rows))

        json.write('\n\t}')

    json.write("\n]")
