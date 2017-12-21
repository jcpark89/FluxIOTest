import React, { Component } from 'react';
import {Helmet} from "react-helmet";
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
            });
        });
    }
   /* initViewPort() {
        // Tried everything under the sun to get this section working but no dice¯\_(ツ)_/¯
                // attach the viewport to the #div view
                this.viewport = new FluxViewport(document.querySelector("#view"));
                // set up default lighting for the viewport
                this.viewport.setupDefaultLighting();
                // set the viewport background to white
                this.viewport.setClearColor(0xffffff);
    }*/
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
                <Helmet>
                    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"></meta>
                    <script src="https://npmcdn.com/flux-viewport@0.35.4/dist/flux-viewport-bundle.global.js"></script>
                </Helmet>
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