export default function FinalCTA() {
  return (
    <section className="bg-delaware-blue">
      <div className="section-container text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to look up your first property?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Start searching Delaware properties today
        </p>
        <a
          href="/signup"
          className="inline-block bg-delaware-gold text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg"
        >
          Get Started Free
        </a>
        <p className="text-blue-200 mt-4">
          Free searches • No credit card needed
        </p>
      </div>
    </section>
  );
}
