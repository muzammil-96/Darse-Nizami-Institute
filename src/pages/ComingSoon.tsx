export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
      <div className="glass-panel p-12 text-center rounded-xl border border-glass-border">
        <h2 className="text-4xl font-playfair text-gold-light mb-4">{title}</h2>
        <p className="text-parchment/60 max-w-md mx-auto">
          This portal page is currently under development. Please check back later.
        </p>
      </div>
    </div>
  );
}
