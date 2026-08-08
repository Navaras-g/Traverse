import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error("Caught by ErrorBoundary:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="max-w-lg mx-auto px-6 py-24 text-center">
                    <p className="font-display text-2xl text-[var(--color-ink)] mb-2">Something went wrong</p>
                    <p className="font-sans text-sm text-[var(--color-muted)] mb-6">
                        This page hit an unexpected error. Try refreshing — your trip selections are still saved.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="font-sans text-sm font-medium bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                    >
                        Refresh
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}