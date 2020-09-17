import { Component } from 'react';
import axios from '../../axiosInstance';
import { withRouter } from 'react-router-dom'

class Logout extends Component {
  componentDidMount() {
    console.log('inside logout component')
    axios.post('/logout', {})
    .then(result => {
      if(result.status === 200) {
        this.props.loggedInHandler(); //Changing navbar items
        this.props.history.replace("/");  //redirecting
      }
    })
    .catch(err => console.log(err))
  }
  render() {
    return null
  }
}

export default withRouter(Logout);
