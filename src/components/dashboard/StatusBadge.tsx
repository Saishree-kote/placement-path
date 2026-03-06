interface StatusBadgeProps {
  status: "eligible" | "almost" | "not-eligible";
  label?: string;
}

const styles = {
  eligible: "bg-secondary/10 text-secondary border-secondary/20",
  almost: "bg-accent/10 text-accent border-accent/20",
  "not-eligible": "bg-destructive/10 text-destructive border-destructive/20",
};

const defaultLabels = {
  eligible: "Eligible",
  almost: "Almost Eligible",
  "not-eligible": "Not Eligible",
};

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {label || defaultLabels[status]}
    </span>
  );
};

export default StatusBadge;
