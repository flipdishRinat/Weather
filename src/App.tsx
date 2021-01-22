// import './App.css';
import axios from "axios";
import React, { useEffect, useState } from "react";
import NavigationIcon from "@material-ui/icons/Navigation";
import { fade, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import fetch from "cross-fetch";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function App() {
  const [daily, setDaily] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [temp, setTemp] = useState("");
  const [img, setImg] = useState("");
  const [alt, setAlt] = useState("");
  const [feel, setFeel] = useState("");
  const [dew, setDew] = useState("");
  const [rise, setRise] = useState("");
  const [set, setSet] = useState("");
  const [deg, setDeg] = useState("");
  const [speed, setSpeed] = useState("");
  const [clouds, setClouds] = useState("");

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  const classes = useStyles();

  var options1 = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos:any) {
    var crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    getWeather(crd.latitude, crd.longitude);

    // console.log();
  }

  // var responeOfWeather = "";
  // var r = "";

  const getWeather = async (lat:number, lon:number) => {
    try {
      const city = await axios.get(
        "https://us1.locationiq.com/v1/reverse.php?key=pk.0553826efdf551ac35bdf924d7996491&lat=" +
          lat +
          "&lon=" +
          lon +
          "&format=json"
      );
      setOptions([]);
      console.log(city.data.address.country);
      setCountry(city.data.address.country);

      console.log(city.data.address.locality || city.data.address.city);
      setCity((city.data.address.locality || city.data.address.city) + " | ");

      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=metric&appid=f0c85a8c7a8cf2de24a5653f555cd7e4"
      );

      const myDate = new Date(response.data.current.dt * 1000);
      setDate(myDate.toString().slice(0, 21));
      setRise(
        new Date(response.data.current.sunrise * 1000).toString().slice(15, 21)
      );
      setSet(
        new Date(response.data.current.sunset * 1000).toString().slice(15, 21)
      );
      setTemp(response.data.current.temp.toFixed(0));
      setFeel(response.data.current.feels_like.toFixed(0));
      setDew(response.data.current.dew_point.toFixed(0));

      setDeg(response.data.current.wind_deg);
      setClouds(response.data.current.clouds);
      setSpeed(((response.data.current.wind_speed / 1000) * 3600).toFixed(0));

      setImg(
        `http://openweathermap.org/img/wn/` +
          response.data.current.weather[0].icon +
          `.png`
      );
      setAlt(response.data.current.weather[0].description);

      setDaily(response.data.daily);
      setHourly(response.data.hourly);

      // console.log(response);

      // console.log(new Date(response.data.current.dt * 1000));
      // responeOfWeather = response;
      // r = responeOfWeather.data.current.dt;
    } catch (e) {
      console.log(e);
    }
  };
  function error(err:any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error, options1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFind(event.target.value);
  //   if (event.target.value.length > 3) {
  //     try {
  //       const city = await axios.get(
  //         `http://api.openweathermap.org/geo/1.0/direct?q=${event.target.value}&limit=7&appid=f0c85a8c7a8cf2de24a5653f555cd7e4`
  //       );
  //       console.log(city);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // };

  const selectedCity = (lat:number, lon:number) => {
    getWeather(lat, lon);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 3) {
      try {
        const city = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${event.target.value}&limit=7&appid=f0c85a8c7a8cf2de24a5653f555cd7e4`
        );
        const countries = await city.json();
        console.log(countries);
        // if (active) {
        // setOptions(Object.keys(countries).map((key) => countries[key].item[0]));
        setOptions(countries);
        // }
      } catch (e) {
        console.log(e);
      }
    }
  };

  // const handleChange = async (string, results) => {
  //   console.log(results);
  //   if (string.length > 3) {
  //     console.log(string);
  //     try {
  //       const city = await fetch(
  //         `http://api.openweathermap.org/geo/1.0/direct?q=${string}&limit=7&appid=f0c85a8c7a8cf2de24a5653f555cd7e4`
  //       );
  //       const countries = await city.json();
  //       // console.log(countries);
  //       // if (active) {
  //       // setOptions(Object.keys(countries).map((key) => countries[key].item[0]));
  //       setOptions(countries);
  //       // }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // };

  // const handleOnSearch = (string, results) => {
  //   // onSearch will have as the first callback parameter
  //   // the string searched and for the second the results.
  //   // If useCached is true and results are are cached it
  //   // returns cached results
  //   console.log(string, results);
  // };

  // const handleOnSelect = (item) => {
  //   // the item selected
  //   console.log(item);
  // };

  // const handleOnFocus = () => {
  //   console.log("Focused");
  // };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} className={classes.search}>
          {/* <select>
            {options.map((item) => {
              return <option value="0">Select car:</option>;
            })}
          </select> */}

          {/* <div style={{ width: 400 }}>
            <ReactSearchAutocomplete
              items={options}
              onSearch={handleChange}
              onSelect={handleOnSelect}
              onFocus={handleOnFocus}
              autoFocus
            />
          </div> */}
          <Autocomplete
            id="asynchronous-demo"
            style={{ width: 300 }}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            getOptionSelected={(option:any, value:any) => {
              if (option.name === value.name) {
                console.log(option.name);
                selectedCity(value.lat, value.lon);
              }
              return option.name === value.name;
            }}
            getOptionLabel={(option) =>
              option.name +
              " " +
              option.country +
              " " +
              (option.state === undefined ? "" : option.state)
            }
            options={options}
            // loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={handleChange}
                label="Search..."
                // variant="elevation"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />

          {/* <Cities selectedCity={(lat, lon) => selectedCity(lat, lon)} /> */}
          {/* <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            value={find}
            onChange={handleChange}
          /> */}
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h4" component="h2">
              {city} {country}
            </Typography>
            <Typography variant="h6" component="h5">
              {date}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Typography variant="h2" component="h2">
              <img src={img} alt={alt}></img>
              {temp}°C
            </Typography>
            <Typography variant="h6" component="h5">
              {alt.toUpperCase()}
            </Typography>
            <Typography variant="h6" component="h5">
              Clouds {clouds}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Grid item xs={12}>
              <Typography variant="h6" component="h6">
                Feels like {feel}°C
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h6">
                Dew point {dew}°C
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h6">
                Sun rise {rise} | {set} Sun set
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h6">
                Wind {speed} km/h,
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div>
                <Typography variant="h6" component="h6">
                  {deg}°
                </Typography>
              </div>
              <div
                style={{
                  transform: `rotate(${deg + 180}deg)`,
                  textAlign: "center",
                }}
              >
                <NavigationIcon />
              </div>
            </Grid>
          </Paper>
        </Grid>

        {daily.slice(1).map((item:any) => {
          return (
            <Grid
              item
              sm
              key={
                new Date(item.dt * 1000).toString().slice(0, 3) +
                item.weather[0].description +
                item.temp.day
              }
            >
              <Paper className={classes.paper}>
                <Typography variant="h3" component="h3">
                  <img
                    src={
                      `http://openweathermap.org/img/wn/` +
                      item.weather[0].icon +
                      `.png`
                    }
                    alt={item.weather[0].description}
                  ></img>
                  {item.temp.day.toFixed(0)}
                </Typography>
                <Typography variant="h6" component="h5">
                  {item.temp.max.toFixed(0)} | {item.temp.min.toFixed(0)}°C
                </Typography>
                <Typography variant="h6" component="h5">
                  {item.weather[0].description.toUpperCase()}
                </Typography>
                <Typography variant="h6" component="h5">
                  Clouds {item.clouds}%
                </Typography>
                <Grid item xs>
                  <Typography variant="h6" component="h6">
                    Wind {(item.wind_speed * 3.6).toFixed(0)} km/h,
                  </Typography>
                </Grid>
                <Grid item xs>
                  <div
                    style={{
                      transform: `rotate(${item.wind_deg - 180}deg)`,
                      textAlign: "center",
                    }}
                  >
                    <NavigationIcon />
                  </div>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" component="h6">
                    {new Date(item.dt * 1000).toString().slice(0, 3)}
                  </Typography>
                </Grid>
              </Paper>
            </Grid>
          );
        })}

        <Grid
          container
          spacing={1}
          style={{
            overflow: "scroll",
            display: "flex",
            flexFlow: "row nowrap",
          }}
        >
          {hourly.map((item:any) => {
            return (
              <Grid
                item
                sm
                key={
                  item.clouds +
                  new Date(item.dt * 1000).toString().slice(15, 21) +
                  item.temp +
                  item.wind_deg
                }
              >
                <Paper className={classes.paper}>
                  <Typography variant="h6" component="h6">
                    <img
                      src={
                        `http://openweathermap.org/img/wn/` +
                        item.weather[0].icon +
                        `.png`
                      }
                      alt={item.weather[0].description}
                    ></img>
                    {item.temp.toFixed(0)}°C
                  </Typography>
                  <Typography variant="h6" component="h5">
                    {item.clouds}%
                  </Typography>
                  <Grid item xs>
                    <div
                      style={{
                        transform: `rotate(${item.wind_deg - 180}deg)`,
                        textAlign: "center",
                      }}
                    >
                      <NavigationIcon />
                    </div>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6" component="h6">
                      {new Date(item.dt * 1000).toString().slice(15, 21)}
                    </Typography>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <div style={{ lineHeight: "100px", textAlign: "center" }}>
        Copyright Rinat Sharifullin
      </div>
    </div>
  );
}

export default App;
