export function InstructionsText() {
  return (
    <div className="space-y-4 text-sm">
      <p>
        To embed your AI chat widget on your website, paste the below snippet into your
        website&apos;s HTML file,
        <span className="font-semibold"> right before the closing body tag</span>.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-medium text-blue-900 mb-2">Features:</h4>
        <ul className="text-blue-800 space-y-1 text-xs">
          <li>• Appears as a small chat bubble in the bottom-right corner</li>
          <li>• Completely transparent background - won&apos;t interfere with your site design</li>
          <li>• No borders, shadows, or styling that affects your original site</li>
          <li>• Click to expand the chat interface</li>
          <li>• Fully responsive and mobile-friendly</li>
        </ul>
      </div>
    </div>
  );
}
