import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    delayMs?: number;
    className?: string;
}

export function Reveal({ children, delayMs = 0, className = "" }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal ${visible ? "visible" : ""} ${className}`}
            style={{ transitionDelay: `${delayMs}ms` }}
        >
            {children}
        </div>
    );
}