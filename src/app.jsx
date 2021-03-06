import React, { Component } from 'react'
import './app.css'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import routes from './routes'
import { initMemoDashClient } from './store/actions'

export class AppComponent extends Component {
  async componentDidMount() {
    await this.props.init()
  }

  render() {
    return <React.Fragment>{routes}</React.Fragment>
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.user.currentUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    init: () => {
      dispatch(initMemoDashClient())
    }
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppComponent)
)
