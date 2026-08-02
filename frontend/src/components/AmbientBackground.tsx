export function AmbientBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="ambient-blob" style={{ background: "#A9814A", top: "-10%", left: "-5%" }} />
            <div className="ambient-blob" style={{ background: "#4F7566", top: "40%", right: "-10%", animationDelay: "-8s" }} />
            <div className="ambient-blob" style={{ background: "#7C6485", bottom: "-15%", left: "20%", animationDelay: "-16s" }} />
        </div>
    );
}