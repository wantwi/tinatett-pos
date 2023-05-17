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
        <span>Ooops....Something went wrong. Click button below to return to home</span>
        <code>{this.state.error}</code>
        <Link to="#" onClick={() => window.location.href = '/tinatett/pos/dream-pos/dashboard'} className="btn btn-submit me-2">Reload</Link>
     </div>)
    }
    return this.props.children
  }
}

export default ErrorBoundary