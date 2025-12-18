import { Components } from "react-markdown";

/**
 * Markdown components configuration for assistant messages
 * Makes links clickable with proper styling
 */
export const getMarkdownComponents = (): Components => ({
  a: ({ ...props }) => (
    <a
      {...props}
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline hover:text-primary/80 break-all font-normal"
    >
      {props.children}
    </a>
  ),
  p: ({ ...props }) => <p {...props} className="m-0" />,
});
