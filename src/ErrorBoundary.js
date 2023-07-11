import React, { Component } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error:''
    }
  }

  componentDidCatch(error, errorInfo) {
    console.log('Logging', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
      <div style={{display:'flex', flexDirection:'column', height: '100vh', justifyContent:'center', alignItems:'center'}}>
        <span>Ooops....Something went wrong. Click button below to go back</span>
        <code>{this.state.error}</code>
        <a className="btn btn-submit me-2" href="#" onClick={() => {
          history.go(-1); 
          setTimeout(() => {
            window.location.reload()
          }, 100)
        }}>Back</a>
        {/* <Link to="#" onClick={() => window.location.href = '/tinatett-pos/dashboard'} className="btn btn-submit me-2">Back to Home</Link> */}
     </div>)
    }
    return this.props.children
  }
}

export default ErrorBoundary