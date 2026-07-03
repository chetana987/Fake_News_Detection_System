import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-red-400">Something went wrong</p>
          <p className="text-sm text-gray-500">{this.state.error?.message}</p>
          <Button variant="outline" onClick={() => this.setState({ hasError: false })}>
            Retry
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
