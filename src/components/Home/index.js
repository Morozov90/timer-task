// base
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

//redux
import { removeTask } from "../../actionCreators/tasks";
import { connect } from 'react-redux';
import compose from 'recompose/compose';

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
    marginTop: '30px',
    marginBottom: '30px'
  },
  table: {
    minWidth: 700,
  },
};

class Home extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    removeTask: PropTypes.func.isRequired,
    tasks: PropTypes.array.isRequired,
  };
  
  handleDeleteItem = (id) => {
    const { removeTask } = this.props;
    removeTask(id)
  };
  
  render() {
    const { classes, tasks } = this.props;
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Task</TableCell>
                <TableCell align="right">Time start</TableCell>
                <TableCell align="right">Time end</TableCell>
                <TableCell align="right">Time spend</TableCell>
                <TableCell align="right">Info</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((row, index )=> {
                const deleteItem = () => this.handleDeleteItem(row.id);
                const timeStart = moment(row.timeStart).format("HH:mm:ss");
                const timeEnd = row.timeEnd ? moment(row.timeEnd).format("HH:mm:ss") : '-';
                const timeDiff = row.timeEnd && moment(row.timeEnd).diff(moment(row.timeStart));
                const timeDiffFormated = timeDiff ? moment.utc(timeDiff-1).format("HH:mm:ss") : '-'
                
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {_.get(row ,'name', '-')}
                    </TableCell>
                    <TableCell align="right">{timeStart}</TableCell>
                    <TableCell align="right">{timeEnd}</TableCell>
                    <TableCell align="right">{timeDiffFormated}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" component={Link} to={`/tasks/${row.id}`} className={classes.button}>
                        Info
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="contained" disabled={row.isRunning} onClick={deleteItem} className={classes.button}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.info.tasks
});

const mapDispatchToProps = {
  removeTask
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(Home);
