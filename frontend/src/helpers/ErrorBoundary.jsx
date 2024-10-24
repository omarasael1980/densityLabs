import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
   console.log(error)
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de informes de errores
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de repuesto
      return <> 
      <h1 className='text-center text-4xl mt-60 font-bold'>Algo salió mal.</h1>

      <h1 className='text-center text-4xl  font-bold'>Contacta a Sistemas</h1>
       
      </>
        
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
