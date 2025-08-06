import WordSwitcher from '@/components/WordSwitcher';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          WordSwitcher Testing
        </h1>
        <WordSwitcher className="text-white" />
      </div>
    </div>
  );
}
