import React from 'react';

export default class FileUpload extends React.Component{
    constructor(props) {
        super(props);
    }

    addNewFile = () => {
        //this.props.addNewFile();
        this.triggerInputFile();
    }

    onChangeInputFile = (event) => {
        let her = this;
        if (event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            this.props.addNewFile({name : file.name, size: file.size, date: new Date});
        }
    }

    triggerInputFile = () => this.fileInput.click()


    render() {
        return(
            <div className="file-upload d-flex margin-top-15px padding-right-20px">
                <input 
                    className="hide_file"
                    style={{cursor: 'pointer', width: 40, height: 30}}
                    type="file"
                    name="user[image]"
                    ref={fileInput => this.fileInput = fileInput}   
                    multiple={true}
                    onChange={(e) => this.onChangeInputFile(e)}/>
                
                <span className="pointer" onClick={this.addNewFile}>
                    <i id="file-upload" className="fas fa-file-upload"></i>&nbsp;
                    File upload
                </span>
            </div>
        )
    }

}