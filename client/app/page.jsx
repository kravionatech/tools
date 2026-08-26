export default function HomePage() {
  return (
    <main>
      <p className="eyebrow">Kraviona / MERN</p>
      <h1>Build the next useful thing.</h1>
      <p className="intro">
        Next.js frontend ready to connect to the Express and MongoDB API.
      </p>
      <a className="button" href="http://localhost:5000/api/health">
        Check API
      </a>
    </main>
  );
}
