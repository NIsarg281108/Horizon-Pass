import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallBack from './ErrorFallBack';

function Layout() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <Outlet />
        </ErrorBoundary>
      </div>
      <Footer />
    </>
  );
}

export default Layout;