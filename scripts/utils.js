function getElementChildren(element) {
    let children = [];
    children[0] = element.firstElementChild;
    let childIndex = 0;

    while(children[childIndex].nextElementSibling) {
        let nextChild = children[childIndex].nextElementSibling;
        childIndex++;
        children[childIndex] = nextChild;
    }

    return children;
}// getElementChildren(element)