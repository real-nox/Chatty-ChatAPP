export const SanitizeInput = (input) => {
    const div = document.createElement("div")
    div.appendChild(document.createTextNode(input))
    return div.innerHTML
}