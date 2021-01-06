import React, { Component } from 'react'

export default class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.file,
            expand: false
        }
    }

    expandFolder = () => {
        let { expand } = this.state;
        this.setState({
            expand: !expand
        })
    }

    generateExpandElements(){
        let { file } = this.props;
        
        if(this.state.expand && file && file.children && file.children.length > 0){
            console.log('opa');
            let folders = file.children.filter((item) => {return item.type === 'folder'}).sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            let files = file.children.filter((item) => {return item.type === 'file'}).sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

            return [...folders, ...files].map((file) => (
                <div className="pointer item" style={{ flexDirection: 'row', height: 35, marginLeft: 30,borderBottom: '1px solid #eeeeee', alignItems: 'center', display: 'flex', paddingLeft: 10}}>
                    <div style={{flex: 0.65}}>
                        <i id="file-upload" className={file.type == 'folder' ? "fas fa-folder" : "fas fa-file "}></i>&nbsp;
                        <span style={{paddingLeft: 10}}>
                            {file.name}
                        </span>
                    </div>
                    <div style={{flex: 0.1, textAlign: 'center'}}>
                        {file.size}
                    </div>
                    <div style={{flex: 0.1, textAlign: 'center'}}>
                        {file.type === 'folder' ? file.type : file.name.split('.')[1]}
                    </div>
                    <div style={{flex: 0.15, textAlign: 'center'}}>
                        {file.date.toString()}
                    </div>
                </div>
            ))
        }else if(this.state.expand && file && file.type === 'folder') 
            return ( 
                <div style={{ flexDirection: 'row', height: 35, marginLeft: 30,borderBottom: '1px solid #eeeeee', alignItems: 'center', display: 'flex', paddingLeft: 10}}>
                    <span style={{  color: 'gray'}}>-</span>
                </div>
            )
    }

    render() {
        let { file } = this.props;

        return (
            <div style={{ borderBottom: '1px solid #eeeeee'}}>
                <div className="pointer item" onContextMenu={(e) => {e.preventDefault(); this.props.onEditFileFolder(file); return false; }} onClick={this.expandFolder} onDoubleClick={() => this.props.changeDirectory(file)} style={{ flexDirection: 'row', height: 35, alignItems: 'center', display: 'flex', paddingLeft: 10}}>
                    <div style={{flex: 0.65}}>
                        <i id="file-upload" className={file.type == 'folder' ? "fas fa-folder" : "fas fa-file "}></i>&nbsp;
                        <span style={{paddingLeft: 10}}>
                            {file.name}
                        </span>
                    </div>
                    <div style={{flex: 0.1, textAlign: 'center'}}>
                        {file.size}
                    </div>
                    <div style={{flex: 0.1, textAlign: 'center'}}>
                        {file.type === 'folder' ? file.type : file.name.split('.')[1]}
                    </div>
                    <div style={{flex: 0.15, textAlign: 'center'}}>
                        {file.date.toString()}
                    </div>
                </div>
                {this.generateExpandElements()}
            </div>
        )
    }
}
