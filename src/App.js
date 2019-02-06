// base
import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';

// material-ui
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

//components
import Timer from './components/Timer';
import Home from './components/Home';
import Chart from './components/Chart';
import Task from './components/Task';

//redux
import { connect } from 'react-redux';
import compose from 'recompose/compose';

const styles = {
  appBar: {
    background: '#00bcd4',
  },
};

function LinkTab(props) {
  return <Tab component={Link} {...props} />;
}


class App extends React.Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };
  
  state = {
    value: 0,
  };
  
  doSomethingBeforeUnload = () => {
    const { info } = this.props;
    localStorage.setItem('state', JSON.stringify(
      {
        info
      }
    ));
  };
  
  setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      return this.doSomethingBeforeUnload();
    });
  };
  
  componentWillMount() {
    if (this.props.location.pathname === '/chart') {
      this.setState({
        value: 1,
      });
    }
  }
  
  componentDidMount() {
    this.setupBeforeUnloadListener();
  }
  
  handleChange = (event, value) => {
  
    this.setState({ value });
  };
  
  render() {
    const { value } = this.state;
    const { classes, location } = this.props;
    const showAppBar = !location.pathname.includes('/tasks/');
    return (
      <Grid container justify="center">
        <Grid item xs={10}>
          <Timer/>
        </Grid>
        <Grid item xs={10}>
          {showAppBar &&
          <AppBar
            position="static"
            className={classes.appBar}
          >
            <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
              <LinkTab to='/' label="Tasks Log"/>
              <LinkTab to='/chart' label="Tasks Chart" />
            </Tabs>
          </AppBar>
          }
          <Switch>
            <Route path='/' component={Home} exact />
            <Route path='/chart' component={Chart} />
            <Route path='/tasks/:id' component={Task}/>
            <Redirect from='*' to='/'/>
          </Switch>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  info: state.info
});

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, null),
)(App);
