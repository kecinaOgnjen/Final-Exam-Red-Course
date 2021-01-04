import React from 'react';
import Modal from 'react-modal';
import '../Style/Style.css';
import NewFolder from "../Components/NewFolder/NewFolder";
import FileUpload from "../Components/FileUpload/FileUpload";
import FolderUpload from "../Components/FolderUpload/FolderUpload";
import FilesFolders from "../Components/Files&Folders/Files&Folders";
import history from '../history';

Modal.setAppElement = function (s) {
    Modal.setAppElement('#root');
}

export default class HomeScreen extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen:false,
            folderName: '',
            items: []
        }
    }

    showModal = () => {
        this.setState({
            modalIsOpen: true,
        })
    }

    hideModal =() => {
        this.setState({
            modalIsOpen: false,
            folderName: ''
        })
    }

    async componentDidMount(){
        await this.getFoldersAndFiles();

        this.backListener = history.listen(async location => {
            await this.getFoldersAndFiles();
        });
    }

    async getFoldersAndFiles(){
        let data = this.findInTree();
        //
        console.log('dataaa', data);
        if(!data) {
            await this.setState({ items : []});
            return;
        }

        if(data.type === 'file'){
            await this.setState({ items : [ data]});
        }
        else {
            console.log('ok folder');
            if(data.children)
                await this.setState({ items : data.children});
            else 
                await this.setState({ items : []});
        }
    }

    insertNewItem = async (data) => {
        let tree = JSON.parse(localStorage.getItem('repos'));
        let currentPath = window.location.pathname.split('/');
        currentPath.shift();

        let newNode = {...data, type: 'file'  };
        let newTree = this.insertTree(currentPath, newNode, tree);

        await localStorage.setItem('repos', JSON.stringify(newTree));
    }

    insertNewFolder = async () => {
        let tree = JSON.parse(localStorage.getItem('repos'));
        let newNode = {name : this.state.folderName, type: 'folder', date: new Date, children: [] };

        if(!tree){
            let newNode2 = {name : '', type: 'folder', date: new Date, children: [newNode] };
            await localStorage.setItem('repos', JSON.stringify(newNode2));
            await this.setState({ items: [newNode]});
        }else {
            let currentPath = window.location.pathname.split('/');
            currentPath.shift();

            let newTree = this.insertTree(currentPath, newNode, tree);
            await localStorage.setItem('repos', JSON.stringify(newTree));
        }
        
        await this.setState({modalIsOpen: false});
    }

    insertTree(parentName, newNode, tree){
        let newTree = this.insertRec(parentName, newNode, tree);
        console.log(newTree);
        return newTree;
    }

    insertRec(parentName, newNode, node){
        //insert here
        if(node.name === parentName[0] && parentName.length > 1){
            if(parentName[0]=== '') {
                console.log(parentName, '++++++++++++++++++++++++++++');
                if(!node.children){
                    node.children = [];
                }
                node.children.push(newNode);
    
                //update state
                let { items } = this.state;
                this.setState({ items :  [...items, newNode]})
    
                return node
            }

            parentName.shift();
        }
        else if(node.name === parentName[0]){
            if(!node.children){
                node.children = [];
            }
            node.children.push(newNode);

            //update state
            let { items } = this.state;
            this.setState({ items :  [...items, newNode]})

            return node
        }

        if(!node.children){
            return node;
        }
        
        for (let i = 0; i < node.children.length; i++){
                node.children[i] = this.insertRec(parentName,newNode, node.children[i]);
        }
        
        return node;
    }

    findRec(label, node){
        let result = null;
        console.log(node);
        if(node.name === label) return node;
        
        for (let i = 0; i < node.children.length; i++){

            if(node.children[i].name == label){
                return node.children[i];
                //node.children[i].name = 'changed';
            }

            if(node.children[i].children)
                result = this.findRec(label, node.children[i]);
        }
        
        return result;
    }

    findInTree(){
        let tree = JSON.parse(localStorage.getItem('repos'));
        if(!tree) return null;

        let currentPath = window.location.pathname.split('/');
        let nodeName = currentPath[currentPath.length - 1];
        currentPath.shift();
        console.log('tree',tree);
        if(nodeName === "") return tree;

        let node = this.findRec(nodeName, tree);
        console.log(node, tree);
        return node;
    }

    changeDirectory = (name) => {
        let {pathname} = window.location;

        if(pathname === '/')
            history.push('/' + name);
        else 
            history.push(window.location.pathname + '/' + name);

        this.getFoldersAndFiles();
    }

    render() {
        return(
          <div className="home-screen">
              <div className="d-flex border-top-2px-grey justify-content-end padding-right-20px">
                  <NewFolder
                      onClick={this.showModal}
                  />
                  <FileUpload addNewFile={this.insertNewItem}/>
                  <FolderUpload />
              </div>
              <div className=" padding-left-20px padding-right-20px">
                  <FilesFolders items={this.state.items} changeDirectory={this.changeDirectory}/>
                  <Modal
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.hideModal}
                      style={{
                          content: {
                              width:'500px',
                              height: '300px',
                              inset:'100px',
                              marginLeft:'25%'
                          }
                      }}
                  >
                      <h2>Dodaj novi Folder</h2>
                      <div style={{display: 'flex', flexDirection: 'column',}}>
                        <div style={{ height: 150, justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                            <input style={{height: 40, borderRadius: 5, borderColor: 'gray'}} name="folderName" placeholder="Naziv" value={this.state.folderName} onChange={(e) => { this.setState({ folderName: e.currentTarget.value})}}  /> 
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button onClick={this.insertNewFolder} style={{padding: 9, width: 90, margin: 10}}>Dodaj</button>
                            <button style={{padding: 9, width: 90, margin: 10}} 
                                onClick={() => {
                                    this.setState({ modalIsOpen: false, folderName: ''})
                                }}>
                                Odustani
                            </button>
                        </div>
                      </div>
                      
                  </Modal>
              </div>
          </div>
        );
    }
}