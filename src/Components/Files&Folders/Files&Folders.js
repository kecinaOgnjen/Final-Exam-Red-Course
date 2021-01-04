import React from 'react';


export default class FilesFolders extends React.Component{
    constructor(props) {
        super(props);
    }


    generateFilesAndFolders(){
        let { items } = this.props;
        if(!items) return;

        let folders = items.filter((item) => {return item.type === 'folder'}).sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        let files = items.filter((item) => {return item.type === 'file'}).sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        return [...folders, ...files].map((file) => (
            <div className="pointer item" onClick={() => this.changeDirectory(file)} style={{ flexDirection: 'row', height: 35, borderBottom: '1px solid #eeeeee', alignItems: 'center', display: 'flex', paddingLeft: 10}}>
                <div style={{flex: 0.65}}>
                    <i id="file-upload" className={file.type == 'folder' ? "fas fa-folder" : "fas fa-file "}></i>&nbsp;
                    <span style={{paddingLeft: 10}}>
                        {file.name}
                    </span>
                </div>
                <div style={{flex: 0.1, textAlign: 'center'}}>
                    -
                </div>
                <div style={{flex: 0.1, textAlign: 'center'}}>
                    {file.type}
                </div>
                <div style={{flex: 0.15, textAlign: 'center'}}>
                    {file.date}
                </div>
            </div>
        ))
    }

    changeDirectory = (file) => {
        if(file.type === 'file') 
            return;
            
        this.props.changeDirectory(file.name);
    }

    render() {
        
        return(
            <div className="files-and-folders">
                <div className="border-bottom-2px-grey margin-top-25px d-flex ">
                    <span className="d-flex grow-7">Ime</span>
                    <span className="d-flex grow-0-5 padding-right-50px">Velicina</span>
                    <span className="d-flex grow-0-5 padding-right-50px">Tip</span>
                    <span className="padding-right-50px" >Datum kreiranja</span>
                </div>
                <div>
                    {this.generateFilesAndFolders()}
                </div>
            </div>
        );
    }
}