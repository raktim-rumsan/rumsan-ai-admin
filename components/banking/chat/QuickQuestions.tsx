interface QuickQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isLoading: boolean;
}

export function QuickQuestions({
  questions,
  onQuestionClick,
  isLoading,
}: QuickQuestionsProps) {
  return (
    <div className="px-6 py-3 bg-muted/30 border-t border-border">
      <p className="text-xs font-medium text-muted-foreground mb-2">
        Quick Questions:
      </p>
      <div className="flex gap-2 overflow-x-auto overflow-y-hidden pb-1 -mx-6 px-6">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full bg-background border border-border hover:border-primary hover:bg-primary/5 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

