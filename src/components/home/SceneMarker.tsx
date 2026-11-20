interface SceneMarkerProps {
  index: string;
  title: string;
}

/** Small narrative marker that labels each scene of the homepage. */
export default function SceneMarker({ index, title }: SceneMarkerProps) {
  return (
    <p className="scene-index">
      <span className="text-[#5af05a]">{index}</span>
      <span aria-hidden="true" className="scene-index-rule" />
      <span>{title}</span>
    </p>
  );
}
