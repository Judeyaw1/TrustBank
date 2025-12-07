import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border-2 border-red-500">
            <h1 className="mb-4 text-xl font-bold text-red-600">Application Error</h1>
            <p className="mb-4 text-sm text-gray-700">
              The application failed to render.
            </p>
            {this.state.error && (
              <div className="mb-4 rounded bg-gray-100 p-3 text-xs font-mono text-red-800 overflow-auto max-h-40 border border-gray-300">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded bg-red-600 py-2 text-white hover:bg-red-700 font-bold"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

