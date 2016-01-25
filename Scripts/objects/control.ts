/// <reference path="../../typings/tsd.d.ts"/>

module objects {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    export class Control { 
        //PUBLIC INSTANCE VARIABLES +++++++++++++++++++++++++++
        public points: objects.Point[];
        public mesh: Object3D;
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        constructor(mesh: Object3D) {
        }
       //PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++
    }
}
