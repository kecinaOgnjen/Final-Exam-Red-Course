import React from 'react';
import Modal from 'react-modal';
import '../Style/Style.css';
import NewFolder from "../Components/NewFolder/NewFolder";
import FileUpload from "../Components/FileUpload/FileUpload";
import FolderUpload from "../Components/FolderUpload/FolderUpload";
import FilesFolders from "../Components/Files&Folders/Files&Folders";
import history from '../history';
import { editTree,insertTree, deleteTree, findRec} from '../Tree'

Modal.setAppElement = function (s) {
    Modal.setAppElement('#root');
}

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen:false,
            modalEditIsOpen:false,
            folderName: '',
            parentFolder: '',
            selectedFileFolder: null,
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
        let data = await this.findInTree();
        await this.setState({  parentFolder: window.location.pathname});

        if(!data) {
            await this.setState({ items : [], parentFolder: window.location.pathname});
            return;
        }

        if(data.type === 'file'){
            await this.setState({ items : [ data]});
        }
        else {
            if(data.children)
                await this.setState({ items : data.children});
            else 
                await this.setState({ items : []});
        }

    }

    insertNewFile = async (data) => {
        let { items } = this.state;

        let tree = JSON.parse(localStorage.getItem('repos'));
        let currentPath = window.location.pathname.split('/');
        currentPath.shift();

        let newNode = {...data, type: 'file'  };
        let newTree = insertTree(currentPath, newNode, tree);

        items.push(newNode);
        this.setState({ items : items})


        await localStorage.setItem('repos', JSON.stringify(newTree));
    }

    insertNewFolder = async () => {
        let { items } = this.state;

        let tree = JSON.parse(localStorage.getItem('repos'));
        let newNode = {name : this.state.folderName, type: 'folder', date: new Date, children: [] };

        if(!tree){
            let newNode2 = {name : '', type: 'folder', date: new Date, children: [newNode] };
            await localStorage.setItem('repos', JSON.stringify(newNode2));
            await this.setState({ items: [newNode]});
        }else {
            let currentPath = window.location.pathname.split('/');
            currentPath.shift();

            let newTree = insertTree(currentPath, newNode, tree);
            await localStorage.setItem('repos', JSON.stringify(newTree));

            items.push(newNode);
            this.setState({ items : items})
        }
        await this.setState({modalIsOpen: false});
    }

    async findInTree(){
        let tree = JSON.parse(localStorage.getItem('repos'));
        if(!tree) return null;

        let currentPath = window.location.pathname.split('/');
        let nodeName = currentPath[currentPath.length - 1];
        currentPath.shift();
        
        if(nodeName === "") 
            return tree;

        return findRec(currentPath, tree);
    }

    changeDirectory = (name) => {
        let {pathname} = window.location;

        if(pathname === '/')
            history.push('/' + name);
        else
            history.push(window.location.pathname + '/' + name);

        this.getFoldersAndFiles();
    }

    backDirectory = () => {
        history.goBack();
    }

    handleDeleteFileFolder = async (e) => {
        let { selectedFileFolder } = this.state;

        let tree = JSON.parse(localStorage.getItem('repos'));
        if(!tree) return;

        let currentPath = window.location.pathname.split('/');
        if(window.location.pathname === '/') currentPath = [''];

        let newTree = deleteTree(currentPath, this.state.selectedFileFolder, tree);
        await localStorage.setItem('repos', JSON.stringify(newTree));
        await this.getFoldersAndFiles();

        this.setState({ modalEditIsOpen : false});
    }

    onEditFileFolder = async (item) => {
        await this.setState({ selectedFileFolder: item, modalEditIsOpen: true, folderName: item.name});
    }

    handleChangeFolderFileName = async (e) => {
        e.preventDefault();
        let { selectedFileFolder } = this.state;
        let tree = JSON.parse(localStorage.getItem('repos'));
        if(!tree) return;

        let currentPath = window.location.pathname.split('/');
        if(window.location.pathname === '/') currentPath = [''];

        let newName = this.state.folderName;
        let newTree = editTree(currentPath, selectedFileFolder, tree, newName);

        await localStorage.setItem('repos', JSON.stringify(newTree));
        await this.getFoldersAndFiles();
        this.setState({ modalEditIsOpen : false});
    }

    onChangeInputFile = (event) => {
        let her = this;
        if (event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            this.setState({ folderName: file.name});
        }
    }

    triggerInputFile = () => this.fileInput.click()

    render() {
        let { parentFolder } =this.state;

        return(
          <div className="home-screen">
              <div className="border-top-2px-grey" style={{display: 'flex', marginLeft: 20}}>
                <div style={{flex: 0.5, display:'flex', alignItems: 'center'}}>
                    <span className="pointer" onClick={this.backDirectory}>
                        {parentFolder != '' && parentFolder != '/' && <i style={{color: 'gray'}} className="fas fa-arrow-left"></i>}&nbsp;
                    </span>
                    <span style={{color: 'gray', paddingLeft: 20 }}>
                        {parentFolder != '' && parentFolder != '/' && parentFolder}
                    </span>
                </div>
                <div style={{flex: 0.5}} className="d-flex  justify-content-end padding-right-20px">
                    <NewFolder onClick={this.showModal} />
                    <FileUpload addNewFile={this.insertNewFile}/>
                    <FolderUpload />
                </div>
              </div>
              
              <div className=" padding-left-20px padding-right-20px">
                  <FilesFolders items={this.state.items} changeDirectory={this.changeDirectory} onEditFileFolder={this.onEditFileFolder}/>
                  <Modal
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.hideModal}
                      style={{
                          overlay:{
                              backgroundColor: 'rgba(115, 119, 119, 0.75)'
                          },
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

                  <Modal
                      isOpen={this.state.modalEditIsOpen}
                      onRequestClose={() => { this.setState({ modalEditIsOpen: false,})}}
                      style={{
                          overlay:{
                              backgroundColor: 'rgba(115, 119, 119, 0.75)'
                          },
                          content: {
                              width:'500px',
                              height: '300px',
                              inset:'100px',
                              marginLeft:'25%'
                          }
                      }}
                  >
                    <h2>Izmeni </h2>
                    <input 
                        className="hide_file"
                        style={{cursor: 'pointer', width: 40, height: 30}}
                        type="file"
                        name="user[image]"
                        ref={fileInput => this.fileInput = fileInput}   
                        multiple={true}
                        onChange={(e) => this.onChangeInputFile(e)}/>
                    
                    <div style={{display: 'flex', flexDirection: 'column',}}>
                    <div style={{ height: 150, justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                        {this.state.selectedFileFolder && this.state.selectedFileFolder.type === 'file' ?
                        <span className="pointer" onClick={this.triggerInputFile}>
                            <i id="file-upload" className="fas fa-file-upload"></i>&nbsp;
                            File upload
                        </span>
                        :  <input style={{height: 40, borderRadius: 5, borderColor: 'gray'}} name="folderName" placeholder="Naziv" value={this.state.folderName} onChange={(e) => { this.setState({ folderName: e.currentTarget.value})}}  /> 
                        }
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button onClick={this.handleChangeFolderFileName} style={{padding: 9, width: 90, margin: 10}}>Sacuvaj</button>
                        <button style={{padding: 9, width: 90, margin: 10}}  
                            onClick={() => {
                                
                            }}>
                            Odustani
                        </button>
                        <button style={{padding: 9, width: 90, margin: 10}} 
                            onClick={this.handleDeleteFileFolder}>
                            Obrisi
                        </button>
                    </div>
                    </div>
                  </Modal>
              </div>
          </div>
        );
    }
}