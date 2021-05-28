
import { Card, CardContent, FormControl, MenuItem, Select} from '@material-ui/core';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import './App.css';
import Infobox from './Infobox';
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table'
import { prettyPrintStat, sortdata } from './util';
import "leaflet/dist/leaflet.css"
function App() {
const [countries,setcountries]=useState([]);
const [country,setcountry]=useState("worldwide");
const [countryInfo,setcountryInfo]=useState({});
const [tabledata,settabledata]=useState([]);
const [casesType, setCasesType] = useState("cases");
const [mapCenter,setmapCenter]=useState({lat:34.80746,lng:-40.4796})
const [mapZoom,setmapZoom]=useState(3)
const [mapCountries,setmapCountries]=useState([])
useEffect(()=>{
  fetch("https://disease.sh/v3/covid-19/all").then((response)=>response.json()).then(data=>{

setcountryInfo(data)
  })
},[])
useEffect(()=>{
const getcountrydata=async()=>{
  await fetch("https://disease.sh/v3/covid-19/countries").then((response)=>response.json()).then((data)=>{
   
  const countries=data.map((country)=>(
      {
        name:country.country,
        value:country.countryInfo.iso2
      }
    ))
  let sorteddata=sortdata(data)
  setcountries(countries)
  setmapCountries(data)
  settabledata(sorteddata)
  
  
 
  

  })
}
getcountrydata();
},[])

const oncountrychange=async (event)=>{
const countrycode=event.target.value;
  

const url=countrycode==="worldwide"?"https://disease.sh/v3/covid-19/all":
`https://disease.sh/v3/covid-19/countries/${countrycode}`
await fetch(url)
.then((response)=>response.json())
.then((data)=>
{
setcountry(countrycode)
setcountryInfo(data)
setmapCenter([data.countryInfo.lat,data.countryInfo.long])
setmapZoom(4);
})
}


  return (

    <div className="app">
      <div className="app__left">
      <div className="app__header">
    <h1>COVID 19 Tracker</h1>
      <FormControl className="app__dropdown">
      
      <Select 
      variant="outlined"
      onChange={oncountrychange}
      value={country}
      
      
      >
    <MenuItem value="worldwide">Worldwide</MenuItem>
     {
       
       countries.map((country)=>(
         <MenuItem value={country.value}>{country.name}</MenuItem>
       ))
     }
      </Select>



      </FormControl>
    </div>
    <div className="app__stats">
    <Infobox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <Infobox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <Infobox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />


    </div>
    <Map center={mapCenter}
    zoom={mapZoom}
    countries={mapCountries}
    casesType={casesType}
    ></Map>

      </div>
    
     <Card className="app__right">
<CardContent>
  <h3>Live Cases By Countries</h3>
  <Table countries={tabledata}></Table>
  <h3 className="app__text">Worldwide New  {casesType}</h3>
  <LineGraph className="app__graph" casesType={casesType}>

  </LineGraph>s

</CardContent>


     </Card>
    </div>
  );
}

export default App;
