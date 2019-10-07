# Keywords used in the csv file
REQUIRED = "Required"
ELECTIVE = "Elective"
CHOOSE = "Choose"
OVERFLOW = "Overflow"



def format_courseOption(type):
    return '\t\t\t\t{\n\t\t\t\t\t"type": "' + type + '",\n\t\t\t\t\t"courses": [\n'

def format_course(id, title):
    return '\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"id": "' + id + '",\n\t\t\t\t\t\t\t"title": "' + title + '"\n\t\t\t\t\t\t}'

def format_coursePool(type, row, rows):
    result = ''
    result+= ",\n\t\t"
    result+= '"' + type + '": '

    result+='{\n'
    result+='\t\t\t"num": ' + rows[row][i+1] +',\n'
    result+='\t\t\t"options": [\n'

    row=1
    group = False
    while True:
        row+=1
        option = rows[row][i]
        if(option == ""):
            if group : result+='\t\t\t\t\t]\n\t\t\t\t}\n'
            break
        
        if option == CHOOSE or option == OVERFLOW:
            if group:
                result+='\t\t\t\t\t]\n\t\t\t\t},\n'
            
            result+=format_courseOption(option)
            group = True
        else:
            if group:
                result+=format_course(rows[row][i], rows[row][i+1])
                if rows[row+1][i] != "" and rows[row+1][i] != OVERFLOW and rows[row+1][i] != CHOOSE:
                    result+=',\n'
                else:
                    result+='\n'
            else:
                result+=format_courseOption("None")
                result+=format_course(rows[row][i], rows[row][i+1])
                result+="\n"
                result+='\t\t\t\t\t]\n\t\t\t\t}'
                if rows[row+1][i] != "":
                    result+=',\n'
                else:
                    result+="\n"

    result+='\t\t\t]'
    result+='\n\t\t}'
    return result

with open("data.csv", "r") as file:
    rows = [line.rstrip().split(",") for line in file]

with open("data.json", "w+") as json:

    json.write("[")

    for i in range(0, len(rows[0]), 3):
        if i: json.write(",")
        json.write('\n\t{\n\t\t"id": "' + rows[0][i] + '"')

        row=0
        while row < len(rows)-1:
            row+=1
            cell = rows[row][i]
            if cell == "":
                continue
            if cell == REQUIRED:
                json.write(format_coursePool(REQUIRED, row, rows))

            elif cell == ELECTIVE:
                json.write(format_coursePool(ELECTIVE, row, rows))
            

        json.write('\n\t}')

    json.write("\n]")

