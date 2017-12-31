import React, { Component } from 'react';
import './App.css';
import {helpers,getProjects, getCells} from "./flux/helper";
//This did not work
//import FluxViewport from 'flux-viewport';

class ViewPort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true,
            projects: [],
            project: '',
            cells: [],
            cell: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        var self = this;
        this.initViewPort();

        getProjects().then(function(data) {
            var firstProject = data.entities[0];
            self.setState({
                projects: data.entities,
                project: firstProject
            });

            getCells(firstProject).then(function (data) {
                var firstCell = data.entities[0];
                self.setState({
                    cells:data.entities,
                    cell: firstCell
                });
                self.renderViewport(null);
            });
        });


    }
    initViewPort() {
        // Tried everything under the sun to get this section working but no dice¯\_(ツ)_/¯
                // attach the viewport to the #div view
                this.viewport = new window.FluxViewport(document.querySelector("#view"));
                // set up default lighting for the viewport
                this.viewport.setupDefaultLighting();
                // set the viewport background to white
                this.viewport.setClearColor(0xffffff);
    }

    renderViewport(data) {
        if(!data){
            this.viewport.setGeometryEntity(null)
        }
        else if (window.FluxViewport.isKnownGeom(data.value)) {
            //add it to the viewport
            this.viewport.setGeometryEntity(data.value)
        }
    }

    handleChange (event) {
        this.setState({project: event.target.value});
        console.log(this.state.project);
    }
    handleClick (){
        //handle logout
        helpers.logout();
        //not the most elegant solution but just wanna make sure it works
        window.location.reload();
    }
    render() {
        return (
            <div className='FluxViewPort'>
                <header className='App-header'>
                    <h1 className='App-title'>Flux Seed Project</h1>
                    <div id='actions'>
                        <div className='select'><select className='project' onChange={this.handleChange.bind(this)}>{
                            this.state.projects.length ? this.state.projects.map(function(project, i){
                               return <option value={project.id} key={i}> {project.name}</option>
                            }) : <option>No Data</option>
                        }
                        </select></div>
                        <div id='logout' onClick={this.handleClick}>logout</div>
                    </div>
                </header>
                <div className='output'>
                     <div id='geometry'>
                        <div id='view'></div>
                    </div>
                    <div className='select' id="cellSelect"><select className='cell'>
                        {
                            this.state.cells.length ? this.state.cells.map(function(cell, i) {
                                return <option value={cell.id} key={i}>cell.label</option>
                            }) : <option>No Data</option>
                        }
                    </select></div>
                </div>
            </div>
        );
    }
}
export default ViewPort;