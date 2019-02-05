// base
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';
import _ from 'lodash';

//redux
import { removeAllTasks } from "../../actionCreators/tasks";
import { getTasksRequest } from "../../actionCreators/tasks";
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'

const styles = {
  container: {
    padding: '20px',
    marginTop: '30px'
  },
  button: {
    marginTop: '50px'
  },
  buttonWrapper: {
    textAlign: 'center'
  }
};

export class Timer extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    tasks: PropTypes.array.isRequired,
    removeAllTasks: PropTypes.func.isRequired,
    getTasksRequest: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.bool
  };
  
  state = {
    isRunning: false
  };
  
  componentWillMount() {
    const {tasks} = this.props;
    const currentTask = _.find(tasks, {'isRunning': true});
    this.setState( {
      isRunning: !!currentTask
    })
  }
  
  componentWillReceiveProps(nextProps, nextContext) {
    const tasks = _.get(nextProps, 'tasks')
    const currentTask = _.find(tasks, {'isRunning': true});
    this.setState( {
      isRunning: !!currentTask
    })
  }
  
  render() {
    const { classes, tasks, isLoading, error, getTasksRequest } = this.props;
    const { isRunning } = this.state;
    
    const getData = () => getTasksRequest();
    
    const data = [];
    const startDay = moment().startOf('day').toDate();
    const endDay = moment().endOf('day').toDate();
    
    _.times(24, (index) => {
      data.push({ hours: index, timeSpend: 0 });
    });
  
    tasks.forEach(task => {
      const startTask = moment(task.timeStart);
      const endTask = moment(task.timeEnd);
      const timeStart = {
        hour: startTask.get('hour'),
        minute: startTask.get('minute')
      };
      const timeEnd = {
        hour: endTask.get('hour'),
        minute: endTask.get('minute')
      };
      
      if ((moment(startTask.toDate()).isBetween(startDay, endDay)) && (moment(endTask.toDate()).isBetween(startDay, endDay))) {
        for (let i = timeStart.hour; i <= timeEnd.hour; i++) {
          data[i].timeSpend += (timeStart.hour === timeEnd.hour)
            ? timeEnd.minute - timeStart.minute
            : (i === timeStart.hour)
              ? 60 - timeStart.minute
              : (i === timeEnd.hour)
                ? timeEnd.minute
                : 60;
        }
      }
    });
    
    if(isLoading) {
      return <p>Данные загружаются...</p>
    }
  
    if(error) {
      return <p>Произошла сетевая ошибка</p>
    }
    
    return (
      <React.Fragment>
        <Paper className={classes.container}>
          <ResponsiveContainer width="100%" height={300} >
            <BarChart data={data} style={{ paddingTop: "20px" }} margin={{ bottom: 25, right: 20 }}>
              <CartesianGrid/>
              <XAxis dataKey="hours"/>
              <YAxis ticks={[0, 15, 30, 45, 60]} />
              <Tooltip />
              <Legend/>
              <Bar
                type="monotone"
                dataKey="timeSpend"
                barSize={30}
                fill="#3f51b5"
                name="Minutes"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className={classes.buttonWrapper}>
            <Button variant="contained" disabled={isRunning} onClick={getData} color="primary" className={classes.button}>
              Generate tasks
            </Button>
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.info.tasks
});

const mapDispatchToProps = {
  removeAllTasks,
  getTasksRequest
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(Timer);
