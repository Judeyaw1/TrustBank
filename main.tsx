import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { StackProvider } from './lib/stack'
import { stackAuth } from './lib/stack'
import App from './App'
import { ErrorBoundary } from './components/error-boundary'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <StackProvider app={stackAuth}>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <App />
        </Suspense>
      </StackProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

