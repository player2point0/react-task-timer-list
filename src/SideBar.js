import React from 'react';
import Pomodoro from './Pomodoro.js';

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSideBar: false
        };

        this.showSideBar = this.showSideBar.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
    }

    showSideBar(){
        this.setState(state => ({
            showSideBar: true
        }));
    }

    hideSideBar(){
        this.setState(state => ({
            showSideBar: false
        }));
    }

    render() {

        if(!this.state.showSideBar)
        {
            return(
                <h1 className="showSideBar" onClick={this.showSideBar}>sidebar</h1>
            );
        }
        
        return(
            <div className="sideBarContainer">
                <div className="sideBar">
                    <h1 onClick={this.hideSideBar}>sidebar</h1>
                    <h1>settings</h1>
                    <h1>stats</h1>
                    <h1>pomodoro</h1>
                    <Pomodoro
                        tasks={this.props.tasks}
                    />
                </div>
                <div className="closeSideBar" onClick={this.hideSideBar}>
                    <h1>close</h1>
                </div>
            </div>
        );
    }
}