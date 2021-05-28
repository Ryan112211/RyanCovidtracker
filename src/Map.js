import React from 'react'
import "./Map.css"
import { Map as LeafletMap, TileLayer } from "react-leaflet";

import { showDataonMap } from './util';

function Map({countries,casesType,center,zoom}) {
    console.log("checking",countries)
   
    return (
     <div className="map">
    <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

{showDataonMap(countries,casesType)}
      </LeafletMap>   
        </div>
    )
}

export default Map
