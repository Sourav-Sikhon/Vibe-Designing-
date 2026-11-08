/** Drawing-set title block: sheet number, name, scale, revision. Sits at the foot of a sheet. */
export default function TitleBlock({
  no,
  name,
  scale = "NTS",
  rev = "R1",
  className = "",
}: {
  no: string;
  name: string;
  scale?: string;
  rev?: string;
  className?: string;
}) {
  return (
    <div className={`title-block ${className}`} aria-hidden="true">
      <span>{no}</span>
      <span>{name}</span>
      <span>Scale {scale}</span>
      <span>{rev}</span>
    </div>
  );
}
