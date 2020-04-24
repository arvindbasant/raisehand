import React from "react";
import FallbackComponent from "./FallbackComponent";

class ErrorBoundary extends React.Component {
  state = {hasError: false}

  static getDerivedStateFromError(error) {
    return {hasError: true}
  }

  componentDidCatch(error, info) {
    // logErrorToService(error, info.componentStack)
  }

  render() {
    return this.state.hasError
      ? <FallbackComponent/>
      : this.props.children
  }
}

export default ErrorBoundary;