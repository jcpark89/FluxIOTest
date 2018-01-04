import React, { Component } from 'react';
import './App.css';
import {helpers,getProjects, getCells, getValue} from "./flux/helper";
var _ = require('lodash');
var THREE = require('three');

class ViewPort extends Component {
    constructor(props) {
        super(props);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.INTERSECTED =null;
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
                getValue(firstProject, firstCell).then(function(data) {
                    self.renderViewport(data);
                });

            });
        });


    }
    initViewPort() {
                // attach the viewport to the #div view thanks George
                this.viewport = new window.FluxViewport(document.querySelector("#view"));
                // set up default lighting for the viewport
                this.viewport.setupDefaultLighting();
                // set the viewport background to white
                this.viewport.setClearColor(0xffffff);

    }
    update() {
        this.raycaster.setFromCamera( this.mouse, this.viewport._renderer._cameras.getCamera());
        //raycaster isn't showing up the items
        var intersects = this.raycaster.intersectObjects( this.viewport._renderer._scene.children );
        if ( intersects.length > 0 ) {
            console.log("Intersected");

            if ( this.INTERSECTED !== intersects[ 0 ].object ) {
                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                this.INTERSECTED = intersects[ 0 ].object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
        } else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = null;
        }
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
    _onMouseMove(event) {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        //console.log("X: " + this.mouse.x  + ", Y:" + this.mouse.y);
        this.update()
    }

    handleChange (event) {
        var self = this;

        switch(event.target.name) {
            case 'projectSelect':
                var changedProj = _.find(self.state.projects, {id: event.target.value});
                this.setState({project: changedProj});
                getCells(changedProj).then(function (data) {

                    var firstCell = data.entities[0];
                    self.setState({
                        cells:data.entities,
                        cell: firstCell
                    });
                    getValue(changedProj, firstCell).then(function(data) {
                        self.renderViewport(data);
                    });

                });
                break;
            case 'cellSelect':
                var changedCell = _.find(self.state.cells, {id: event.target.value});
                self.setState({cell: changedCell});
                getValue(self.state.project, changedCell).then(function(data) {
                    self.renderViewport(data);
                });
                break;
            default:
                getValue(self.state.project, self.state.cell).then(function(data) {
                    self.renderViewport(data);
                });
                break;
        }

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
                        <div id='logout' onClick={this.handleClick}>logout</div>
                    </div>
                </header>
                <div className='output'>
                     <div id='geometry'>
                        <div id='view' onMouseMove={this._onMouseMove.bind(this)}></div>
                    </div>
                    <div className='select' id="projectSelect"><select className='project' name='projectSelect' onChange={this.handleChange.bind(this)}>{
                        this.state.projects.length ? this.state.projects.map(function(project, i){
                            return <option value={project.id} key={i}> {project.name}</option>
                        }) : <option>No Data</option>
                    }
                    </select></div>
                    <div className='select' id="cellSelect"><select className='cell' name='cellSelect' onChange={this.handleChange.bind(this)}>
                        {
                            this.state.cells.length ? this.state.cells.map(function(cell, i) {
                                return <option value={cell.id} key={i}>{cell.label}</option>
                            }) : <option>No Data</option>
                        }
                    </select></div>
                </div>
            </div>
        );
    }
}
export default ViewPort;