/**
 * "Get directions", built from a text query rather than a fabricated
 * pair of coordinates — nobody has supplied real map coordinates for
 * the venue, and inventing latitude and longitude would be worse than
 * no map link at all. A text query is exactly as useful to Google and
 * Apple Maps and costs nothing to keep accurate as the address itself
 * is refined.
 */
export function MapsActions({ query }: { query: string }) {
  const encoded = encodeURIComponent(query);
  return (
    <div className="maps-actions">
      <a
        className="maps-actions__link"
        href={`https://www.google.com/maps/search/?api=1&query=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Maps
      </a>
      <a className="maps-actions__link" href={`https://maps.apple.com/?q=${encoded}`} target="_blank" rel="noopener noreferrer">
        Open in Apple Maps
      </a>
    </div>
  );
}
