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
    marginBottom: '30px'
  },
  table: {
    minWidth: 700,
  },
  tableBody: {
    background: '#eaf6ff',
    '& tr td': {
      color: '#3248c7'
    }
  },
  button: {
    color: '#3248c7',
    background: '#ffffff'
  },
  tableRow: {
    height: '65px'
  },
  tableCell: {
    padding: '4px 16px 4px 8px'
  },
  tableCellName: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '200px'
  }
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
    const finishedTasks = tasks.filter(elem => !elem.isRunning);
    
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center" classes={{root: classes.tableCell}}>№</TableCell>
                <TableCell>Task</TableCell>
                <TableCell align="center" classes={{root: classes.tableCell}}>Time start</TableCell>
                <TableCell align="center" classes={{root: classes.tableCell}}>Time end</TableCell>
                <TableCell align="center" classes={{root: classes.tableCell}}>Time spend</TableCell>
                <TableCell align="center" classes={{root: classes.tableCell}}>Info</TableCell>
                <TableCell align="center" classes={{root: classes.tableCell}}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody classes={{root: classes.tableBody}}>
              {finishedTasks.map((row, index )=> {
                const deleteItem = () => this.handleDeleteItem(row.id);
                const timeStart = moment(row.timeStart).format("HH:mm:ss");
                const timeEnd = row.timeEnd ? moment(row.timeEnd).format("HH:mm:ss") : '-';
                const timeDiff = row.timeEnd && moment(row.timeEnd).diff(moment(row.timeStart));
                const timeDiffFormated = timeDiff ? moment.utc(timeDiff-1).format("HH:mm:ss") : '-'
                
                return (
                  <TableRow key={row.id} classes={{root: classes.tableRow}}>
                    <TableCell align="center" classes={{root: classes.tableCell}}>
                      {index + 1}
                    </TableCell>
                    <TableCell classes={{root: classes.tableCellName}}>
                      {_.get(row ,'name', '-')}
                    </TableCell>
                    <TableCell align="right" classes={{root: classes.tableCell}}>{timeStart}</TableCell>
                    <TableCell align="right" classes={{root: classes.tableCell}}>{timeEnd}</TableCell>
                    <TableCell align="right" classes={{root: classes.tableCell}}>{timeDiffFormated}</TableCell>
                    <TableCell align="right" classes={{root: classes.tableCell}}>
                      <Button variant="contained" component={Link} to={`/tasks/${row.id}`} className={classes.button}>
                        Info
                      </Button>
                    </TableCell>
                    <TableCell align="center" classes={{root: classes.tableCell}}>
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
