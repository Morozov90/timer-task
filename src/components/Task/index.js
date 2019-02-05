//base
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

//redux
import { connect } from 'react-redux';
import compose from 'recompose/compose';

const styles = {
  container: {
    marginTop: '30px',
  },
};

class Task extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    tasks: PropTypes.array.isRequired,
  };
  
  state = {
    tasks: {}
  };
  
  componentWillMount() {
    const { match, tasks } = this.props;
    if (_.find(tasks, { 'id': match.params.id })) {
      this.setState(() => ({
        task: _.find(tasks, { 'id': match.params.id })
      }));
    } else {
      this.render = () => false;
      this.props.history.push('/');
    }
  }
  
  render() {
    const { task } = this.state;
    const { classes } = this.props;
    const timeStart = moment(task.timeStart).format("HH:mm:ss");
    const timeEnd = task.timeEnd ? moment(task.timeEnd).format("HH:mm:ss") : '-';
    const timeDiff = task.timeEnd && moment(task.timeEnd).diff(moment(task.timeStart));
    const timeDiffFormated = timeDiff ? moment.utc(timeDiff-1).format("HH:mm:ss") : '-';
    
    return (
      <Paper className={classes.container}>
        <List>
          <ListItem>
            <ListItemText primary={_.get(task, 'name', '-')} secondary="Name" />
          </ListItem>
          <ListItem>
            <ListItemText primary={timeStart} secondary="Time start" />
          </ListItem>
          <ListItem>
            <ListItemText primary={timeEnd} secondary="Time end" />
          </ListItem>
          <ListItem>
            <ListItemText primary={timeDiffFormated} secondary="Time spend" />
          </ListItem>
        </List>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.info.tasks
});

export default compose(
  connect(mapStateToProps, null),
  withStyles(styles)
)(Task);
