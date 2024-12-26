export function createElement(vNode) {
    if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
        return document.createTextNode(""); 
    }
    
    if (typeof vNode === "string" || typeof vNode === "number") {
        return document.createTextNode(vNode);
    }

    if(Array.isArray(vNode)){
        const fragment = document.createDocumentFragment();
        vNode.forEach((node) =>{
            const doms = createNodeWithChildren(node);
            fragment.appendChild(doms);
        })
        return fragment;
    }else{ // typeof "Object"
        return createNodeWithChildren(vNode);
    }
}

function updateAttributes($el, props) {

}

function createNodeWithChildren(node){
    const domX = document.createElement(node.type);
    //props 삽입
    for(let propK in node.props){
        if (propK === 'className') {
            domX.setAttribute('class', node.props[propK]);
        } else {
            domX.setAttribute(propK, node.props[propK]);
        }
    }
    //child 삽입
    node.children.forEach((child) =>{
        domX.appendChild(createElement(child));
    })
    return domX;
}
