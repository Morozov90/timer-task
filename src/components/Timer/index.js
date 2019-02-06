// base
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';

//redux
import { addTask, finishTask } from "../../actionCreators/tasks";
import { connect } from 'react-redux';
import compose from 'recompose/compose';

// helpers
const uniqid = require('uniqid');

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  timer: {
    margin: '30px',
    width: '140px',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: '#3248c7',
    fontSize: '1.5rem'
  },
  textField: {
    color: '#3248c7'
  },
  button: {
    color: '#3248c7',
    marginBottom: '20px',
    background: '#ffffff'
  }
};

export class Timer extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    tasks: PropTypes.array.isRequired,
    addTask: PropTypes.func.isRequired,
    finishTask: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      timeStart: false,
      taskName: '',
      open: false,
    };
  }
  
  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
  }
  
  handleChangeName = (event) => {
    this.setState({
      taskName: event.target.value,
    });
  };
  
  handleClose = () => {
    this.setState({ open: false });
  };
  
  componentWillMount() {
    const { tasks } = this.props;
    const currentTask = _.find(tasks, { 'isRunning': true });
    
    if (currentTask) {
      const diffSeconds = moment().diff(moment(currentTask.timeStart), 's');
      this.setState({
        timeStart: true,
        seconds: diffSeconds
      });
      this.interval = setInterval(() => this.tick(), 1000);
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  handleStartTimer = () => {
    const { addTask } = this.props;
    this.setState(() => ({
      timeStart: true
    }));
    addTask(uniqid(), moment().valueOf());
    this.interval = setInterval(() => this.tick(), 1000);
    
  };
  
  handleStopTimer = () => {
    const { taskName } = this.state;
    const { tasks, finishTask } = this.props;
    
    if (taskName !== '') {
      const currentTask = _.find(tasks, { 'isRunning': true });
      finishTask(currentTask.id, taskName, moment().valueOf());
      clearInterval(this.interval);
      this.setState(() => ({
        seconds: 0,
        timeStart: false,
        taskName: ''
      }));
    } else {
      this.setState(() => ({
        open: true
      }));
    }
  };
  
  render() {
    const { classes } = this.props;
    const { timeStart, seconds, taskName, open } = this.state;

    const time = moment.utc(seconds*1000).format("HH:mm:ss");
   
    return (
      <div className={classes.container}>
        <TextField
          id="standard-name"
          label="Name of your task"
          value={taskName}
          onChange={this.handleChangeName}
          margin="normal"
          InputLabelProps={{className: classes.textField}}
        />
        <Paper className={classes.timer}>
          {time}
        </Paper>
        
        {timeStart
          ?
          <Button variant="contained" onClick={this.handleStopTimer} className={classes.button}>
            Stop
          </Button>
          :
          <Button variant="contained" onClick={this.handleStartTimer} className={classes.button}>
            Start
          </Button>
        }
  
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Empty task name"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You are trying close your task without name, enter the title and try again!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.info.tasks
});

const mapDispatchToProps = {
  addTask,
  finishTask,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(Timer);
