export function insertTree(parentNames, newNode, tree){
    return insertRec(parentNames, newNode, tree);
}

function insertRec(parentNames, newNode, node){
    //insert here
    if(node.name === parentNames[0]){

        if(parentNames.length > 1){
            parentNames.shift();
        }else {
            if(!node.children)
                node.children = [];
            
            node.children.push(newNode);

            return node
        }
    }

    if(!node.children) return node;
    
    let nextName = parentNames[0];
    for (let i = 0; i < node.children.length; i++){
        if(node.children[i].name == nextName)
            node.children[i] = insertRec(parentNames,newNode, node.children[i]);
    }
    
    return node
}

export function findRec(parenthNames, node){
    let result = null;
    if(node.name === parenthNames[0] && parenthNames.length == 1) return node;

    for (let i = 0; i < node.children.length; i++) {
        if(node.children[i].name == parenthNames[0]){
            if(parenthNames.length == 1)
                return node.children[i];

            parenthNames.shift();
            result = findRec(parenthNames, node.children[i]);
        }        
    }
    
    return result;
}

export function editTree(parentNames, editNode, tree, newName){
    return editRec(parentNames, editNode, tree, newName);
}


function editRec(parentNames, editNode, node, newName){
    if(node.name === parentNames[0] ){
        if( parentNames.length > 1)
            parentNames.shift();
        else {
            if(node.children){
                let childs = node.children;
                let index = childs.findIndex((obj => obj.name == editNode.name));
    
                node.children[index].name = newName;
            }
            return node
        }
    }

    if(!node.children){
        return node;
    }
    
    let nextName = parentNames[0];
    for (let i = 0; i < node.children.length; i++){
        if(node.children[i].name === nextName)
            node.children[i] = editRec(parentNames,editNode, node.children[i],newName);
    }
    
    return node
}

export function deleteTree(parentNames, deleteNode, tree){
    return deleteRec(parentNames, deleteNode, tree);
}

function deleteRec(parentNames, deleteNode, node){

    if(node.name === parentNames[0]){
        if( parentNames.length > 1)
            parentNames.shift();
        else {
            if(node.children){
                let childs = node.children;
                node.children = childs.filter((item) => item.name != deleteNode.name);
            }
            return node
        }
    }

    if(!node.children){
        return node
    }
    
    let nextName = parentNames[0]
    for (let i = 0; i < node.children.length; i++){
        if(node.children[i].name === nextName)
            node.children[i] = deleteRec(parentNames,deleteNode, node.children[i]);
    }
    
    return node
}
