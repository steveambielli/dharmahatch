import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {Howl} from 'howler';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    paddingLeft: 30,
    paddingRight: 30,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  counterMinutes: {
    display: 'inline-block'
  },
  counterSeconds: {
    display: 'none'
  },
});

class Home extends Component {
  constructor() {
    super();
    //CHANGE THIS TO MAKE A DB CALL TO GET GLOBAL COUNTER SECONDS
    let hatchCounter = localStorage.getItem('hatchCounter');
    //CHANGE THIS TO MAKE A DB CALL TO GET GLOBAL COUNTER SECONDS
    if (!hatchCounter || hatchCounter == 0) {
      hatchCounter = 6539;
    }
    this.state = {
      time: {},
      seconds: hatchCounter ,
      secondStyle: {display: 'none'}
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    //let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let minutesTotal = Math.floor(secs / 60);

    let obj = {
      "h": hours,
      "m": minutesTotal,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    this.startTimer();
  }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    //play single beep after every minute
    if (this.state.time.s === 59) {
      new Howl({
        src: ['assets/tick.mp3'],
        autoplay: true,
        loop: false,
        volume: 1
      });
    }

    //loop pong every 2 seconds when we reach under 4 minutes
    if (this.state.time.m <= 3 && this.state.time.m >= 1 && (this.state.time.s%2) === 0) {
      new Howl({
        src: ['assets/pong.mp3'],
        autoplay: true,
        loop: false,
        volume: 1
      });
      this.setState({
        secondStyle: {display: 'inline-block'},
        zeroSeconds: {display: 'none'}
      });
    }

    //loop pong every 2 seconds when we reach under 1 minute
    if (this.state.time.m <= 0 && (this.state.time.s%2) === 0) {
      new Howl({
        src: ['assets/klaxon.mp3'],
        autoplay: true,
        loop: false,
        volume: 1
      });
      clearInterval(this.pongInterval);
      this.setState({
        secondStyle: {display: 'inline-block'},
        zeroSeconds: {display: 'none'}
      });
    }

    //loop system failure every 2 seconds when we reach 0 minutes 0 seconds
    if (seconds === 0) {
      new Howl({
        src: ['assets/system-failure.mp3'],
        autoplay: true,
        loop: true,
        volume: 1
      });
      clearInterval(this.timer);
    }

    //REMOVE THIS ONCE WE MAKE DB CALLS
    localStorage.setItem('hatchCounter', this.state.seconds);
    //REMOVE THIS ONCE WE MAKE DB CALLS
  }

  render() {
    const { classes } = this.props;

    return (
      <div id="home" className={classes.container}>
        <Grid container spacing={24} className={classes.root}> 
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <span className={classes.counterMinutes}>{this.state.time.m}</span>
              <span style={this.state.zeroSeconds}>
                00
              </span>
              <span style={this.state.secondStyle} className={classes.counterSeconds}>
                {this.state.time.s}
              </span>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>xs=6</Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>xs=6</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
