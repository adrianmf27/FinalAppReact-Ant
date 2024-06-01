export let timestampToDate = (timestamp) => {
    let date = new Date(timestamp)

    let outputDate = date.getHours() + ":" + date.getMinutes() + "," + date.getDate() 
        + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    
    return outputDate
}


export let timestampToString = (timestamp) => {
    let date = new Date(timestamp)

    // If year || month || day has not 4 digits, it ads 0s in the right
    let year = date.getFullYear().toString().padStart(4, "0")
    let month = (date.getMonth() + 1).toString().padStart(2, "0")
    let day = date.getDate().toString().padStart(2, "0")
    let hours = date.getHours().toString().padStart(2, "0")
    let minutes = date.getMinutes().toString().padStart(2, "0")
    let seconds = date.getSeconds().toString().padStart(2, "0")
    let milliseconds = date.getMilliseconds().toString().padStart(3, "0")

    let result = year + "-" + month + "-" + day + "T" + hours + ":" 
        + minutes + ":" + seconds + "." + milliseconds
    return result
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const _ = require('lodash');