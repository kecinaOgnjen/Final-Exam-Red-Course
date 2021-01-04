import React from 'react';

export default class NewFolder extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="add-folder d-flex margin-top-15px padding-right-20px">
                <span
                    className="pointer"
                    onClick={this.props.onClick}
                >
                     <i id="add-folder" className="fas fa-folder-plus"></i>&nbsp;
                    Novi folder
                </span>
            </div>
        );
    }

}