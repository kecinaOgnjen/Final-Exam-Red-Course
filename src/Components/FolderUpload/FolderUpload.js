import React from 'react';

export default class FolderUpload extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="folder-upload d-flex margin-top-15px">
                <span className="pointer" >
                   <i id="folder-upload" className="fas fa-upload"></i>&nbsp;
                    Folder upload
                </span>
            </div>
        )
    }

}