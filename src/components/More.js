import { Button } from "react-bootstrap";

export default function More({ pagination, loadNextPage }) {
  let thereAreMore = false;

  if (pagination) {
    const { offset, count, total } = pagination;
    thereAreMore = offset + count < total;
  }

  return (
    <div className="More">
      {thereAreMore ? (
        <Button variant="outline-primary" onClick={loadNextPage}>
          More posts &#43;
        </Button>
      ) : (
        <p>No more posts to display</p>
      )}
    </div>
  );
}
export { More };
